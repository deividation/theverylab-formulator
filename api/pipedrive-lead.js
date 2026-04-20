// Vercel serverless function — creates Pipedrive Person + Deal + Note from a form submit.
// Token lives ONLY in PIPEDRIVE_API_TOKEN env variable (never exposed to frontend).

module.exports = async (req, res) => {
  // CORS + JSON
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const TOKEN = process.env.PIPEDRIVE_API_TOKEN;
  if (!TOKEN) { res.status(500).json({ error: 'PIPEDRIVE_API_TOKEN not configured' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

  const { name, email, phone, category, products, quantity, pricePerUnit, totalValue, brief } = body || {};
  if (!name || !email) { res.status(400).json({ error: 'name and email required' }); return; }

  const BASE = 'https://api.pipedrive.com/v1';
  const q = '?api_token=' + encodeURIComponent(TOKEN);

  const call = async (path, payload) => {
    const r = await fetch(BASE + path + q, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const d = await r.json();
    if (!d.success) throw new Error(path + ' failed: ' + JSON.stringify(d).slice(0, 300));
    return d.data;
  };

  try {
    // 1. Person
    const personPayload = { name, email: [{ value: email, primary: true, label: 'work' }] };
    if (phone) personPayload.phone = [{ value: phone, primary: true, label: 'work' }];
    const person = await call('/persons', personPayload);

    // 2. Deal
    const deal = await call('/deals', {
      title: 'Formulator Lead — ' + name,
      person_id: person.id,
      value: totalValue || 0,
      currency: 'EUR'
    });

    // 3. Note with formulation details
    const safe = (s) => String(s || '-').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const lines = [
      '<b>New formulator submission</b>',
      '',
      '<b>Category:</b> ' + safe(category),
      '<b>Products:</b> ' + safe(products),
      '<b>Quantity:</b> ' + (quantity ? Number(quantity).toLocaleString() + ' units' : '-'),
      '<b>Price / unit:</b> ' + (pricePerUnit ? '€' + Number(pricePerUnit).toFixed(2) : '-'),
      '<b>Estimated total:</b> ' + (totalValue ? '€' + Number(totalValue).toLocaleString() : '-')
    ];
    if (brief) lines.push('', '<b>Brief / notes:</b>', safe(brief));
    if (phone) lines.push('', '<b>Phone:</b> ' + safe(phone));
    lines.push('', '<b>Email:</b> ' + safe(email));

    await call('/notes', { content: lines.join('<br>'), deal_id: deal.id });

    res.status(200).json({ success: true, person_id: person.id, deal_id: deal.id });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
