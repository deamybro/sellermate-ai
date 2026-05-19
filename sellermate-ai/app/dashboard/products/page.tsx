'use client'

import React, { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import ProductTable from '@/components/dashboard/ProductTable'
import ProductForm from '@/components/dashboard/ProductForm'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Product } from '@/types'

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleAddClick = () => {
    setSelectedProduct(null)
    setIsFormOpen(true)
  }

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (formData: {
    name: string
    description: string | null
    price: number
    stock: number
    image_url: string | null
  }) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, formData)
    } else {
      await addProduct(formData)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground">
            Product Catalog
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your store inventory, pricing, listings and catalog.
          </p>
        </div>
        <Button
          onClick={handleAddClick}
          className="bg-whatsapp hover:bg-whatsapp-hover text-white font-semibold rounded-xl flex items-center gap-2"
        >
          <Plus className="h-4.5 w-4.5" /> Add Product
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 font-medium">
          Error: {error}
        </div>
      )}

      {/* Main Table view */}
      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEditClick}
          onDelete={deleteProduct}
          onAddClick={handleAddClick}
        />
      )}

      {/* Modal Dialog Form */}
      <ProductForm
        isOpen={isFormOpen}
        product={selectedProduct}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
