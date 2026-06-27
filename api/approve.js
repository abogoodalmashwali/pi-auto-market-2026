// api/approve.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { paymentId } = req.body;
    console.log("تم استلام طلب موافقة لـ:", paymentId);
    
    // هنا يجب أن تتصل بـ Pi API للموافقة
    // مؤقتاً، أرسل رد نجاح ليتمكن التطبيق من المتابعة
    res.status(200).json({ status: "approved" });
  } else {
    res.status(405).send('Method not allowed');
  }
}
