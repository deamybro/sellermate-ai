import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Store } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { Order } from '@/types'
import PrintButton from './PrintButton'

interface InvoicePageProps {
  params: {
    orderId: string
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const supabase = createClient()

  // Verify auth session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch order data
  const { data: orderData, error: orderErr } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.orderId)
    .single()

  if (orderErr || !orderData) {
    notFound()
  }

  const order: Order = {
    ...orderData,
    total: Number(orderData.total),
    items: Array.isArray(orderData.items)
      ? orderData.items
      : typeof orderData.items === 'string'
      ? JSON.parse(orderData.items)
      : [],
  }

  // Fetch seller info to show store name
  const { data: seller } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', order.seller_id)
    .single()

  const storeName = seller?.store_name || 'My Store'
  const whatsappNumber = seller?.whatsapp_number || 'N/A'

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Back & Print controls */}
      <div className="flex items-center justify-between no-print border-b border-border pb-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="sm" className="rounded-xl flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Button>
        </Link>
        <PrintButton />
      </div>

      {/* Invoice Sheet */}
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-10 relative overflow-hidden bg-white text-slate-900 dark:text-slate-900 dark:bg-white">
        {/* Subtle decorative banner on invoice */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-whatsapp"></div>

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-whatsapp flex items-center justify-center">
                <Store className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-heading font-extrabold text-lg text-slate-800">
                {storeName}
              </span>
            </div>
            <p className="text-xs text-slate-500">WhatsApp Storefront</p>
            {whatsappNumber && <p className="text-xs text-slate-500 mt-0.5">Contact: +{whatsappNumber}</p>}
          </div>

          <div className="sm:text-right">
            <h2 className="font-heading font-extrabold text-2xl text-slate-800 tracking-tight">
              INVOICE
            </h2>
            <p className="text-xs text-slate-500 mt-1">Invoice ID: #{order.id.slice(0, 8)}</p>
            <p className="text-xs text-slate-500 mt-0.5">Date: {formatDate(order.created_at)}</p>
          </div>
        </div>

        {/* Customer & Order summary details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-slate-200 text-xs">
          <div>
            <h3 className="font-heading font-bold text-slate-400 uppercase tracking-wider mb-2">
              Bill To:
            </h3>
            <div className="text-sm font-semibold text-slate-800">{order.customer_name}</div>
            <div className="text-slate-500 mt-1">WhatsApp: +{order.whatsapp_number}</div>
            {order.delivery_note && (
              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 italic">
                &ldquo;{order.delivery_note}&rdquo;
              </div>
            )}
          </div>

          <div className="md:text-right">
            <h3 className="font-heading font-bold text-slate-400 uppercase tracking-wider mb-2 md:text-right">
              Order Status:
            </h3>
            <div className="inline-flex items-center">
              <span
                className={`text-xs font-semibold rounded-full px-3 py-1 uppercase tracking-wider ${
                  order.status === 'pending'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : order.status === 'fulfilled'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-slate-500 mt-3">Payment Method: Cash on Delivery (COD)</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-8">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="py-3">Product Item</th>
                <th className="py-3 text-center w-[80px]">Quantity</th>
                <th className="py-3 text-right w-[120px]">Unit Price</th>
                <th className="py-3 text-right w-[120px]">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, index) => (
                <tr key={item.product_id || index} className="text-slate-700">
                  <td className="py-4.5 font-semibold text-slate-800">{item.name}</td>
                  <td className="py-4.5 text-center">{item.quantity}</td>
                  <td className="py-4.5 text-right">{formatPrice(item.price)}</td>
                  <td className="py-4.5 text-right font-semibold text-slate-800">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Row */}
        <div className="pt-4 border-t border-slate-200 flex flex-col items-end gap-2 text-xs">
          <div className="flex justify-between w-full max-w-[280px] text-slate-500">
            <span>Subtotal</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between w-full max-w-[280px] text-slate-500">
            <span>Delivery Fee</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between w-full max-w-[280px] text-sm font-bold text-slate-800 pt-2 border-t border-slate-100">
            <span>Total Amount Due</span>
            <span className="text-base text-whatsapp">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="mt-12 pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400">
          <p className="font-medium">Thank you for your business!</p>
          <p className="mt-1">Powered by SellerMate AI — WhatsApp Micro-Store Builder</p>
        </div>
      </div>
    </div>
  )
}
