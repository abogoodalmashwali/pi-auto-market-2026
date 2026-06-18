export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { paymentId } = req.body;
  const API_KEY = process.env.PI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API Key مفقود في إعدادات الخادم" });
  }

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    // إضافة فحص لحالة الرد من Pi Network
    if (response.ok) {
      return res.status(200).json(data);
    } else {
      console.error("خطأ من خادم Pi:", data);
      return res.status(response.status).json({ error: "فشل في الموافقة من خادم Pi", details: data });
    }
    
  } catch (error) {
    console.error("خطأ في الاتصال:", error);
    return res.status(500).json({ error: "خطأ داخلي في الخادم: " + error.message });
  }
}
