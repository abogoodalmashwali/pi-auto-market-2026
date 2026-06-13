export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    // التأكد من قراءة البيانات بغض النظر عن طريقة الإرسال
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { paymentId } = body;

    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID missing in request body" });
    }

    console.log("جارٍ الموافقة على الدفع:", paymentId);

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    console.log("رد شبكة Pi:", data);
    return res.status(200).json(data);
  } catch (error) {
    console.error("خطأ في المعالجة:", error);
    return res.status(500).json({ error: error.message });
  }
}
