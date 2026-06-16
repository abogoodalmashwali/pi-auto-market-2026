export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { paymentId } = req.body;
  const API_KEY = process.env.PI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API Key is missing in server config" });
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

    // إضافة هذا الجزء للتأكد من نجاح الموافقة من خوادم Pi
    if (!response.ok) {
      console.error("Pi API Error:", data); // سيظهر هذا في الـ Logs في Vercel
      return res.status(response.status).json({ error: "فشلت الموافقة من Pi", details: data });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
}
