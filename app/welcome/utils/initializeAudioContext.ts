// ./app/welcome/utils/initializeAudioContext.ts

/**
 * Initializes audio context for iOS devices and activates iosunmute.
 *
 * @returns A dispose function to clean up iosunmute on unmount.
 */
export const initializeAudioContext = (): (() => void) => {
    let disposeUnmute: (() => void) | null = null;

    if (typeof window === 'undefined') {
        return () => { };
    }

    if (window.Howler) {
        try {
            const ctx = window.Howler.ctx;

            if (ctx && ctx.state === 'suspended') {
                ctx.resume().catch((error: unknown) => {
                    console.error("Failed to resume AudioContext:", error);
                });
            }

            if (window.unmute && ctx) {
                const controller = window.unmute(ctx);
                disposeUnmute = controller.dispose.bind(controller);

                const syntheticEvent = new Event('touchend', { bubbles: true, cancelable: true });
                window.dispatchEvent(syntheticEvent);
            }
        } catch (error) {
            console.error("Failed to initialize audio context:", error);
        }
    }

    if (window.speechSynthesis) {
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