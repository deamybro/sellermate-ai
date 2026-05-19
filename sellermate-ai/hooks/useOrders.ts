import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/types'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setOrders([])
        return
      }

      const { data, error: fetchErr } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr

      const typedOrders: Order[] = (data || []).map(o => ({
        ...o,
        total: Number(o.total),
        items: Array.isArray(o.items)
          ? o.items
          : typeof o.items === 'string'
          ? JSON.parse(o.items)
          : []
      }))

      setOrders(typedOrders)
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      setError(null)
      const { error: updateErr } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (updateErr) throw updateErr
      
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status } : o))
      )
    } catch (err: any) {
      console.error('Error updating order status:', err)
      setError(err.message || 'Failed to update order status')
      throw err
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus
  }
}
