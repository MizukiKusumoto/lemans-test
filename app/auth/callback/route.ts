import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
// import { createStripeCustomer } from '@/utils/stripe/api'
// import { db } from '@/utils/db/db'
// import { users } from '@/utils/db/schema'
// import { eq } from "drizzle-orm";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    console.log('Auth callback called with:', { code, origin, next })

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error) {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            console.log('User authenticated successfully:', user?.email)

            // Skip database operations for now
            // TODO: Re-enable when database schema is properly set up
            /*
            // check to see if user already exists in db
            const checkUserInDB = await db.select().from(users).where(eq(users.email, user!.email!))
            const isUserInDB = checkUserInDB.length > 0 ? true : false
            if (!isUserInDB) {
                // create Stripe customers
                const stripeID = await createStripeCustomer(user!.id, user!.email!, user!.user_metadata.full_name)
                // Create record in DB
                await db.insert(users).values({ 
                    supabaseUserId: user!.id, 
                    name: user!.user_metadata.full_name, 
                    email: user!.email!, 
                    status: 'active'
                })
            }
            */

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            
            const redirectUrl = isLocalEnv 
                ? `${origin}${next}`
                : forwardedHost 
                    ? `https://${forwardedHost}${next}`
                    : `${origin}${next}`;
            
            console.log('Redirecting to:', redirectUrl)
            return NextResponse.redirect(redirectUrl)
        } else {
            console.error('Auth exchange error:', error)
            return NextResponse.redirect(`${origin}/auth/auth-code-error`)
        }
    }

    console.log('No code provided, redirecting to error page')
    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}