export default async function handler(req, res) {
  // 1. السماح بطلبات POST فقط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: 'Missing paymentId' });
  }

  try {
    // 2. الاتصال بـ Pi API
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // 3. إرجاع النتيجة التي تأتي من Pi مباشرة
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error("Error approving payment:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
