window.JarvisConfig = {
    // Your actual API Key
    geminiKey: "AIzaSyD0qweoHmsLTwp9IwmT6GO-WwGIWgqbNHo",
    
    // THE MISSING LINK: The correct Google API Address
    geminiUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    
    voicePitch: 0.85,
    voiceRate: 1.0  // Added this to ensure voice isn't too slow
};// Add this at the very top of your script block in index.html
if (!window.JarvisConfig || !window.JarvisConfig.geminiKey) {
    console.error("CRITICAL: API Key not found in config.js");
}