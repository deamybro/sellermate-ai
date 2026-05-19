import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Package } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0

  return (
    <Card className="glass-card flex flex-col h-full overflow-hidden border border-white/30 shadow-lg shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/40 hover:-translate-y-1.5 transition-all duration-300 group">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-muted/20 overflow-hidden border-b border-border/40">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/400?text=Product'
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
            <Package className="h-10 w-10 stroke-[1.2] mb-1" />
            <span className="text-[10px] font-semibold">No Image</span>
          </div>
        )}
        
        {/* Modern Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOutOfStock ? (
            <span className="bg-destructive text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Out of stock
            </span>
          ) : product.stock < 5 ? (
            <span className="bg-amber-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Only {product.stock} left
            </span>
          ) : null}
        </div>
      </div>

      {/* Product Body */}
      <CardHeader className="p-5 pb-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading font-extrabold text-base text-foreground line-clamp-1 group-hover:text-whatsapp transition-colors">
            {product.name}
          </h3>
          <span className="font-heading font-extrabold text-base text-whatsapp shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 pb-5 flex-grow">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[36px]">
          {product.description || 'No description provided.'}
        </p>
        <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Stock Available
          </span>
          <span className="text-xs font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded-md">
            {product.stock} pcs
          </span>
        </div>
      </CardContent>

      {/* Add to Cart button */}
      <CardFooter className="p-5 pt-0 mt-auto">
        <Button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className="w-full bg-whatsapp hover:bg-whatsapp-hover text-white font-bold py-5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-whatsapp/10 transform active:scale-[0.98] transition-all duration-200"
        >
          <ShoppingCart className="h-4 w-4" />
          {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}
