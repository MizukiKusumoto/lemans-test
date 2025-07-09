import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/utils/stripe/api'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // For demo purposes, create a temporary customer or use existing
    // In production, this should be retrieved from the database
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })
    
    let customerId: string
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      // Create a temporary customer for demo
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
      })
      customerId = customer.id
    }
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3001'}/dashboard`,
    })
    
    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Error generating billing portal link:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}