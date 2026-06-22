export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { paymentId } = req.body;
  if (!paymentId) {
    return res.status(400).json({ error: 'Missing paymentId' });
  }

  try {
    console.log("جاري محاولة الموافقة على العملية:", paymentId);

    // تعديل الرابط وإضافة معرف الدفع مع استخدام الـ Backticks الصحيحة
    const response = await fetch(`https://minepi.com{paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) // إرسال جسم فارغ مطلوب لطلبات الـ POST في Pi API
    });

    const data = await response.json();
    console.log("رد خادم Pi:", data);

    if (response.ok) {
      return res.status(200).json(data);
    } else {
      return res.status(response.status).json({ error: 'Failed to approve payment', details: data });
    }
  } catch (error) {
    console.error("خطأ في الاتصال بخادم Pi:", error);
    return res.status(500).json({ error: error.message });
  }
}
