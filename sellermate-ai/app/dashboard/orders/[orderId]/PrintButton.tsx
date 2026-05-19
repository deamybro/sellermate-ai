'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="bg-whatsapp hover:bg-whatsapp-hover text-white font-semibold rounded-xl flex items-center gap-2 no-print"
      title="Print this invoice"
    >
      <Printer className="h-4.5 w-4.5" /> Print Invoice
    </Button>
  )
}
