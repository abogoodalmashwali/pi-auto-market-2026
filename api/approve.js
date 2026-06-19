// api/approve.js - نسخة للتشخيص
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: "Method not allowed" });

  const { paymentId } = req.body;
  const API_KEY = process.env.PI_API_KEY;

  console.log("محاولة الموافقة على الدفع لـ:", paymentId); // ستظهر هذه في Vercel Logs

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log("رد خادم Pi:", data); // ستظهر هذه في Vercel Logs

    if (response.ok) {
      return res.status(200).json(data);
    } else {
      return res.status(response.status).json({ error: "فشل Pi", details: data });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
