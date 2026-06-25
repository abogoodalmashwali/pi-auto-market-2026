module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { paymentId } = req.body;
        const PI_API_KEY = process.env.PI_API_KEY; // سنستخدم المفتاح الذي وضعته في Vercel

        console.log("محاولة الموافقة على الدفع لـ:", paymentId);

        try {
            // هذا هو الجزء الناقص: الاتصال بخادم Pi
            const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Key ${PI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'approve' })
            });

            const data = await response.json();

            if (response.ok) {
                res.status(200).json({ status: "success", data });
            } else {
                res.status(response.status).json({ status: "error", message: "فشل الاتصال بـ Pi", details: data });
            }
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    } else {
        res.status(405).send("Method Not Allowed");
    }
};
