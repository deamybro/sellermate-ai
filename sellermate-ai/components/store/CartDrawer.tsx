import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  cartTotal: number
  updateQuantity: (productId: string, qty: number) => void
  removeItem: (productId: string) => void
  sellerId: string
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  updateQuantity,
  removeItem,
  sellerId,
}: CartDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-card border-l border-border p-0">
        <SheetHeader className="p-5 border-b border-border">
          <SheetTitle className="font-heading font-bold text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-whatsapp" /> Your Cart
          </SheetTitle>
          <SheetDescription className="hidden">Shopping Cart Contents</SheetDescription>
        </SheetHeader>

        {/* Cart items list */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag className="h-14 w-14 text-muted-foreground/30 stroke-[1.2] mb-3" />
              <p className="font-heading font-semibold text-sm text-foreground">Your cart is empty</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                Browse our product catalog to add items here.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product_id}
                className="flex gap-3 pb-4 border-b border-muted/50 last:border-0 last:pb-0"
              >
                <div className="flex-grow">
                  <h4 className="font-heading font-semibold text-sm text-foreground line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-whatsapp font-bold font-heading mt-0.5">
                    {formatPrice(item.price)} each
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-border rounded-lg bg-muted/30 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-1 px-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-semibold px-2 text-foreground min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-1 px-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors ml-auto"
                      title="Remove Item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0 min-w-[60px] self-center">
                  <span className="text-sm font-heading font-bold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-border bg-muted/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
              <span className="text-lg font-heading font-bold text-foreground">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <Link href={`/store/${sellerId}/checkout`} onClick={onClose}>
              <Button className="w-full bg-whatsapp hover:bg-whatsapp-hover text-white font-medium py-3 text-sm flex items-center justify-center gap-2">
                Checkout
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
