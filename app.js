const PI_API_KEY = "yeugvacpplk7npt32k8ipvq1qwmwehx9fh7vetp6oqpfoqdvlki0gikdfljqwnhw";

function verifyPayment(paymentId) {
    fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Key ${PI_API_KEY}` }
    })
    .then(response => response.json())
    .then(data => console.log("نتيجة التحقق:", data))
    .catch(error => console.error("خطأ:", error));
}
