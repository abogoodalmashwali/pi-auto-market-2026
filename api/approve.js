onReadyForServerApproval: function(paymentId) {
    console.log("محاولة إرسال طلب لـ /api/approve معرف:", paymentId); // تتبع في المتصفح
    updateStatus("جاري التواصل مع الخادم...");
    fetch("/api/approve", { // جرب المسار النسبي بدلاً من الكامل
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: paymentId })
    })
    .then(res => res.json())
    .then(data => console.log("رد الخادم:", data))
    .catch(err => console.error("خطأ الاتصال:", err));
}
