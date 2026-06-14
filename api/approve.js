export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { paymentId } = req.body;
  
  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // أضفنا هذا للتأكيد للخادم أننا نطلب موافقة فورية
        "action": "approve" 
      })
    });

    const data = await response.json();
    console.log("رد خادم Pi:", data); // هذه ستظهر في الـ Logs
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
