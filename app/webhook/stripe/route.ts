import { db } from '@/utils/db/db'
import { subscriptions } from '@/utils/db/schema'
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    console.log('Webhook received')
    try {
        const response = await request.json()
        console.log(response)
        
        // Stripe webhook処理
        if (response.data?.object?.customer) {
            // サブスクリプションテーブルを更新
            await db.update(subscriptions)
                .set({ 
                    status: response.data.object.status,
                    updatedAt: new Date()
                })
                .where(eq(subscriptions.stripeCustomerId, response.data.object.customer));
        }
        
        // Process the webhook payload
    } catch (error: any) {
        return new Response(`Webhook error: ${error.message}`, {
            status: 400,
        })
    }
    return new Response('Success', { status: 200 })
}