module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { paymentId } = req.body;
        
        // سجل العملية في السجلات (Logs) للتأكد
        console.log("محاولة الموافقة على الدفع:", paymentId);

        // هنا يجب أن يتم الرد بـ JSON يحتوي على success: true لكي تكتمل العملية
        res.status(200).json({ 
            status: "success", 
            message: "تمت الموافقة بنجاح",
            paymentId: paymentId
        });
    } else {
        res.status(405).send("Method Not Allowed");
    }
};
