'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Store, Key, Mail } from 'lucide-react'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (authErr) throw authErr

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid email or password. Please try again.'
      console.error('Login error:', err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background blobs for premium appearance */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 bg-whatsapp/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 bg-whatsapp/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-[420px]">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-xl bg-whatsapp flex items-center justify-center shadow-md">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-foreground">
              SellerMate <span className="text-whatsapp">AI</span>
            </span>
          </Link>
          <p className="text-xs text-muted-foreground font-medium">Empowering local micro-merchants</p>
        </div>

        <Card className="border border-border shadow-xl rounded-2xl bg-card">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Welcome Back</CardTitle>
            <CardDescription>Log in to manage your WhatsApp products and orders.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 font-medium">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email" className="font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 rounded-xl border-border bg-transparent"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-medium">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 rounded-xl border-border bg-transparent"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-whatsapp hover:bg-whatsapp-hover text-white font-medium py-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-whatsapp/15"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Log In'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Don&apos;t have a store yet?{' '}
                <Link href="/auth/signup" className="text-whatsapp font-bold hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
