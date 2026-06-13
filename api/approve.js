export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const { paymentId } = req.body;
  
  // إضافة تأخير لمدة 2 ثانية لضمان تسجيل الدفع في شبكة Pi أولاً
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // إرسال جسم فارغ كافٍ للموافقة
    });

    const data = await response.json();
    console.log("رد شبكة Pi:", data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
