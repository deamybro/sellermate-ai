import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Package } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import LowStockBadge from './LowStockBadge'
import EmptyState from '@/components/shared/EmptyState'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onAddClick?: () => void
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onAddClick,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products yet"
        description="Add items to your catalog so customers can start browsing your online store."
        action={
          onAddClick && (
            <Button
              onClick={onAddClick}
              className="bg-whatsapp hover:bg-whatsapp-hover text-white font-medium"
            >
              Add Your First Product
            </Button>
          )
        }
      />
    )
  }

  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead className="w-[120px]">Price</TableHead>
            <TableHead className="w-[150px]">Stock Status</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-muted/20 transition-colors">
              <TableCell className="align-middle">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-10 w-10 object-cover rounded-md border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/100?text=Product'
                    }}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border border-border">
                    <Package className="h-5 w-5 text-muted-foreground stroke-[1.5]" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium align-middle">
                <div>
                  <div className="font-heading font-semibold text-sm text-foreground">
                    {product.name}
                  </div>
                  {product.description && (
                    <div className="text-xs text-muted-foreground line-clamp-1 max-w-sm mt-0.5">
                      {product.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-heading font-medium align-middle text-sm">
                {formatPrice(product.price)}
              </TableCell>
              <TableCell className="align-middle">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{product.stock} pcs</span>
                  <LowStockBadge stock={product.stock} />
                </div>
              </TableCell>
              <TableCell className="text-right align-middle">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                    className="h-8 w-8 hover:text-whatsapp hover:bg-whatsapp/5"
                    title="Edit Product"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(product.id, product.name)}
                    className="h-8 w-8 hover:text-destructive hover:bg-destructive/5"
                    title="Delete Product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
