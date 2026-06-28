export default async function handler(req, res) {
  // 1. التأكد من أن الطلب القادم هو من نوع POST فقط لحماية الرابط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. استقبال معرف عملية الدفع القادم من الواجهة الأمامية
  const { paymentId } = req.body;
  
  if (!paymentId) {
    return res.status(400).json({ error: 'Missing paymentId in request body' });
  }

  // 3. جلب مفتاح المطورين السري من متغيرات البيئة الآمنة في Vercel
  const PI_API_KEY = process.env.PI_API_KEY;

  if (!PI_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: PI_API_KEY is not defined' });
  }

  try {
    // 4. إرسال طلب الموافقة الرسمي إلى خوادم شبكة Pi Network
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // إذا رفضت شبكة Pi الموافقة، قم بإرجاع السبب للواجهة الأمامية للمساعدة في اكتشاف المشكلة
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    // 5. إذا تمت الموافقة بنجاح، نرد على التطبيق بالقبول
    return res.status(200).json({ success: true });
  } catch (error) {
    // معالجة أي أخطاء غير متوقعة في الاتصال بالشبكة
    return res.status(500).json({ error: error.message });
  }
}
