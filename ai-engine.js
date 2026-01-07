window.JarvisEngine = {
    async processCommand(text) {
        if (!text || text.trim() === "") return;
        
        // Visual indicator that Jarvis is thinking
        document.getElementById('transcript').innerText = "Processing: " + text;

        try {
            // Using 1.5 Flash for maximum stability in 2026
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${window.JarvisConfig.geminiKey}`;

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `You are Jarvis, a helpful AI assistant. Be brief and professional. User says: ${text}` }]
                    }]
                })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                console.error("API Error:", data.error);
                return this.speak("Sir, the API connection has been severed. Please check your credentials.");
            }

            const aiMessage = data.candidates[0].content.parts[0].text;
            document.getElementById('transcript').innerText = "Jarvis: " + aiMessage;
            this.speak(aiMessage);

        } catch (error) {
            console.error("Network Error:", error);
            this.speak("I am unable to reach the neural network, sir.");
        }
    },

    speak(message) {
        window.speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.pitch = 0.9; 
        utterance.rate = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            utterance.voice = voices.find(v => v.name.includes("Microsoft") && v.lang.includes("en-GB")) || 
                              voices.find(v => v.name.includes("Google UK English")) || 
                              voices[0];
        }

        utterance.onend = () => {
            if (window.VoiceHandler) window.VoiceHandler.start();
        };

        window.speechSynthesis.speak(utterance);
    }
};