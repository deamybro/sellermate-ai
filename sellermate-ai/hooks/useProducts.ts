import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setProducts([])
        return
      }

      const { data, error: fetchErr } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr

      const typedProducts: Product[] = (data || []).map(p => ({
        ...p,
        price: Number(p.price)
      }))

      setProducts(typedProducts)
    } catch (err: any) {
      console.error('Error fetching products:', err)
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const addProduct = async (productData: Omit<Product, 'id' | 'seller_id' | 'created_at'>) => {
    try {
      setError(null)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertErr } = await supabase
        .from('products')
        .insert({
          ...productData,
          seller_id: user.id
        })

      if (insertErr) throw insertErr
      await fetchProducts()
    } catch (err: any) {
      console.error('Error adding product:', err)
      setError(err.message || 'Failed to add product')
      throw err
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      setError(null)
      const { error: updateErr } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)

      if (updateErr) throw updateErr
      await fetchProducts()
    } catch (err: any) {
      console.error('Error updating product:', err)
      setError(err.message || 'Failed to update product')
      throw err
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      setError(null)
      const { error: deleteErr } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (deleteErr) throw deleteErr
      await fetchProducts()
    } catch (err: any) {
      console.error('Error deleting product:', err)
      setError(err.message || 'Failed to delete product')
      throw err
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  }
}
