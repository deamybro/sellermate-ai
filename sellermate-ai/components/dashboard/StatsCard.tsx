import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
}

export default function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <Card className="glass-card overflow-hidden border border-white/30 dark:border-slate-800/40 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-whatsapp/5 hover:-translate-y-1.5 transition-all duration-300 group relative">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 h-24 w-24 bg-whatsapp/5 rounded-full blur-2xl group-hover:bg-whatsapp/10 transition-colors duration-300" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-whatsapp bg-whatsapp/10 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-2">
        <div className="text-3xl font-extrabold font-heading text-foreground tracking-tight">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
