export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    const { paymentId } = req.body;
    console.log("استلام طلب موافقة لـ:", paymentId); // سيظهر في Logs Vercel

    try {
        const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${process.env.PI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dequeue: true })
        });

        const data = await response.json();
        console.log("رد شبكة Pi:", data); // سيظهر في Logs Vercel
        
        return res.status(200).json(data);
    } catch (error) {
        console.error("خطأ كارثي:", error);
        return res.status(500).json({ error: error.message });
    }
}
