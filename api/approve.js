const axios = require('axios');

export default async function handler(req, res) {
  // إعدادات CORS للسماح لمتصفح Pi بالاتصال بالسيرفر دون قيود
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { paymentId } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY; 

  if (!paymentId) {
    return res.status(400).json({ error: 'Missing paymentId' });
  }

  try {
    console.log("جاري إرسال أمر الموافقة الرسمي للمعرف:", paymentId);

    // استخدام النطاق الرسمي لشبكة Pi لحل مشكلة التوجيه getaddrinfo
    const piResponse = await axios.post(
      `https://minepi.com{paymentId}/approve`,
      {},
      {
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("تمت الموافقة الرسمية من خوادم Pi بنجاح.");
    // إرجاع البيانات الأصلية مباشرة دون تغليف لتفتح المحفظة فوراً
    return res.status(200).json(piResponse.data);

  } catch (error) {
    console.error("خطأ أثناء الاتصال بخوادم Pi:", error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;
    
    return res.status(statusCode).json({ error: errorMessage });
  }
}
