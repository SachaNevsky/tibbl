// ./app/welcome/utils/initializeAudioContext.ts

/**
 * Initialize audio context for iOS devices.
 */
export const initializeAudioContext = () => {
    if (typeof window !== 'undefined' && window.Howler) {
        try {
            const howler = window.Howler as unknown as { ctx?: AudioContext };
            if (howler.ctx?.state === 'suspended') {
                howler.ctx.resume();
            }

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

export const ensureAudioContextRunning = (): void => {
    if (typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
        const silentAudio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=');
        silentAudio.play().catch(() => {
            console.error("Ignore this")
        });

        if (window.Howler) {
            const howler = window.Howler as unknown as { ctx?: AudioContext };
            if (howler.ctx?.state === 'suspended') {
                howler.ctx.resume();
            }
        }
    }
};