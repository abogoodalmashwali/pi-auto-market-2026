export default async function handler(req, res) {
    // إضافة ترويسات السماح بالاتصال
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // التعامل مع طلبات الاختبار (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { paymentId } = req.body;
        console.log("تم استلام طلب موافقة لـ", paymentId);
        
        // هنا يجب أن تتصل بـ Pi API في المستقبل
        res.status(200).json({ status: "approved" });
    } else {
        res.status(405).send('Method not allowed');
    }
}
