/* eslint-disable no-undef, supported */
/* eslint-env node */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const isMock = process.env.ENABLE_MOCK_PAYMENT === 'true';

  if (isMock || !supabase) {
    // Return mock data for testing
    return res.status(200).json({
      subscriptions: [
        { id: 'sub_123', user_id: 'user_001', plan: 'plan_monthly', status: 'active', current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(), created_at: new Date().toISOString() },
        { id: 'sub_456', user_id: 'user_002', plan: 'plan_yearly', status: 'canceled', current_period_end: new Date(Date.now() - 5 * 86400000).toISOString(), created_at: new Date(Date.now() - 400 * 86400000).toISOString() }
      ],
      payments: [
        { id: 'pay_123', user_id: 'user_001', amount: 25000, provider: 'mock', status: 'paid', created_at: new Date().toISOString() },
        { id: 'pay_456', user_id: 'user_002', amount: 250000, provider: 'mock', status: 'paid', created_at: new Date(Date.now() - 365 * 86400000).toISOString() }
      ]
    });
  }

  try {
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (subError) throw subError;

    const { data: payments, error: payError } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (payError) throw payError;

    return res.status(200).json({ subscriptions, payments });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
