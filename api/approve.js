// api/approve.js
const axios = require('axios');

module.exports = async (req, res) => {
    // إعدادات الـ CORS للسماح بالطلبات من أي مكان وتجنب الحظر
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 🔴 معالجة ذكية لضمان قراءة الـ body سواء وصل كـ Object أو كـ String
    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (e) {
            console.error("فشل في تحليل النص كـ JSON:", e);
        }
    }

    const paymentId = body ? body.paymentId : null;

    // طباعة للمراقبة في الـ Logs لتتأكد بنفسك أن الرقم ليس فارغاً
    console.log("المعرف المستلم في السيرفر هو الفعلي:", paymentId);

    if (!paymentId) {
        return res.status(400).json({ error: 'المعرف الممرر فارغ تماماً paymentId is missing' });
    }

    try {
        // تأكد من وضع الـ Sandbox API Key الخاص بك هنا
        const apiKey = process.env.PI_API_KEY || "ضع_مفتاح_الـ_API_الخاص_بك_هنا";

        // الاتصال المباشر بخوادم Pi للموافقة
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

        // إرجاع النتيجة بنجاح للمحفظة لتفتح فوراً
        return res.status(200).json({ success: true, message: "تمت الموافقة من السيرفر بنجاح" });

    } catch (error) {
        const errorData = error.response ? error.response.data : error.message;
        console.error("خطأ قادم من سيرفر Pi الرسمي:", errorData);
        return res.status(500).json({ 
            error: "فشل التوثيق مع سيرفر Pi", 
            details: errorData 
        });
    }
};
