export default async function handler(req, res) {
  // تفعيل السماح بعبور البيانات (CORS) لتفادي حظر المتصفح
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { paymentId } = req.body;
  if (!paymentId) {
    return res.status(400).json({ error: 'Missing paymentId' });
  }

  try {
    console.log("جاري التوثيق للمعاملة المعلقة:", paymentId);

    // الطلب الصحيح للموافقة على الدفع في خوادم Pi البيئية
    const response = await fetch(`https://minepi.com{paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'approve' }) 
    });

    const data = await response.json();
    console.log("استجابة الشبكة الرسمية:", data);

    if (response.ok) {
      return res.status(200).json(data);
    } else {
      return res.status(response.status).json({ error: 'Validation failed', details: data });
    }
  } catch (error) {
    console.error("خطأ سيرفر داخلي:", error);
    return res.status(500).json({ error: error.message });
  }
}
