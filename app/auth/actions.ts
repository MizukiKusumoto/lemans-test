'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ? process.env.NEXT_PUBLIC_WEBSITE_URL : "http://localhost:3000"

export async function loginUser(prevState: any, formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { message: error.message }
    }

    redirect('/dashboard')
}

export async function signInWithGoogle() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${PUBLIC_URL}/auth/callback`,
        },
    })

    if (error) {
        return { message: error.message }
    }

    redirect(data.url)
}

export async function signInWithGithub() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${PUBLIC_URL}/auth/callback`,
        },
    })

    if (error) {
        return { message: error.message }
    }

    redirect(data.url)
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `${PUBLIC_URL}/auth/callback`,
        },
    })

    if (error) {
        return { message: error.message, success: false }
    }

    return { message: '確認メールを送信しました。メールを確認してください。', success: true, requiresEmailConfirmation: true }
}

export async function forgotPassword(prevState: any, formData: FormData) {
    const supabase = createClient()
    
    const email = formData.get('email') as string

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${PUBLIC_URL}/auth/reset-password`,
    })

    if (error) {
        return { message: error.message }
    }

    return { message: 'パスワードリセット用のメールを送信しました。' }
}

export async function resetPassword(prevState: any, formData: FormData) {
    const supabase = createClient()
    
    const password = formData.get('password') as string

    const { error } = await supabase.auth.updateUser({
        password: password,
    })

    if (error) {
        return { message: error.message }
    }

    redirect('/dashboard')
}

export async function logout() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
        throw new Error(error.message)
    }
    
    redirect('/login')
}