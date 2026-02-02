// ./app/welcome/utils/initializeAudioContext.ts

/**
 * Initialize audio context for iOS devices.
 * iOS requires user interaction before audio can play.
 * This function unlocks audio by playing silence.
 */
export const initializeAudioContext = () => {
    if (typeof window !== 'undefined' && window.Howler) {
        try {
            const silentSound = new window.Howl({
                src: ['data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA='],
                volume: 0,
                onload: () => {
                    silentSound.play();
                    silentSound.unload();
                }
            });
        } catch (error) {
            console.error("Failed to initialize audio context:", error);
        }
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
        try {
            const utterance = new SpeechSynthesisUtterance('');
            utterance.volume = 0;
            window.speechSynthesis.speak(utterance);
            window.speechSynthesis.cancel();
        } catch (error) {
            console.error("Failed to initialize speech synthesis:", error);
        }
    }
};