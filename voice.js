// --- 1. INSTANT DATA LOAD ---
(function() {
    const profile = JSON.parse(localStorage.getItem('jarvis_profile')) || { name: "OPERATOR", place: "UNKNOWN" };
    document.getElementById('welcome-header').innerText = `WELCOME, ${profile.name}`;
    document.getElementById('sub-header').innerText = `SYSTEM LOCATION: ${profile.place} | STATUS: ENCRYPTED`;
})();

// --- 2. CLOCK ---
setInterval(() => {
    const el = document.getElementById('current-time');
    if (el) el.innerText = new Date().toLocaleTimeString();
}, 1000);

// --- 3. SPEECH RECOGNITION SETUP ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('transcript').innerText = transcript;
        processJarvisCommand(transcript);
    };

    recognition.onend = () => {
        document.getElementById('voice-btn').classList.remove('listening');
        document.getElementById('voice-status').innerText = "INITIALIZE";
    };
}

// --- 4. COMMAND PROCESSOR ---
async function processJarvisCommand(text) {
    const input = text.toLowerCase().trim();
    const transcriptDiv = document.getElementById('transcript');

    // Image Generation Logic
    if (input.includes("generate") || input.includes("image") || input.includes("picture")) {
        const description = input.replace(/generate|image|picture|make|a|an/g, "").trim();
        speak(`Accessing visual core. Creating image of ${description}.`);
        generateJarvisImage(description);
        return;
    }

    // App Shortcuts
    const appMap = { "whatsapp": "https://web.whatsapp.com", "youtube": "https://www.youtube.com", "google": "https://www.google.com" };
    for (let key in appMap) {
        if (input.includes(`open ${key}`)) {
            speak(`Opening ${key} interface, sir.`);
            window.open(appMap[key], '_blank');
            return;
        }
    }
    
    // Default response if no shortcut matches
    speak("Command received and processed, sir.");
}

// --- 5. TEXT TO SPEECH ---
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 0.9; // Lower pitch for JARVIS feel
    window.speechSynthesis.speak(utterance);
}

// --- 6. IMAGE GENERATION ---
async function generateJarvisImage(description) {
    const loader = document.getElementById('loader');
    const output = document.getElementById('image-output');
    
    loader.style.display = 'block';
    try {
        const response = await fetch('https://backend.buildpicoapps.com/aero/run/image-generation-api?pk=v1-Z0FBQUFBQnBYa3hvSkhURXhxNlY2UE9IWlgweWlwZEZBZFhrNXFlLWVLREFsLWxpaWg1N2hzRzBveHFzZEZhUEx4Vk1IM3AyZDBfdzdNcS1VUGd2ZXZfalBFTi1xZXpWbFE9PQ==', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ prompt: description })
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            output.innerHTML = `
                <div class="image-card">
                    <img src="${data.imageUrl}" class="w-full h-full object-cover cursor-pointer" onclick="window.open('${data.imageUrl}', '_blank')">
                    <button class="download-btn" onclick="downloadImage('${data.imageUrl}')"><i class="fas fa-download"></i></button>
                </div>`;
        }
    } catch (err) {
        document.getElementById('transcript').innerText = "Visual array error.";
    } finally {
        loader.style.display = 'none';
    }
}

// --- 7. VOICE BUTTON CLICK ---
document.getElementById('voice-btn').onclick = function() {
    if (recognition) {
        window.speechSynthesis.cancel(); 
        this.classList.add('listening');
        document.getElementById('voice-status').innerText = "LISTENING";
        recognition.start();
    } else {
        alert("Speech Recognition is not supported in this browser. Please use Chrome.");
    }
};

function downloadImage(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jarvis-vision.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}