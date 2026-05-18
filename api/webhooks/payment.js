/* eslint-disable no-undef, supported */
/* eslint-env node */
/* eslint-disable no-unused-vars */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req, res) {
  const isMock = process.env.ENABLE_MOCK_PAYMENT === 'true';

  // For MOCK Testing via Browser Redirect
  if (req.method === 'GET' && isMock && req.query.mock_success === 'true') {
    // In a real flow, webhook comes as POST from payment provider
    // This GET is just to simulate a successful payment redirect for testing
    
    // Simulate finding user from a mock setup (this is highly insecure, only for dev)
    // Normally, webhook doesn't redirect, it just returns 200 to provider.
    return res.redirect(302, '/account?status=success_mock');
  }

  // Real Webhook POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Verify Webhook Signature (Xendit/Midtrans)
    // const signature = req.headers['x-callback-token'];

    // 2. Parse Event
    const event = req.body;

    // 3. Process Payment
    // const paymentStatus = event.status;
    // const userId = event.external_id.split('_')[1];

    /* Example Supabase Update logic:
    if (paymentStatus === 'PAID') {
      await supabase.from('subscriptions').update({ status: 'active' }).eq('id', event.subscription_id);
      await supabase.from('payments').update({ status: 'paid' }).eq('id', event.id);
    }
    */

    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
