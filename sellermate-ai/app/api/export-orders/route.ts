import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()

    // 1. Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // 2. Fetch all orders for this seller
    const { data: ordersData, error: ordersErr } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })

    if (ordersErr) {
      throw ordersErr
    }

    // 3. Build CSV headers and rows
    const headers = [
      'Date',
      'Order ID',
      'Customer Name',
      'WhatsApp Number',
      'Items Purchased',
      'Total Amount ($)',
      'Status',
    ]

    const rows = (ordersData || []).map((order) => {
      // Parse items
      const items = Array.isArray(order.items)
        ? order.items
        : typeof order.items === 'string'
        ? JSON.parse(order.items)
        : []

      const itemsSummary = items
        .map((it: { name: string; quantity: number }) => `${it.name} (x${it.quantity})`)
        .join('; ')

      // Escape quotes for CSV safety
      const escape = (val: string) => `"${(val || '').replace(/"/g, '""')}"`

      return [
        formatDate(order.created_at),
        order.id,
        escape(order.customer_name),
        order.whatsapp_number,
        escape(itemsSummary),
        Number(order.total).toFixed(2),
        order.status,
      ].join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\r\n')

    // 4. Return as attachment file download
    const filename = `sellermate_orders_${new Date().toISOString().split('T')[0]}.csv`
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('CSV Export Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'CSV export failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
