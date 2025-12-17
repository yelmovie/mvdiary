import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * 로그인 API
 * ID/PW 기반 인증 후 role 기반 자동 분기 정보 반환
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 로그인
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.' },
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 프로필 정보 조회 (role 확인)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, display_name, school_id')
      .eq('user_id', authData.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: '프로필 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // role 기반 리다이렉트 경로 반환
    const redirectPath =
      profile.role === 'student' ? '/student/dashboard' : '/teacher/dashboard'

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile.role,
        displayName: profile.display_name,
        schoolId: profile.school_id,
      },
      redirectPath,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

