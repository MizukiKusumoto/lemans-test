import { Stripe } from 'stripe';
import { db } from '../db/db';
import { users, subscriptions } from '../db/schema';
import { eq } from "drizzle-orm";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ? process.env.NEXT_PUBLIC_WEBSITE_URL : "http://localhost:3000"

export async function getStripePlan(email: string) {
    const user = await db.select().from(users).where(eq(users.email, email))
    if (!user[0]) throw new Error('User not found')
    
    const subscription = await db.select().from(subscriptions).where(eq(subscriptions.userId, user[0].id))
    if (!subscription[0]) throw new Error('Subscription not found')
    
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription[0].stripeSubscriptionId!);
    const productId = stripeSubscription.items.data[0].plan.product as string
    const product = await stripe.products.retrieve(productId)
    return product.name
}

export async function createStripeCustomer(id: string, email: string, name?: string) {
    const customer = await stripe.customers.create({
        name: name ? name : "",
        email: email,
        metadata: {
            supabase_id: id
        }
    });
    return customer.id
}

// Removed: createStripeCheckoutSession function
// Subscription management is now handled via Stripe billing portal

export async function generateStripeBillingPortalLink(email: string) {
    const user = await db.select().from(users).where(eq(users.email, email))
    if (!user[0]) throw new Error('User not found')
    
    const subscription = await db.select().from(subscriptions).where(eq(subscriptions.userId, user[0].id))
    if (!subscription[0]) throw new Error('Subscription not found')
    
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: subscription[0].stripeCustomerId,
        return_url: `${PUBLIC_URL}/dashboard`,
    });
    return portalSession.url
}