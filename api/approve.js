export default async function handler(req, res) {
  const { paymentId } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // مهلة 10 ثوانٍ

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      signal: controller.signal
    });

    const data = await response.json();
    clearTimeout(timeout);
    return res.status(200).json(data);
  } catch (error) {
    clearTimeout(timeout);
    return res.status(500).json({ error: "Connection Timeout - Check Server Connectivity" });
  }
}
