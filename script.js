
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Sorry, your browser doesn't support Speech Recognition.");
}

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = "en-IN"; // default

const recordBtn = document.getElementById("startBtn");
const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");
const translatedText = document.getElementById("translatedText");
const textInput = document.getElementById("textInput");
const typeBtn = document.getElementById("typeTranslateBtn");

// 🌐 Language to voice mapping
const langMap = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  ml: "ml-IN"
};

// 🎤 Speak Mode
recordBtn.addEventListener("click", () => {
  const selectedLang = sourceLang.value;
  recognition.lang = langMap[selectedLang] || "en-IN";
  recognition.start();
});

// 🧠 When speech is recognized
recognition.onresult = async function (event) {
  const speechResult = event.results[0][0].transcript;
  console.log("You said:", speechResult);
  translateText(speechResult);
};

// ✍️ Type Mode
typeBtn.addEventListener("click", () => {
  const typedText = textInput.value.trim();
  if (typedText !== "") {
    translateText(typedText);
  } else {
    alert("Please enter some text.");
  }
});

// 🌐 Translate function using Google Translate API
async function translateText(text) {
  const source = sourceLang.value;
  const target = targetLang.value;

  translatedText.innerText = "⏳ Translating...";

  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();

    const translated = data[0][0][0];
    translatedText.innerText = translated;

    // 🗣️ Speak the result
    const utterance = new SpeechSynthesisUtterance(translated);
    utterance.lang = langMap[target] || "en-IN";
    window.speechSynthesis.speak(utterance);
    
  } catch (error) {
    translatedText.innerText = "❌ Could not reach translation server.";
    console.error("Error:", error);
  }
}
