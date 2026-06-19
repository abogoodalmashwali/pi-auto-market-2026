// api/approve.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { paymentId } = req.body;
  
  // استخدام الـ API_KEY مباشرة من المتغيرات البيئية
  const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.PI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return res.status(response.status).json(data);
}
