const axios = require('axios');

module.exports = async (req, res) => {
    // إعدادات CORS للسماح بتلقي الطلبات من أي مكان
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { paymentId } = req.body;

            if (!paymentId) {
                return res.status(400).json({ success: false, error: 'Missing paymentId' });
            }

            // إرسال طلب الموافقة الرسمي إلى سيرفرات Pi Network
            const response = await axios.post(
                `https://api.minepi.com/v2/payments/${paymentId}/approve`,
                {},
                {
                    headers: {
                        // السيرفر سيقرأ المفتاح السري تلقائياً من المتغيرات التي حفظناها في Vercel
                        Authorization: `Key ${process.env.PI_API_KEY}`
                    }
                }
            );

            return res.status(200).json({ success: true, data: response.data });
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            return res.status(500).json({ success: false, error: errorMsg });
        }
    }

    res.status(405).json({ error: 'Method Not Allowed' });
};
