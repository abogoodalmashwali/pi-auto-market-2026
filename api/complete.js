export default async function handler(req, res) {
  // 1. التأكد من أن الطلب القادم هو من نوع POST لحماية الرابط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. استقبال معرف المعاملة ومعرف البلوكشين القادمين من الواجهة الأمامية
  const { paymentId, txid } = req.body;
  
  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'Missing paymentId or txid in request body' });
  }

  // 3. جلب مفتاح المطورين السري من متغيرات البيئة الآمنة في Vercel
  const PI_API_KEY = process.env.PI_API_KEY;

  if (!PI_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: PI_API_KEY is not defined' });
  }

  try {
    // 4. إرسال طلب الإتمام والتأكيد النهائي إلى خوادم شبكة Pi Network
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid: txid })
    });

    // إذا رفضت شبكة Pi إتمام المعاملة، نرجع السبب
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    // 5. إذا تم إغلاق وتأكيد المعاملة بنجاح، نرد على التطبيق بالنجاح الكامل
    return res.status(200).json({ success: true });
  } catch (error) {
    // معالجة أي أخطاء غير متوقعة في الاتصال بالشبكة
    return res.status(500).json({ error: error.message });
  }
}
