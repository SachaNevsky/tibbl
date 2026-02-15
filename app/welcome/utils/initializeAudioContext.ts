// ./app/welcome/utils/initializeAudioContext.ts

/**
 * Initializes audio context for iOS devices and activates iosunmute.
 * Must be called from within a user interaction event handler (e.g. a click).
 *
 * @returns A dispose function to clean up iosunmute on unmount, or null if
 *          the environment doesn't support it.
 */
export const initializeAudioContext = (): (() => void) | null => {
    let disposeUnmute: (() => void) | null = null;

    if (typeof window !== 'undefined' && window.Howler) {
        try {
            const silentSound = new window.Howl({
                src: ['data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA='],
                volume: 0,
                onload: () => {
                    silentSound.play();

                    if (window.unmute && window.Howler.ctx) {
                        const controller = window.unmute(window.Howler.ctx);
                        disposeUnmute = controller.dispose.bind(controller);
                    }

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

    return () => {
        disposeUnmute?.();
    };
};