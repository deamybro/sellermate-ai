'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  Copy,
  Check,
  LogOut,
  Store,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardSidebarProps {
  storeName: string
  sellerId: string
}

export default function DashboardSidebar({ storeName, sellerId }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    // Generate the customer facing store URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const storeUrl = `${baseUrl}/store/${sellerId}`
    try {
      await navigator.clipboard.writeText(storeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy store link:', err)
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await supabase.auth.signOut()
      router.push('/auth/login')
      router.refresh()
    }
  }

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: ShoppingBag },
    { name: 'Orders', href: '/dashboard/orders', icon: Receipt },
  ]

  return (
    <>
      {/* 1. Desktop Vertical Sidebar (Hidden on Mobile) */}
      <aside className="no-print hidden md:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0">
        {/* Header/Store Title */}
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-whatsapp flex items-center justify-center">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-heading font-extrabold text-sm text-foreground truncate">
              {storeName || 'Seller Store'}
            </h2>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              SellerMate Partner
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow p-4 space-y-1.5 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-whatsapp text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  {item.name}
                </span>
              </Link>
            )
          })}

          {/* Copy Store URL Button */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border mt-6 text-left"
          >
            {copied ? (
              <>
                <Check className="h-4.5 w-4.5 text-whatsapp" />
                <span className="text-whatsapp">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4.5 w-4.5" />
                <span>Copy Store Link</span>
              </>
            )}
          </button>
        </nav>

        {/* Footer/Logout Action */}
        <div className="p-4 border-t border-border mt-auto">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 px-4 py-3 h-auto rounded-xl font-semibold text-sm"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* 2. Mobile Bottom Tab Bar (Hidden on Desktop) */}
      <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-40 flex items-center justify-around px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 flex-1 py-1">
              <span
                className={`flex flex-col items-center justify-center p-1 rounded-full transition-colors ${
                  isActive ? 'text-whatsapp font-bold' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium mt-0.5">{item.name}</span>
              </span>
            </Link>
          );
        })}

        {/* Copy Link Mobile Quick Button */}
        <button
          onClick={handleCopyLink}
          className="flex flex-col items-center gap-1 flex-1 py-1 text-muted-foreground"
        >
          <span className="flex flex-col items-center justify-center p-1">
            {copied ? (
              <Check className="h-5 w-5 text-whatsapp" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
            <span className={`text-[10px] font-medium mt-0.5 ${copied ? 'text-whatsapp' : ''}`}>
              {copied ? 'Copied' : 'Store Link'}
            </span>
          </span>
        </button>

        {/* Logout Quick Button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 flex-1 py-1 text-muted-foreground hover:text-destructive"
        >
          <span className="flex flex-col items-center justify-center p-1">
            <LogOut className="h-5 w-5" />
            <span className="text-[10px] font-medium mt-0.5">Logout</span>
          </span>
        </button>
      </nav>
    </>
  )
}
