'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useProducts } from '@/hooks/useProducts'
import { useOrders } from '@/hooks/useOrders'
import StatsCard from '@/components/dashboard/StatsCard'
import OrderTable from '@/components/dashboard/OrderTable'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  ShoppingBag,
  Receipt,
  DollarSign,
  AlertTriangle,
  ExternalLink,
  Plus,
  ArrowRight,
} from 'lucide-react'

export default function DashboardHome() {
  const supabase = createClient()
  const { products, loading: productsLoading } = useProducts()
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders()
  const [sellerId, setSellerId] = useState<string | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setSellerId(user.id)
      }
      setLoadingUser(false)
    }
    getUser()
  }, [supabase])

  const loading = productsLoading || ordersLoading || loadingUser

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Calculate Metrics
  const totalProducts = products.length
  const lowStockCount = products.filter((p) => p.stock < 5).length
  const totalOrders = orders.length
  const fulfilledOrders = orders.filter((o) => o.status === 'fulfilled')
  const revenue = fulfilledOrders.reduce((sum, o) => sum + o.total, 0)

  // Get last 5 orders
  const recentOrders = orders.slice(0, 5)

  const storeUrl = sellerId ? `/store/${sellerId}` : '#'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time performance details for your store sales.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={storeUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-border hover:bg-muted font-semibold rounded-xl flex items-center gap-2">
              View Store <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/products">
            <Button className="bg-whatsapp hover:bg-whatsapp-hover text-white font-semibold rounded-xl flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={<ShoppingBag className="h-5 w-5" />}
          description="Active catalog listings"
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          icon={<Receipt className="h-5 w-5" />}
          description="Received requests"
        />
        <StatsCard
          title="Total Revenue"
          value={formatPrice(revenue)}
          icon={<DollarSign className="h-5 w-5" />}
          description="Fulfilled store sales"
        />
        <StatsCard
          title="Low Stock"
          value={lowStockCount}
          icon={<AlertTriangle className="h-5 w-5" />}
          description="Items with stock < 5"
        />
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-foreground">
            Recent Orders
          </h2>
          {orders.length > 5 && (
            <Link href="/dashboard/orders" className="text-xs text-whatsapp hover:underline font-bold flex items-center gap-1">
              View all orders <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        <OrderTable orders={recentOrders} onStatusChange={updateOrderStatus} />
      </div>
    </div>
  )
}
