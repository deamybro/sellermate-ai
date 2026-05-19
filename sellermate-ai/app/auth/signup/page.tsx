'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Store, Mail, Key, Phone } from 'lucide-react'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [storeName, setStoreName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validations
    if (!storeName.trim() || !whatsappNumber.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    try {
      setLoading(true)

      // 1. Sign up user
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      })

      if (signUpErr) throw signUpErr

      const user = signUpData.user
      if (!user) {
        throw new Error('Registration succeeded, but no user was returned. Please check email confirmation.')
      }

      // 2. Insert into sellers table (RLS policy allows this for auth.uid() = id)
      const { error: dbErr } = await supabase.from('sellers').insert({
        id: user.id,
        store_name: storeName.trim(),
        whatsapp_number: whatsappNumber.trim(),
        store_description: '', // default empty description
      })

      if (dbErr) {
        console.error('Database insert error:', dbErr)
        // If DB insert failed, attempt to delete auth user or just report error
        throw new Error(`Auth created, but store setup failed: ${dbErr.message}`)
      }

      // Success - redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred during registration. Please try again.'
      console.error('Signup error:', err)
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

      <div className="w-full max-w-[440px]">
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
            <CardTitle className="font-heading text-xl">Create Your Store</CardTitle>
            <CardDescription>Launch your digital shop and AI sales assistant in minutes.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 font-medium">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="storeName" className="font-medium">
                  Store Name
                </Label>
                <div className="relative">
                  <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="storeName"
                    type="text"
                    placeholder="e.g. Joy Bakery"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="pl-9 rounded-xl border-border bg-transparent"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="whatsappNumber" className="font-medium">
                  WhatsApp Number (with Country Code)
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="whatsappNumber"
                    type="tel"
                    placeholder="e.g. 15551234567"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="pl-9 rounded-xl border-border bg-transparent"
                    disabled={loading}
                    required
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Include country code, no spaces or special symbols (e.g. 14155552671).
                </span>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="merchant@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 rounded-xl border-border bg-transparent"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 6 characters"
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
                {loading ? <LoadingSpinner size="sm" /> : 'Register & Create Store'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Already have a store?{' '}
                <Link href="/auth/login" className="text-whatsapp font-bold hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
