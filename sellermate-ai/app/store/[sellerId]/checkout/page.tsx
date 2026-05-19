'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/components/layout/Navbar'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { CheckCircle2, MessageSquare, ArrowLeft, ShoppingBag } from 'lucide-react'
import { OrderItem } from '@/types'

export default function CheckoutPage() {
  const params = useParams()
  const sellerId = params.sellerId as string
  const supabase = createClient()

  const { cartItems, cartTotal, isMounted, clearCart } = useCart()

  // Seller Details (needed for WhatsApp number)
  const [sellerWhatsApp, setSellerWhatsApp] = useState('')
  const [storeName, setStoreName] = useState('')
  const [loadingSeller, setLoadingSeller] = useState(true)

  // Form State
  const [customerName, setCustomerName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [deliveryNote, setDeliveryNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Success State
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null)

  useEffect(() => {
    async function loadSeller() {
      try {
        if (sellerId === 'demo') {
          setSellerWhatsApp('15550199999')
          setStoreName('Green & Sweet Treats 🥐')
          setLoadingSeller(false)
          return
        }

        const { data, error: err } = await supabase
          .from('sellers')
          .select('whatsapp_number, store_name')
          .eq('id', sellerId)
          .single()

        if (err || !data) {
          throw new Error('Seller profile not found.')
        }

        setSellerWhatsApp(data.whatsapp_number || '')
        setStoreName(data.store_name)
      } catch (e) {
        console.error('Error fetching seller details:', e)
        setError('Could not load seller details. Please verify URL.')
      } finally {
        setLoadingSeller(false)
      }
    }
    if (sellerId) {
      loadSeller()
    }
  }, [sellerId, supabase])

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!customerName.trim() || !whatsappNumber.trim()) {
      setError('Name and WhatsApp Number are required')
      return
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items before checking out.')
      return
    }

    try {
      setIsSubmitting(true)

      const itemsPayload: OrderItem[] = cartItems.map((item) => ({
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      let orderId = ''

      if (sellerId === 'demo') {
        // Generate mock order ID for demo store checkout
        orderId = `order-demo-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      } else {
        // Insert order in Supabase
        const { data, error: insertErr } = await supabase
          .from('orders')
          .insert({
            seller_id: sellerId,
            customer_name: customerName.trim(),
            whatsapp_number: whatsappNumber.trim(),
            delivery_note: deliveryNote.trim() || null,
            items: itemsPayload,
            total: cartTotal,
            status: 'pending',
          })
          .select('id')
          .single()

        if (insertErr) throw insertErr
        orderId = data.id
      }

      setPlacedOrderId(orderId)
      clearCart() // clear local storage cart state
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit order. Please try again.'
      console.error('Checkout error:', err)
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = !isMounted || loadingSeller

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Render Success confirmation screen
  if (placedOrderId) {
    // Build WhatsApp message content
    const itemsListText = cartItems
      .map((item) => `${item.name} x${item.quantity}`)
      .join(', ')
    const orderDetailsMsg = `Hi! I just placed an order on your SellerMate store. Order ID: ${placedOrderId}\n\nItems: ${itemsListText}\nTotal: ${formatPrice(cartTotal)}\n\nPlease confirm when ready!`
    const waUrl = buildWhatsAppUrl(sellerWhatsApp, orderDetailsMsg)

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar storeName={storeName} />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center max-w-md animate-fade-in">
          <Card className="border border-border shadow-2xl rounded-2xl bg-card text-center p-8 space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-whatsapp animate-scale-in" />
            </div>
            <div className="space-y-2">
              <h1 className="font-heading font-extrabold text-2xl text-foreground">
                Order Placed Successfully! 🎉
              </h1>
              <p className="text-sm text-muted-foreground">
                Your order has been recorded. Click the button below to notify the seller and coordinate delivery on WhatsApp.
              </p>
            </div>

            <div className="bg-muted/40 p-4 rounded-xl text-left text-xs space-y-2">
              <div>
                <span className="font-bold text-foreground">Order ID:</span> {placedOrderId}
              </div>
              <div>
                <span className="font-bold text-foreground">Customer Name:</span> {customerName}
              </div>
              <div>
                <span className="font-bold text-foreground">WhatsApp:</span> +{whatsappNumber}
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-sm text-foreground">
                <span>Total Amount:</span>
                <span className="text-whatsapp">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-whatsapp hover:bg-whatsapp-hover text-white font-bold py-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-whatsapp/15">
                  <MessageSquare className="h-5 w-5 fill-current" /> Message Seller on WhatsApp
                </Button>
              </a>
              <Link href={`/store/${sellerId}`}>
                <Button variant="ghost" className="w-full text-muted-foreground font-semibold hover:text-foreground">
                  Return to Store
                </Button>
              </Link>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-12">
      <Navbar storeName={storeName} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-10 max-w-4xl animate-fade-in">
        {/* Back Link */}
        <Link href={`/store/${sellerId}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-semibold mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </Link>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 font-medium mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Checkout Details Form */}
          <div className="lg:col-span-7">
            <Card className="border border-border shadow-sm rounded-2xl bg-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Delivery Information</CardTitle>
                <CardDescription>Enter details to complete your order. Payment is Cash on Delivery.</CardDescription>
              </CardHeader>
              <form onSubmit={handlePlaceOrder}>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customerName" className="font-medium">
                      Your Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="customerName"
                      placeholder="e.g. Jane Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      disabled={isSubmitting}
                      className="rounded-xl border-border bg-transparent"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="whatsappNumber" className="font-medium">
                      Your WhatsApp Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="whatsappNumber"
                      type="tel"
                      placeholder="e.g. 14155552671 (include country code)"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      disabled={isSubmitting}
                      className="rounded-xl border-border bg-transparent"
                      required
                    />
                    <span className="text-[10px] text-muted-foreground">
                      We will contact you here to coordinate details and delivery.
                    </span>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="deliveryNote" className="font-medium">
                      Delivery Note / Special Instructions
                    </Label>
                    <textarea
                      id="deliveryNote"
                      placeholder="e.g. Gate code is #123. Drop off at apartment door 4B."
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      disabled={isSubmitting}
                      rows={3}
                      className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </CardContent>
                <CardContent className="pt-0">
                  <Button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full bg-whatsapp hover:bg-whatsapp-hover text-white font-medium py-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-whatsapp/15"
                  >
                    {isSubmitting ? <LoadingSpinner size="sm" /> : 'Confirm & Place Order'}
                  </Button>
                </CardContent>
              </form>
            </Card>
          </div>

          {/* Right Column: Read-Only Cart Summary */}
          <div className="lg:col-span-5">
            <Card className="border border-border shadow-sm rounded-2xl bg-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-whatsapp" /> Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items in your cart.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {cartItems.map((item) => (
                      <div key={item.product_id} className="py-3 flex justify-between text-sm">
                        <div>
                          <span className="font-semibold text-foreground">{item.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-heading font-medium text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-4 flex justify-between font-heading font-bold text-base text-foreground">
                      <span>Total Due</span>
                      <span className="text-whatsapp">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
