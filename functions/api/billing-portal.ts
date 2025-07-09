import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  STRIPE_SECRET_KEY: string
  NEXT_PUBLIC_WEBSITE_URL: string
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context
  
  try {
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (error || !user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20'
    })

    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })
    
    let customerId: string
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
      })
      customerId = customer.id
    }
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${env.NEXT_PUBLIC_WEBSITE_URL || 'https://lemans-frontend.pages.dev'}/dashboard`,
    })
    
    return new Response(JSON.stringify({ url: portalSession.url }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error generating billing portal link:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}