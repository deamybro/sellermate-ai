import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { OrderItem } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function generateOrderMessage(orderId: string, items: OrderItem[], total: number): string {
  const itemList = items.map(i => `${i.name} x${i.quantity}`).join(', ')
  return `Hi! I just placed an order on your SellerMate store.\n\nOrder ID: ${orderId}\nItems: ${itemList}\nTotal: ${formatPrice(total)}\n\nPlease confirm when ready!`
}

