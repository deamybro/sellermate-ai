import React from 'react'
import { FolderOpen } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-muted rounded-2xl bg-card">
      <div className="text-muted-foreground mb-4">
        {icon || <FolderOpen className="h-12 w-12 stroke-[1.5]" />}
      </div>
      <h3 className="text-lg font-bold font-heading mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
