import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')
  const body = await request.text()
  
  let receivedEvent
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message)
    return new Response(err.message, { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  console.log(`🔔  Webhook received: ${receivedEvent.type}`)

  switch (receivedEvent.type) {
    case 'checkout.session.completed':
      const session = receivedEvent.data.object
      
      // Update or create subscription
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: session.metadata.userId,
          plan_type: session.metadata.planType,
          status: 'active',
          stripe_subscription_id: session.subscription,
          stripe_customer_id: session.customer,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          updated_at: new Date().toISOString(),
        })

      if (subscriptionError) {
        console.error('Error updating subscription:', subscriptionError)
      }
      break

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = receivedEvent.data.object
      
      const status = subscription.status === 'active' ? 'active' : 
                    subscription.status === 'canceled' ? 'cancelled' : 
                    subscription.status === 'past_due' ? 'expired' : 'active'

      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: status,
          end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)

      if (updateError) {
        console.error('Error updating subscription status:', updateError)
      }
      break

    case 'invoice.payment_succeeded':
      const invoice = receivedEvent.data.object
      
      // Update subscription end date
      if (invoice.subscription) {
        const { error: invoiceError } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            end_date: new Date(invoice.lines.data[0].period.end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', invoice.subscription)

        if (invoiceError) {
          console.error('Error updating subscription after payment:', invoiceError)
        }
      }
      break

    case 'invoice.payment_failed':
      const failedInvoice = receivedEvent.data.object
      
      if (failedInvoice.subscription) {
        const { error: failedError } = await supabase
          .from('subscriptions')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', failedInvoice.subscription)

        if (failedError) {
          console.error('Error updating subscription after failed payment:', failedError)
        }
      }
      break

    default:
      console.log(`Unhandled event type: ${receivedEvent.type}`)
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})