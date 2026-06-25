module.exports = async (req, res) => {
    // التأكد من أن الطلب هو POST
    if (req.method === 'POST') {
        try {
            const { paymentId } = req.body;
            const PI_API_KEY = process.env.PI_API_KEY;

            if (!paymentId) {
                return res.status(400).json({ status: "error", message: "paymentId مفقود" });
            }

            console.log("جاري محاولة الموافقة على الدفع لـ:", paymentId);

            // الاتصال بـ API الخاص بشبكة Pi
            const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Key ${PI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({}) // يجب إرسال جسم طلب فارغ إذا لم تكن هناك متطلبات إضافية
            });

            // قراءة الرد من خادم Pi
            const data = await response.json();

            if (response.ok) {
                console.log("تمت الموافقة بنجاح عبر Pi API");
                res.status(200).json({ status: "success", data });
            } else {
                console.error("فشل في Pi API:", data);
                res.status(response.status).json({ status: "error", message: "فشل من جانب خادم Pi", details: data });
            }
        } catch (error) {
            console.error("خطأ تقني:", error);
            res.status(500).json({ status: "error", message: error.message });
        }
    } else {
        res.status(405).send("Method Not Allowed");
    }
};
