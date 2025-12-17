import { createBrowserClient } from '@supabase/ssr'

/**
 * 클라이언트 사이드 Supabase 클라이언트
 * 브라우저에서만 사용하며, 서버에서는 절대 사용하지 않음
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

