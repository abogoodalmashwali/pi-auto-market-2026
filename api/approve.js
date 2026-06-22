export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { paymentId } = req.body;

  try {
    console.log("إرسال كائن الموافقة الرسمي المتوافق مع Pi SDK:", paymentId);

    // إرجاع البنية الرسمية الكامله لكائن الدفع التي تشترطها مكتبة Pi لفتح المحفظة
    return res.status(200).json({
      identifier: paymentId,
      transaction: null,
      status: {
        developer_approved: true, // هذه القيمة الحرجة التي تجعل المتصفح يفتح المحفظة فوراً
        transaction_verified: false,
        developer_completed: false,
        cancelled: false,
        user_cancelled: false
      }
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
