import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Order } from '@/types'
import { formatDate, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { FileText, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/shared/EmptyState'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

interface OrderTableProps {
  orders: Order[]
  onStatusChange: (orderId: string, status: Order['status']) => Promise<void>
}

export default function OrderTable({ orders, onStatusChange }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders found"
        description="Incoming customer orders from your storefront will appear here."
      />
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="w-[100px]">Total</TableHead>
            <TableHead className="w-[140px]">Status</TableHead>
            <TableHead className="w-[80px] text-right">Invoice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const waLink = buildWhatsAppUrl(
              order.whatsapp_number,
              `Hi ${order.customer_name}! I am confirming your order ID: ${order.id} on my store.`
            )

            // Render a short inline summary of items
            const itemsSummary = order.items
              .map((item) => `${item.name} (x${item.quantity})`)
              .join(', ')

            return (
              <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium align-middle text-xs">
                  {formatDate(order.created_at)}
                </TableCell>
                <TableCell className="align-middle">
                  <div>
                    <div className="font-heading font-semibold text-sm text-foreground">
                      {order.customer_name}
                    </div>
                    {order.delivery_note && (
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs mt-0.5" title={order.delivery_note}>
                        Note: {order.delivery_note}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="align-middle">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-whatsapp hover:underline font-semibold"
                  >
                    <MessageSquare className="h-3.5 w-3.5 fill-current" />
                    {order.whatsapp_number}
                  </a>
                </TableCell>
                <TableCell className="align-middle">
                  <div
                    className="text-xs text-muted-foreground line-clamp-1 max-w-xs"
                    title={itemsSummary}
                  >
                    {itemsSummary}
                  </div>
                </TableCell>
                <TableCell className="font-heading font-medium align-middle text-sm">
                  {formatPrice(order.total)}
                </TableCell>
                <TableCell className="align-middle">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
                    className={`text-xs font-semibold rounded-full px-2.5 py-1 border outline-none cursor-pointer transition-all ${
                      order.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40'
                        : order.status === 'fulfilled'
                        ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/40'
                        : 'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-900/30 dark:text-zinc-400 dark:border-zinc-800/40'
                    }`}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="fulfilled">✅ Fulfilled</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </TableCell>
                <TableCell className="text-right align-middle">
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-whatsapp hover:bg-whatsapp/5"
                      title="View Invoice"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
