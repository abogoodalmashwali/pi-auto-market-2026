export default async function handler(req, res) {
    // ترويسات السماح بالاتصال
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');

    const { paymentId } = req.body;
    const PI_API_KEY = process.env.PI_API_KEY;

    if (!paymentId) {
        return res.status(400).json({ error: 'paymentId is missing' });
    }

    try {
        console.log("جاري محاولة الموافقة على paymentId في Sandbox:", paymentId);

        // الرابط المحدث لبيئة الـ Sandbox
        const response = await fetch(`https://api.minepi.com/v2/sandbox/payments/${paymentId}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${PI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "paymentId": paymentId })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("تمت الموافقة بنجاح في Sandbox:", data);
            return res.status(200).json(data);
        } else {
            console.error("خطأ من سيرفر Pi (Sandbox):", data);
            return res.status(response.status).json(data);
        }
    } catch (error) {
        console.error("خطأ تقني في السيرفر:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
