const axios = require('axios');

export default async function handler(req, res) {
  // إعدادات CORS للسماح لمتصفح Pi بالاتصال بالسيرفر دون قيود
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { paymentId, txid } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'Missing paymentId or txid' });
  }

  try {
    console.log("جاري توثيق إكمال الدفع عبر الاتصال المباشر لمعرف الحركة:", txid);

    // استخدام الاتصال المباشر بالخادم لتوثيق المعاملة بنجاح في البلوكتشين التجريبي
    const piResponse = await axios.post(
      `https://18.154.141{paymentId}/complete`,
      { txid },
      {
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    console.log("تم تسجيل وإكمال المعاملة بنجاح وتأكيدها.");
    return res.status(200).json(piResponse.data);

  } catch (error) {
    console.error("خطأ أثناء توثيق إكمال الدفع:", error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;
    
    return res.status(statusCode).json({ error: errorMessage });
  }
}
