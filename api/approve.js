import axios from 'axios';

export default async function handler(req, res) {
  // إعدادات الـ CORS للسماح بالاتصال من متصفح Pi
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { paymentId } = req.body;

  // تأكد من إضافة الـ API Key الخاص بك في إعدادات البيئة (Environment Variables) على Vercel باسم PI_API_KEY
  const piApiKey = process.env.PI_API_KEY; 

  if (!paymentId) {
    return res.status(400).json({ error: 'Missing paymentId' });
  }

  try {
    console.log("جاري إرسال أمر الموافقة الرسمي لخوادم Pi للمعرف:", paymentId);

    // 1. الاتصال الرسمي بخوادم Pi لإبلاغهم بالموافقة على الدفع (Approve)
    const piResponse = await axios.post(
      `https://minepi.com{paymentId}/approve`,
      {}, // جسم الطلب فارغ حسب وثائق Pi
      {
        headers: {
          'Authorization': `Key ${piApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("تمت الموافقة الرسمية من خوادم Pi بنجاح.");

    // 2. إرجاع البيانات الرسمية والقادمة مباشرة من خوادم Pi (والتي تحتوي على التوقيع المشفر لفتح المحفظة)
    return res.status(200).json(piResponse.data);

  } catch (error) {
    console.error("خطأ أثناء الاتصال بخوادم Pi:", error.response?.data || error.message);
    
    // إرجاع تفاصيل الخطأ القادم من خادم Pi لمعرفة المشكلة بدقة
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;
    
    return res.status(statusCode).json({ error: errorMessage });
  }
}
