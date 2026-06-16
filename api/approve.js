export default async function handler(req, res) {
  // 1. التأكد من أن الطلب من نوع POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }

  // 2. استخراج رقم الدفعة من الطلب المرسل من واجهة الموقع
  const { paymentId } = req.body;
  const API_KEY = process.env.PI_API_KEY;

  // 3. التحقق من وجود مفتاح الـ API
  if (!API_KEY) {
    console.error("API Key is missing in Vercel Environment Variables");
    return res.status(500).json({ error: "API Key is missing on the server" });
  }

  if (!paymentId) {
    return res.status(400).json({ error: "paymentId is missing in the request body" });
  }

  try {
    // 4. إرسال طلب الموافقة لخوادم Pi Network (هنا تم إصلاح الرابط)
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // 5. التحقق مما إذا كانت خوادم Pi قد رفضت الطلب أو أرجعت خطأ
    if (!response.ok) {
      console.error("Pi API Error:", data);
      return res.status(response.status).json({ 
        error: "فشل الموافقة من خوادم Pi", 
        details: data 
      });
    }

    // 6. إذا نجحت الموافقة، نرسل رد النجاح لموقعك
    console.log("تمت الموافقة بنجاح على المعاملة:", paymentId);
    res.status(200).json(data);

  } catch (error) {
    // التقاط أي أخطاء في السيرفر (مثل مشكلة في الاتصال بالإنترنت)
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
}
