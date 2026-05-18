/* eslint-disable no-undef, supported */
/* eslint-env node */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { plan_id } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Very basic validation for mock/dev purposes
  // In a real app, you would use supabase-js to verify the JWT from authHeader
  const isMock = process.env.ENABLE_MOCK_PAYMENT === 'true';

  if (!plan_id) {
    return res.status(400).json({ error: 'plan_id is required' });
  }

  try {
    if (isMock) {
      // Simulate creating a checkout session
      const mockCheckoutUrl = `/api/webhooks/payment?mock_success=true&plan_id=${plan_id}`;
      return res.status(200).json({ checkout_url: mockCheckoutUrl });
    } else {
      // Real Xendit/Midtrans logic goes here
      // const invoice = await xendit.Invoice.createInvoice({ ... })
      return res.status(501).json({ error: 'Real payment gateway is not configured yet.' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
