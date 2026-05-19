import React from 'react'
import Link from 'next/link'
import { ShoppingCart, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  storeName?: string
  cartCount?: number
  onCartClick?: () => void
}

export default function Navbar({ storeName, cartCount = 0, onCartClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/85 backdrop-blur shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-whatsapp flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <Store className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading font-extrabold text-lg tracking-tight text-foreground">
            SellerMate <span className="text-whatsapp">AI</span>
          </span>
        </Link>

        {/* Dynamic Store Header details */}
        {storeName ? (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border">
              Store: {storeName}
            </span>
            {onCartClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCartClick}
                className="relative border-border hover:bg-whatsapp hover:text-white hover:border-whatsapp transition-all duration-300 flex items-center gap-2 px-4 rounded-xl"
                title="Open Cart"
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                <span className="hidden sm:inline font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center border border-card animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        ) : (
          /* Landing Page Navigation */
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="font-medium text-foreground hover:text-whatsapp">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-whatsapp hover:bg-whatsapp-hover text-white font-medium rounded-xl">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
