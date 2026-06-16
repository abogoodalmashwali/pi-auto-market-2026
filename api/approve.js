export default async function handler(req, res) {
  // ترويسات للسماح بالوصول
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // السماح بطلبات POST فقط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed, use POST" });
  }

  try {
    const { paymentId } = req.body;
    const API_KEY = process.env.PI_API_KEY;

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
