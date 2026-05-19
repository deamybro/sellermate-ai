import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const isUrlValid = url.startsWith('http://') || url.startsWith('https://')
  const clientUrl = isUrlValid ? url : 'https://placeholder.supabase.co'
  const clientKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  return createBrowserClient(clientUrl, clientKey)
}
