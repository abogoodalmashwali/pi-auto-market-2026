// دالة بدء عملية الدفع والتحقق عبر السيرفر الخاص بك
async function startPayment() {
    try {
        console.log("جاري بدء عملية الدفع التجريبية...");

        // 1. إنشاء الدفعة باستخدام مكتبة Pi Network الرسمية (الواجهة الأمامية)
        const payment = await Pi.createPayment({
            amount: 1, // المبلغ التجريبي بالـ Pi
            memo: "شراء سيارة تجريبية - Pi Auto Market 2026",
            metadata: { orderId: "order_12345" },
        }, {
            // يتم استدعاء هذه الدالة فوراً عند إنشاء الدفعة على الشبكة لتوثيقها في السيرفر الخاص بك
            onReadyForServerApproval: async (paymentId) => {
                console.log("تم إنشاء الدفعة بنجاح، معرف الدفعة:", paymentId);
                
                // إرسال معرف الدفعة إلى سيرفر الـ Backend الخاص بك للموافقة والتوقيع بالمفتاح السري
                const response = await fetch('https://pi-backend-kappa.vercel.app/api/approve', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ paymentId: paymentId })
                });

                const result = await response.json();
                if (response.ok && result.success) {
                    console.log("تمت الموافقة على الدفعة من السيرفر بنجاح!");
                } else {
                    throw new Error(result.error || "فشلت عملية الموافقة من السيرفر");
                }
            },
            
            // يتم استدعاء هذه الدالة بعد أن يقوم المستخدم بإدخال كلمة سر محفظته وتأكيد النقل بنجاح
            onReadyForServerCompletion: async (paymentId, txid) => {
                console.log("قام المستخدم بتأكيد الدفع. معرف المعاملة (TXID):", txid);
                
                // إرسال البيانات النهائية للسيرفر لإكمال عملية الدفع وإغلاقها على شبكة Pi
                const response = await fetch('https://pi-backend-kappa.vercel.app/api/complete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ paymentId: paymentId, txid: txid })
                });

                const result = await response.json();
                if (response.ok && result.success) {
                    console.log("تم إكمال الدفعة وإغلاقها بنجاح التام!");
                    alert("تهانينا! تم الدفع بنجاح وأصبحت المعاملة موثقة.");
                } else {
                    throw new Error(result.error || "فشل إكمال الدفعة على السيرفر");
                }
            },
            
            // في حال ألغى المستخدم العملية أو أغلق المحفظة
            onCancel: (paymentId) => {
                console.log("تم إلغاء عملية الدفع بواسطة المستخدم. معرف الدفعة:", paymentId);
                alert("تم إلغاء عملية الدفع.");
            },
            
            // في حال حدوث أي خطأ مفاجئ أثناء الدفع
            onError: (error, payment) => {
                console.error("حدث خطأ أثناء معالجة الدفع:", error);
                alert("خطأ في الدفع: " + error.message);
            }
        });

    } catch (error) {
        console.error("خطأ عام في تشغيل الدفع:", error);
        alert("تعذر بدء عملية الدفع، يرجى المحاولة مرة أخرى.");
    }
}
