import { createClient } from '@supabase/supabase-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { subscriptions } from '@/utils/db/schema'
import { eq } from 'drizzle-orm'

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  DATABASE_URL: string
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context
  
  try {
    const response = await request.json()
    console.log('Webhook received:', response)
    
    // データベース接続
    const connection = postgres(process.env.DATABASE_URL!); 
    const db = drizzle(connection)
    
    // Stripe webhook処理
    if (response.data?.object?.customer) {
      await db.update(subscriptions)
        .set({ 
          status: response.data.object.status,
          updatedAt: new Date()
        })
        .where(eq(subscriptions.stripeCustomerId, response.data.object.customer))
    }
    
    return new Response('Success', { status: 200 })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }
}