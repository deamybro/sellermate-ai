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
  let { data: seller } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', user.id)
    .single()

  // Self-healing: if the auth user exists but the sellers database row is missing
  // (e.g. database reset/re-init after signup), insert it automatically.
  if (!seller) {
    const { data: newSeller, error: createErr } = await supabase
      .from('sellers')
      .insert({
        id: user.id,
        store_name: 'My Store',
        store_description: 'Welcome to our store!',
        whatsapp_number: '1234567890',
      })
      .select()
      .single()

    if (!createErr && newSeller) {
      seller = newSeller
    }
  }

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
