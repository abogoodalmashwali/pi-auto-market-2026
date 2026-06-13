export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { paymentId } = req.body;
  
  try {
    // محاولة اتصال بسيطة جداً
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pi Network رفض الطلب: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error("الخطأ الحقيقي:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
