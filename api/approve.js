async function runPiTestPayment() {
    updateStatus("جاري الاتصال بالمحفظة...");

    try {
        // المصادقة التلقائية لطلب الدفع
        window.Pi.authenticate(['payments'], onIncompletePaymentFound).then(function(auth) {
            
            // بمجرد المصادقة، ننتقل فوراً لطلب الدفع
            executePaymentProcess();

        }).catch(function(error) {
            updateStatus("فشلت المصادقة: " + error.message);
        });

    } catch (err) {
        alert("خطأ في الاتصال: " + err.message);
    }
}
