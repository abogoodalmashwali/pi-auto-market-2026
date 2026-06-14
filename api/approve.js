export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  // التأكد من أننا نستقبل البيانات بشكل صحيح
  const { paymentId } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  
  if (!paymentId) {
    return res.status(400).json({ error: "Payment ID is missing" });
  }

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
