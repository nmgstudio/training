document.getElementById("registrationForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;

  const data = {
    name: form.name.value,
    fatherName: form.fatherName.value,
    email: form.email.value,
    phone: form.phone.value,
    reportingDate: form.reportingDate.value,
    accommodation: form.accommodation.value,
    accommodationText:
      form.accommodation.value === "Basic"
        ? "If you do not have a place to stay in Varanasi during the training period, then we can arrange a personal PG room at a Minimal Charge of ₹2,750."
        : "You have not opted for any accommodation. A ₹800 training facility and administrative fee will apply."
  };

  document.getElementById("status").textContent = "Submitting...";

  const scriptURL = "https://script.google.com/macros/s/AKfycbzZ73e8wITRGmqredx48_s_QmlPNYmhBwuYVDyC8koNFsuvyz4ngWFexjn3rrCH0fU/exec";
  
  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        document.getElementById("status").innerHTML = `✅ Form submitted! <br><a href=\"${res.pdfUrl}\" target=\"_blank\" style=\"color: #fff; text-decoration: underline;\">Download Letter</a>`;
      } else {
        document.getElementById("status").textContent = "❌ Submission failed. Please try again.";
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("status").textContent = "❌ Error occurred while submitting.";
    });
});
