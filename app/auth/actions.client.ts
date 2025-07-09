'use client'

import { createClient } from '@/utils/supabase/client'

const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ? process.env.NEXT_PUBLIC_WEBSITE_URL : "http://localhost:3000"

export async function resetPassword(passwordData: { password: string, confirm_password: string, code: string }) {
    const supabase = createClient()
    
    if (passwordData.password !== passwordData.confirm_password) {
        return { message: "Passwords do not match" }
    }

    const { data } = await supabase.auth.exchangeCodeForSession(passwordData.code)

    let { error } = await supabase.auth.updateUser({
        password: passwordData.password
    })
    
    if (error) {
        return { message: error.message }
    }
    
    return { message: "Password updated successfully", success: true }
}

export async function forgotPassword(email: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${PUBLIC_URL}/forgot-password/reset` })

    if (error) {
        return { message: error.message }
    }
    
    return { message: "Password reset email sent", success: true }
}

export async function signup(data: { email: string, password: string, name: string }) {
    const supabase = createClient()

    try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                emailRedirectTo: `${PUBLIC_URL}/auth/callback`,
                data: {
                    full_name: data.name
                }
            }
        })

        if (signUpError) {
            if (signUpError.message.includes("already registered")) {
                return { message: "An account with this email already exists. Please login instead." }
            }
            return { message: signUpError.message }
        }

        if (!signUpData?.user) {
            return { message: "Failed to create user" }
        }

        const emailConfirmationRequired = !signUpData.user.email_confirmed_at;
        
        if (emailConfirmationRequired) {
            return { 
                message: "Account created successfully! Please check your email to verify your account.", 
                success: true,
                requiresEmailConfirmation: true
            }
        } else {
            return { 
                message: "Account created and verified successfully! You can now login.", 
                success: true,
                requiresEmailConfirmation: false
            }
        }
    } catch (error) {
        console.error('Error in signup:', error)
        return { message: "Failed to setup user account" }
    }
}

export async function loginUser(data: { email: string, password: string }) {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { message: error.message }
    }

    return { message: "Login successful", success: true }
}

export async function logout() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
        return { message: error.message }
    }
    
    return { message: "Logged out successfully", success: true }
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

    return { url: data.url }
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

    return { url: data.url }
}