import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from '@/components/layout/DashboardSidebar'

export const metadata = {
  title: 'Seller Dashboard - SellerMate AI',
  description: 'Manage your products, view orders, and monitor your WhatsApp AI assistant.',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  // Verify auth session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch seller info
  const { data: seller } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', user.id)
    .single()

  const storeName = seller?.store_name || 'My Store'
  const sellerId = user.id

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Responsive Dashboard Sidebar & mobile tabbar */}
      <DashboardSidebar storeName={storeName} sellerId={sellerId} />

      {/* Main dashboard panel */}
      <main className="flex-grow p-4 sm:p-6 md:p-10 overflow-y-auto pb-24 md:pb-10">
        {children}
      </main>
    </div>
  )
}
