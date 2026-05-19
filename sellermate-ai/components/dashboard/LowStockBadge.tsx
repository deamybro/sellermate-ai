import React from 'react'
import { Badge } from '@/components/ui/badge'

interface LowStockBadgeProps {
  stock: number
}

export default function LowStockBadge({ stock }: LowStockBadgeProps) {
  if (stock >= 5) return null

  return (
    <Badge variant="destructive" className="bg-destructive text-destructive-foreground animate-pulse text-[10px] uppercase font-bold py-0.5 px-2">
      {stock === 0 ? 'Out of Stock' : `Low Stock: ${stock}`}
    </Badge>
  )
}
