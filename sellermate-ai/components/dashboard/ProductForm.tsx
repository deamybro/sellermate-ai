import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Product } from '@/types'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

interface ProductFormProps {
  product?: Product | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    description: string | null
    price: number
    stock: number
    image_url: string | null
  }) => Promise<void>
}

export default function ProductForm({
  product,
  isOpen,
  onClose,
  onSubmit,
}: ProductFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('0')
  const [imageUrl, setImageUrl] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description || '')
      setPrice(product.price.toString())
      setStock(product.stock.toString())
      setImageUrl(product.image_url || '')
    } else {
      setName('')
      setDescription('')
      setPrice('')
      setStock('0')
      setImageUrl('')
    }
    setError(null)
  }, [product, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!name.trim()) {
      setError('Product Name is required')
      return
    }
    const numPrice = parseFloat(price)
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Price must be a valid number greater than 0')
      return
    }
    const numStock = parseInt(stock)
    if (isNaN(numStock) || numStock < 0) {
      setError('Stock must be a non-negative integer')
      return
    }

    try {
      setLoading(true)
      await onSubmit({
        name: name.trim(),
        description: description.trim() || null,
        price: numPrice,
        stock: numStock,
        image_url: imageUrl.trim() || null,
      })
      onClose()
    } catch (err: any) {
      console.error('Save product error details:', err)
      const message = err?.message || err?.details || (typeof err === 'string' ? err : 'Failed to save product. Please try again.')
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {product ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {product
                ? 'Update your product details below. Changes will sync immediately.'
                : 'Create a new item in your digital store catalog.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 font-medium">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name" className="font-medium">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Wireless Headphones"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-medium">
                Description
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a compelling product details description..."
                rows={3}
                disabled={loading}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="font-medium">
                  Price ($) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="29.99"
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock" className="font-medium">
                  Stock Qty <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl" className="font-medium">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={loading}
              />
              {imageUrl.trim() && (
                <div className="mt-2 flex items-center justify-center p-2 border border-border rounded-lg bg-muted/30">
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="h-20 w-20 object-cover rounded-md"
                    onError={(e) => {
                      // fallback for invalid url
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/150?text=Invalid+Image+URL'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-whatsapp hover:bg-whatsapp-hover text-white font-medium min-w-[80px]"
            >
              {loading ? <LoadingSpinner size="sm" /> : product ? 'Save' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
