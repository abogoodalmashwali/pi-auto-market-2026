// api/complete.js
export default async function handler(req, res) {
    // إعدادات الـ CORS للسماح بالاتصال من تطبيقك
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { paymentId, txid } = req.body;
    const PI_API_KEY = process.env.PI_API_KEY;

    if (!paymentId || !txid) {
        return res.status(400).json({ error: 'Missing paymentId or txid' });
    }

    try {
        console.log("جاري إكمال الدفع لـ:", paymentId);

        // الرابط الرسمي لإكمال المعاملة في بيئة الاختبار
        const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${PI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ txid: txid })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("تمت العملية بنجاح:", data);
            return res.status(200).json(data);
        } else {
            console.error("خطأ من خادم Pi:", data);
            return res.status(response.status).json(data);
        }

    } catch (error) {
        console.error("خطأ تقني في السيرفر:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
