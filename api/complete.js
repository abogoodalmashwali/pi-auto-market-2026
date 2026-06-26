const axios = require('axios');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { paymentId, txid } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'Missing paymentId or txid' });
  }

  try {
    console.log("توثيق معاملة التيس نت بمعرف الحركة:", txid);

    // الرابط الصحيح لإكمال الدفع في شبكة الفحص (Testnet)
    const piResponse = await axios.post(
      `https://minepi.com{paymentId}/complete`,
      { txid },
      {
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("تم تأكيد وإكمال الدفع التجريبي بنجاح.");
    return res.status(200).json(piResponse.data);

  } catch (error) {
    console.error("خطأ إكمال دفع التيس نت:", error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;
    return res.status(statusCode).json({ error: errorMessage });
  }
}
