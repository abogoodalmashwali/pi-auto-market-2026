// api/approve.js
const axios = require('axios'); // تأكد من إضافة axios في ملف package.json

module.exports = async (req, res) => {
    // السماح بطلبات POST فقط
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { paymentId } = req.body;

    // تأكيد وجود الـ paymentId في الطلب
    if (!paymentId) {
        return res.status(400).json({ error: 'Missing paymentId' });
    }

    try {
        // مفتاح الـ API الخاص بتطبيقك من منصة مطوري Pi
        // ينصح بشدة وضعه كمتغير بيئي (Environment Variable) في إعدادات Vercel باسم PI_API_KEY
        const apiKey = process.env.PI_API_KEY || "ضع_مفتاح_الـ_API_الخاص_بك_هنا_إذا_لم_تستخدم_المتغيرات";

        // الاتصال بسيرفر Pi لتوثيق والموافقة على العملية
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/approve`,
            {},
            {
                headers: {
                    'Authorization': `Key ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // إرجاع رد النجاح للمحفظة لكي تفتح فوراً للمستخدم
        return res.status(200).json({ success: true, data: response.data });

    } catch (error) {
        console.error("خطأ سيرفر Pi:", error.response ? error.response.data : error.message);
        return res.status(500).json({ 
            error: "خطأ في الاتصال بشبكة Pi المعتمدة", 
            details: error.response ? error.response.data : error.message 
        });
    }
};
