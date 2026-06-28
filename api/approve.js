// دالة بدء عملية الدفع والتحقق عبر السيرفر الخاص بك
async function startPayment() {
    try {
        console.log("جاري بدء عملية الدفع التجريبية...");

        // 1. إنشاء الدفعة باستخدام مكتبة Pi Network الرسمية
        await Pi.createPayment({
            amount: 1, // المبلغ التجريبي بالـ Pi
            memo: "شراء سيارة تجريبية - Pi Auto Market 2026",
            metadata: { orderId: "order_12345" },
        }, {
            // توثيق الدفعة في السيرفر الخاص بك والموافقة عليها
            onReadyForServerApproval: async (paymentId) => {
                console.log("تم إنشاء الدفعة بنجاح، معرف الدفعة:", paymentId);
                
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
            
            // إكمال عملية الدفع وإغلاقها بعد تأكيد المستخدم
            onReadyForServerCompletion: async (paymentId, txid) => {
                console.log("قام المستخدم بتأكيد الدفع. معرف المعاملة (TXID):", txid);
                
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
            
            onCancel: (paymentId) => {
                console.log("تم إلغاء عملية الدفع بواسطة المستخدم:", paymentId);
                alert("تم إلغاء عملية الدفع.");
            },
            
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

// كود ربط الأزرار وإغلاق النافذة التابع لك
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('closeBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.location.reload(); 
        });
    }
});
