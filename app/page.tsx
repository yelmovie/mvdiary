import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginPage from '@/components/auth/LoginPage'

/**
 * 루트 페이지
 * 인증 상태에 따라 자동 리다이렉트
 */
export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // 프로필 조회하여 role 기반 리다이렉트
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profile) {
      if (profile.role === 'student') {
        redirect('/student/dashboard')
      } else {
        redirect('/teacher/dashboard')
      }
    }
  }

  return <LoginPage />
}

