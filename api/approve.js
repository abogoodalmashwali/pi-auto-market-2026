const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { paymentId } = req.body;

            if (!paymentId) {
                return res.status(400).json({ success: false, error: 'Missing paymentId' });
            }

            console.log(`جاري إرسال طلب الموافقة لـ Payment ID: ${paymentId}`);

            const response = await axios.post(
                `https://api.minepi.com/v2/payments/${paymentId}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Key ${process.env.PI_API_KEY}`
                    }
                }
            );

            console.log("تمت الموافقة من سيرفرات Pi بنجاح!");
            return res.status(200).json({ success: true, data: response.data });

        } catch (error) {
            // صيانة طريقة قراءة الخطأ لمنع الانهيار وتوضيح السبب الحقيقي
            console.error("حدث خطأ أثناء الاتصال بسيرفر Pi:");
            const errorMsg = error.response?.data?.message || error.response?.data || error.message;
            console.error(`تفاصيل الخطأ: ${errorMsg}`);
            
            return res.status(500).json({ success: false, error: errorMsg });
        }
    }

    res.status(405).json({ error: 'Method Not Allowed' });
};
