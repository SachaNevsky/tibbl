// ./app/welcome/handlers/playStopHandler.ts

import type { TangibleInstance } from "../types";
import { cleanScannedCode } from "../utils/codeCleanup";
import { validateCode } from "../utils/validateCode";

/**
 * Creates a handler function for the play/stop button.
 * Handles code execution from camera or text input, with validation.
 * 
 * @param tangibleInstance - The Tangible instance for code execution
 * @param cameraEnabled - Whether camera scanning is enabled
 * @param codeText - The current code text
 * @param textareaRef - Reference to the textarea element
 * @param setCodeText - State setter for code text
 * @param setIsPlaying - State setter for playing status
 * @returns Handler function for play/stop button clicks
 */
export function createPlayStopHandler(
    tangibleInstance: TangibleInstance | null,
    cameraEnabled: boolean,
    codeText: string,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    setCodeText: (text: string) => void,
    setIsPlaying: (playing: boolean) => void
): () => void {
    return () => {
        if (!tangibleInstance) {
            console.error("Tangible instance not initialized");
            return;
        }

        if (tangibleInstance.isAudioPlaying()) {
            tangibleInstance.stopAllSounds();
            setIsPlaying(false);
            return;
        }

        if (cameraEnabled) {
            const scannedCode = tangibleInstance.scanCode();

            if (scannedCode) {
                const cleanedCode = cleanScannedCode(scannedCode);

                setCodeText(cleanedCode);

                const validation = validateCode(cleanedCode);
                if (!validation.valid && validation.error) {
                    tangibleInstance.readCode(validation.error);
                    return;
                }

                if (cleanedCode && cleanedCode.trim()) {
                    tangibleInstance.codeThreads = [[], [], []];
                    tangibleInstance.runTextCode(cleanedCode);
                    setIsPlaying(true);

                    const checkAudio = setInterval(() => {
                        if (!tangibleInstance.isAudioPlaying()) {
                            setIsPlaying(false);
                            clearInterval(checkAudio);
                        }
                    }, 100);
                }
                return;
            }
        }

        const textCode = textareaRef.current?.value || codeText;

        if (textCode && textCode.trim()) {
            const validation = validateCode(textCode);
            if (!validation.valid && validation.error) {
                tangibleInstance.readCode(validation.error);
                return;
            }
        }

        if (textCode && textCode.trim()) {
            tangibleInstance.codeThreads = [[], [], []];
            tangibleInstance.runTextCode(textCode);
            setIsPlaying(true);

            const checkAudio = setInterval(() => {
                if (!tangibleInstance.isAudioPlaying()) {
                    setIsPlaying(false);
                    clearInterval(checkAudio);
                }
            }, 100);
        } else {
            tangibleInstance.readCode("No code to run.");
        }
    };
}