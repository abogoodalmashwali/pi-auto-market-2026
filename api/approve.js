// كود طلب الدفع - يوضع في ملف الواجهة الأمامية الخاص بك
const payment = {
  amount: 1, // المبلغ المراد دفعه
  memo: "شراء سيارة من Pi Auto Market 2026", // ملاحظة الدفع
  metadata: { 
    // أي معلومات إضافية تود ربطها بالعملية
  },
  uid: "unique-transaction-id-123" // يجب أن يكون معرفاً فريداً لكل عملية
};

const callbacks = {
  onReadyForServerApproval: (paymentId) => {
    console.log("تم إنشاء الطلب، الـ ID هو:", paymentId);
    // هنا يتم إرسال الـ paymentId إلى الخادم الخاص بك (api/approve.js)
    fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    });
  },
  onReadyForServerCompletion: (paymentId, txid) => {
    console.log("تمت الموافقة، جاري الإتمام:", paymentId, txid);
    // هنا ترسل تأكيد الإتمام للخادم
  },
  onCancel: (paymentId) => {
    console.log("تم إلغاء الدفع من قبل المستخدم:", paymentId);
  },
  onError: (error, payment) => {
    console.log("حدث خطأ:", error);
  }
};

// الأمر الذي يفتح المحفظة فعلياً
Pi.createPayment(payment, callbacks);
