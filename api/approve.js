export default async function handler(req, res) {
  // ترويسات للسماح بالاتصال من متصفحك
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { paymentId } = req.body;
    
    // تأكد من إضافة PI_API_KEY في إعدادات Vercel كـ Environment Variable
    const API_KEY = process.env.PI_API_KEY;

    if (!paymentId) {
      return res.status(400).json({ error: "Missing paymentId" });
    }

    try {
      // الرابط الكامل والصحيح للموافقة على الدفع
      const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      // إرسال الرد للواجهة لإتمام العملية
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
