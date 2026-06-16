export default async function handler(req, res) {
  // ترويسات ضرورية لمنع حظر المتصفح للطلب (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { paymentId } = req.body;
    const API_KEY = process.env.PI_API_KEY;

    try {
      // إرسال طلب الموافقة لشبكة Pi
      const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      // إرسال النتيجة للمتصفح ليتمكن من إكمال الدفع
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
