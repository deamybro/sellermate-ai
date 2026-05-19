'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Product, Seller } from '@/types'
import Navbar from '@/components/layout/Navbar'
import ProductGrid from '@/components/store/ProductGrid'
import CartDrawer from '@/components/store/CartDrawer'
import AIChatWidget from '@/components/store/AIChatWidget'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import EmptyState from '@/components/shared/EmptyState'
import { useCart } from '@/hooks/useCart'
import { ShoppingBag, Coffee } from 'lucide-react'

// Hardcoded Mock Data for Demo Store
const MOCK_SELLER: Seller = {
  id: 'demo',
  store_name: 'Green & Sweet Treats 🥐',
  store_description: 'An artisan bakery serving fresh organic sourdoughs, delicious gluten-free cupcakes, and aromatic Japanese matcha lattes.',
  whatsapp_number: '15550199999',
  created_at: new Date().toISOString(),
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'demo-p1',
    seller_id: 'demo',
    name: 'Artisan Sourdough Bread',
    description: 'Slow-fermented artisan sourdough loaf, baked fresh daily with a crispy crust and light, airy crumb.',
    price: 7.50,
    stock: 12,
    image_url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-p2',
    seller_id: 'demo',
    name: 'Organic Matcha Latte',
    description: 'Ceremonial-grade Japanese matcha whisked with hot water and served with velvety organic oat milk.',
    price: 5.25,
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-p3',
    seller_id: 'demo',
    name: 'GF Chocolate Raspberry Brownie',
    description: 'Decadent dark chocolate brownie infused with sweet fresh raspberries. 100% gluten-free and dairy-free.',
    price: 4.50,
    stock: 8,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-p4',
    seller_id: 'demo',
    name: 'Cold Brew Coffee',
    description: 'Premium organic coffee beans steeped cold for 24 hours to achieve an ultra-smooth, low-acid coffee refreshment.',
    price: 4.75,
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString(),
  },
]

export default function StoreFrontPage() {
  const params = useParams()
  const sellerId = params.sellerId as string
  const supabase = createClient()

  const [seller, setSeller] = useState<Seller | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems, cartTotal, cartCount, addItem, removeItem, updateQuantity } = useCart()

  useEffect(() => {
    async function loadStore() {
      try {
        setLoading(true)
        setError(null)

        if (sellerId === 'demo') {
          // Load demo details
          setSeller(MOCK_SELLER)
          setProducts(MOCK_PRODUCTS)
          setLoading(false)
          return
        }

        // 1. Fetch seller profile (public policy permits)
        const { data: sellerData, error: sellerErr } = await supabase
          .from('sellers')
          .select('*')
          .eq('id', sellerId)
          .single()

        if (sellerErr || !sellerData) {
          throw new Error('Seller store not found.')
        }

        setSeller(sellerData)

        // 2. Fetch available products (stock > 0)
        const { data: productsData, error: productsErr } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', sellerId)
          .gt('stock', 0)
          .order('created_at', { ascending: false })

        if (productsErr) throw productsErr

        const typedProducts: Product[] = (productsData || []).map(p => ({
          ...p,
          price: Number(p.price)
        }))

        setProducts(typedProducts)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Store could not be loaded.'
        console.error('Store load error:', err)
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    if (sellerId) {
      loadStore()
    }
  }, [sellerId, supabase])

  const handleAddToCart = (product: Product) => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
    }, 1)
    setIsCartOpen(true) // Auto slide open cart on adding
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <EmptyState
            title="Store Not Found"
            description="The requested storefront URL does not exist or may have been deactivated by the owner."
            icon={<Coffee className="h-12 w-12 text-muted-foreground" />}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      <Navbar
        storeName={seller.store_name}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Store Header Banner */}
      <section className="bg-white border-b border-border py-12 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="space-y-3 text-center sm:text-left">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground">
              {seller.store_name}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              {seller.store_description || 'Welcome to our online store! Browse our products below and chat with our AI assistant if you have questions.'}
            </p>
          </div>
        </div>
      </section>

      {/* Product Display Area */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-10 max-w-5xl">
        {products.length === 0 ? (
          <EmptyState
            title="Catalog is empty"
            description="No items are currently available for purchase in this store. Check back later!"
            icon={<ShoppingBag className="h-12 w-12 text-muted-foreground" />}
          />
        ) : (
          <div className="space-y-6">
            <h2 className="font-heading font-bold text-xl text-foreground">
              Our Products
            </h2>
            <ProductGrid products={products} onAddToCart={handleAddToCart} />
          </div>
        )}
      </main>

      {/* Cart Slider Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        cartTotal={cartTotal}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        sellerId={sellerId}
      />

      {/* AI Chatbot Floating widget */}
      <AIChatWidget products={products} storeName={seller.store_name} />
    </div>
  )
}
