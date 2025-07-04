let faqData = {}; // JSON से डेटा आने के बाद इसमें स्टोर होगा
let chatHistory = []; // लोकल चैट हिस्ट्री

// LocalStorage से चैट लोड करें
window.onload = () => {
  loadChatHistory();
};

// FAQ JSON लोड करें
fetch('faq.json')
  .then(res => res.json())
  .then(data => { faqData = data; })
  .catch(err => console.error("FAQ JSON लोड नहीं हो सका:", err));

// चैट बॉक्स में मैसेज जोड़ने का फंक्शन
function addMessage(text, type = 'received') {
  const chatBox = document.getElementById('chat-box');
  const msg = document.createElement('div');
  msg.classList.add('msg', type);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  // लोकल हिस्ट्री में सेव करें
  chatHistory.push({ text, type });
  saveChatHistory();
}

// उत्तर खोजने का फंक्शन
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

  // Keyword match
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

  return "माफ़ कीजिए, मुझे उस सवाल का उत्तर नहीं पता। कृपया HR से संपर्क करें।";
}

// भाषा पहचानें
function detectLanguage(text) {
  if (/[ऀ-ॿ]/.test(text)) {
    return 'hi';
  } else if (/\b(kitna|kya|kab|kaam|hoga)\b/.test(text)) {
    return 'hinglish';
  } else {
    return 'en';
  }
}

// Send बटन और Enter पर भेजना
function handleSend() {
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'sent');

  setTimeout(() => {
    const answer = findAnswer(text);
    addMessage(answer, 'received');
  }, 500);

  input.value = '';
}

document.getElementById('send-btn').addEventListener('click', handleSend);
document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSend();
});

// 🔁 LocalStorage: सेव और लोड करने के फ़ंक्शन
function saveChatHistory() {
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function loadChatHistory() {
  const saved = localStorage.getItem('chatHistory');
  if (saved) {
    chatHistory = JSON.parse(saved);
    chatHistory.forEach(msg => addMessage(msg.text, msg.type));
  }
}
