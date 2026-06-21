// كود api/approve.js المقترح
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { paymentId } = req.body;
  if (!paymentId) return res.status(400).json({ error: 'Missing paymentId' });

  try {
    console.log("جاري محاولة الموافقة على العملية:", paymentId); // للتحقق في Logs

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    // تسجيل الرد في سجلات Vercel لتشخيص المشكلة
    console.log("رد خادم Pi:", data);

    if (response.ok) {
      return res.status(200).json(data);
    } else {
      return res.status(response.status).json({ error: 'Failed to approve', details: data });
    }
  } catch (error) {
    console.error("خطأ في الاتصال بخادم Pi:", error);
    return res.status(500).json({ error: error.message });
  }
}
