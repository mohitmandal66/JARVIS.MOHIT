document.addEventListener('DOMContentLoaded', () => {
    console.log("Jarvis Neural Interface Loaded.");
    
    // Initialize Voice on first load
    if (window.VoiceHandler) {
        window.VoiceHandler.init();
    }

    // Auto-load voices for the speech engine
    window.speechSynthesis.getVoices();
});