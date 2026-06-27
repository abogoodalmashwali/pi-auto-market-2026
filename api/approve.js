// api/approve.js
const axios = require('axios');

module.exports = async (req, res) => {
    // 1. إعدادات الـ CORS لتفادي مشاكل الحظر بين الواجهة والسيرفر
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // التعامل مع طلبات الـ OPTIONS المبدئية من المتصفح
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // منع أي طريقة طلب أخرى غير POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. قراءة وتحليل الـ body لضمان استخراج البيانات بأمان في بيئة Vercel
    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (e) {
            console.error("فشل في تحويل النص المستلم إلى JSON:", e);
        }
    }

    // استخراج معرف الدفع الفعلي
    const paymentId = body ? body.paymentId : null;

    // طباعة المعرف في الـ Logs للتأكد من وصوله
    console.log("المعرف المستلم في خادم Vercel هو:", paymentId);

    if (!paymentId) {
        return res.status(400).json({ error: 'معرف الدفع مفقود أو فارغ (paymentId is missing)' });
    }

    try {
        // 3. جلب مفتاح الـ API سرياً من إعدادات Vercel (Environment Variables)
        const apiKey = process.env.PI_API_KEY;

        if (!apiKey) {
            console.error("تنبيه أمني: لم يتم العثور على متغير PI_API_KEY في إعدادات Vercel!");
            return res.status(500).json({ error: "خطأ في إعدادات الخادم الأمنية" });
        }

        // 4. إرسال طلب الموافقة الرسمي إلى سيرفرات Pi Network بالخلفية
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

        // 5. إرجاع رد النجاح إلى تطبيق المستخدم لفتح المحفظة فوراً
        return res.status(200).json({ 
            success: true, 
            message: "تمت الموافقة من السيرفر بنجاح", 
            data: response.data 
        });

    } catch (error) {
        // إدارة الأخطاء وطباعة تفاصيل رد سيرفر Pi في الـ Logs
        const errorData = error.response ? error.response.data : error.message;
        console.error("خطأ مستلم من سيرفر Pi الرسمي:", errorData);
        
        return res.status(500).json({ 
            error: "فشلت عملية التوثيق والموافقة مع شبكة Pi", 
            details: errorData 
        });
    }
};
