'use client'

import React, { useState } from 'react'
import { useOrders } from '@/hooks/useOrders'
import OrderTable from '@/components/dashboard/OrderTable'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function OrdersPage() {
  const { orders, loading, error, updateOrderStatus } = useOrders()
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'fulfilled' | 'cancelled'>('all')

  const handleExportCSV = () => {
    // Navigate to the protected CSV export endpoint (sends cookies automatically)
    window.location.href = '/api/export-orders'
  }

  // Filter orders by status
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true
    return order.status === activeTab
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground">
            Order Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track customer orders, update delivery status, and view invoices.
          </p>
        </div>
        <Button
          onClick={handleExportCSV}
          disabled={loading || orders.length === 0}
          className="bg-whatsapp hover:bg-whatsapp-hover text-white font-semibold rounded-xl flex items-center gap-2"
          title="Download order details as a CSV file"
        >
          <FileDown className="h-4.5 w-4.5" /> Export CSV
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 font-medium">
          Error: {error}
        </div>
      )}

      {/* Filter Tabs & Content */}
      <Tabs
        defaultValue="all"
        onValueChange={(val) => setActiveTab(val as 'all' | 'pending' | 'fulfilled' | 'cancelled')}
        className="w-full space-y-6"
      >
        <TabsList className="bg-muted/40 border border-border p-1 rounded-xl">
          <TabsTrigger value="all" className="rounded-lg font-semibold text-xs py-2 px-4 data-[state=active]:bg-whatsapp data-[state=active]:text-white">
            All Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg font-semibold text-xs py-2 px-4 data-[state=active]:bg-whatsapp data-[state=active]:text-white">
            ⏳ Pending ({orders.filter(o => o.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="fulfilled" className="rounded-lg font-semibold text-xs py-2 px-4 data-[state=active]:bg-whatsapp data-[state=active]:text-white">
            ✅ Fulfilled ({orders.filter(o => o.status === 'fulfilled').length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="rounded-lg font-semibold text-xs py-2 px-4 data-[state=active]:bg-whatsapp data-[state=active]:text-white">
            ❌ Cancelled ({orders.filter(o => o.status === 'cancelled').length})
          </TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="h-[40vh] flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <OrderTable orders={filteredOrders} onStatusChange={updateOrderStatus} />
        )}
      </Tabs>
    </div>
  )
}
