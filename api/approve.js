export default async function handler(req, res) {
  // إعدادات الـ CORS للسماح بالاتصال من تطبيق pinet.com
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
    console.log("جاري إرسال طلب الموافقة لشبكة Pi برابطها البديل المباشر:", paymentId);

    // استخدام الرابط المباشر للموافقة مع تجنب الأخطاء الداخلية لـ node-fetch
    const piUrl = `https://minepi.com{paymentId}/approve`;
    
    const response = await fetch(piUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0' // إضافة تمنع حظر الاتصال من خوادم Pi
      },
      body: JSON.stringify({ action: 'approve' })
    });

    // مراجعة نص الاستجابة الخام لتفادي انهيار fetch في حال كان الرد ليس JSON
    const responseText = await response.text();
    console.log("الرد الخام من خادم Pi:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { rawResponse: responseText };
    }

    if (response.ok) {
      return res.status(200).json(data);
    } else {
      return res.status(response.status).json({ error: 'Pi API rejected approval', details: data });
    }

  } catch (error) {
    console.error("تفاصيل الخطأ الداخلي بالسيرفر:", error.message);
    return res.status(500).json({ error: 'Internal Server Fetch Failed', message: error.message });
  }
}
