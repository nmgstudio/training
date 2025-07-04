let faqData = {}; // JSON से डेटा आने के बाद इसमें स्टोर होगा

// FAQ JSON लोड करें
fetch('faq.json')
  .then(res => res.json())
  .then(data => {
    faqData = data;
  })
  .catch(err => {
    console.error("FAQ JSON लोड नहीं हो सका:", err);
  });

// चैट बॉक्स में मैसेज जोड़ने का फंक्शन
function addMessage(text, type = 'received') {
  const chatBox = document.getElementById('chat-box');
  const msg = document.createElement('div');
  msg.classList.add('msg', type);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// उत्तर खोजने का फंक्शन (language ऑटो-डिटेक्ट + कीवर्ड मैच)
function findAnswer(inputText) {
  inputText = inputText.trim().toLowerCase();
  const lang = detectLanguage(inputText);
  const faqs = faqData[lang] || [];

  // Exact match
  for (let i = 0; i < faqs.length; i++) {
    if (faqs[i].q.toLowerCase() === inputText) {
      return faqs[i].a;
    }
  }

  // Keyword match (साधारण .includes logic)
  for (let i = 0; i < faqs.length; i++) {
    const words = faqs[i].q.toLowerCase().split(" ");
    let match = true;
    for (let w of words) {
      if (!inputText.includes(w)) {
        match = false;
        break;
      }
    }
    if (match) return faqs[i].a;
  }

  // कोई जवाब न मिला
  return "माफ़ कीजिए, मुझे उस सवाल का उत्तर नहीं पता। कृपया HR से संपर्क करें।";
}

// भाषा पहचानने का फंक्शन (देवनागरी = हिंदी, रोमन = Hinglish/English)
function detectLanguage(text) {
  if (/[ऀ-ॿ]/.test(text)) {
    return 'hi';         // हिंदी
  } else if (/[^a-zA-Z0-9 ?]/.test(text)) {
    return 'hi';         // अन्य देवनागरी संकेत
  } else if (/\b(kitna|kya|kab|kaam|hoga)\b/.test(text)) {
    return 'hinglish';   // Hindlish keywords
  } else {
    return 'en';         // Default English
  }
}

// SEND बटन क्लिक या एंटर प्रेस पर मैसेज प्रोसेस करें
function handleSend() {
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'sent');

  // 1 सेकंड की देरी से जवाब दिखाएँ
  setTimeout(() => {
    const answer = findAnswer(text);
    addMessage(answer, 'received');
  }, 500);

  input.value = '';
}

// बटन और एंटर दोनों पर भेजने की सुविधा
document.getElementById('send-btn').addEventListener('click', handleSend);
document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSend();
});
