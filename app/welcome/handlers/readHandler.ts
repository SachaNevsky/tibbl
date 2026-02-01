// ./app/welcome/handlers/readHandler.ts

import type { TangibleInstance } from "../types";
import { cleanScannedCode } from "../utils/codeCleanup";

let isReading = false;

/**
 * Creates a handler function for the read button.
 * Handles text-to-speech reading of code from camera or text input.
 * Prevents queuing by cancelling any ongoing speech before starting a new one.
 * 
 * @param tangibleInstance - The Tangible instance for speech synthesis
 * @param cameraEnabled - Whether camera scanning is enabled
 * @param codeText - The current code text
 * @param textareaRef - Reference to the textarea element
 * @param setCodeText - State setter for code text
 * @param setIsReading - State setter for reading status
 * @returns Handler function for read button clicks
 */
export function createReadHandler(
    tangibleInstance: TangibleInstance | null,
    cameraEnabled: boolean,
    codeText: string,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    setCodeText: (text: string) => void,
    setIsReading: (reading: boolean) => void
): () => void {
    return () => {
        if (!tangibleInstance) {
            console.error("Tangible instance not initialized");
            return;
        }

        if (tangibleInstance.synthesis.speaking || isReading) {
            tangibleInstance.synthesis.cancel();
            setIsReading(false);
            isReading = false;
            return;
        }

        if (tangibleInstance.isAudioPlaying()) {
            tangibleInstance.stopAllSounds();
            return;
        }

        isReading = true;

        if (cameraEnabled) {
            const scannedCode = tangibleInstance.scanCode();

            if (scannedCode) {
                const cleanedCode = cleanScannedCode(scannedCode);

                setCodeText(cleanedCode);

                if (cleanedCode && cleanedCode.trim()) {
                    tangibleInstance.readCode(cleanedCode);
                    setIsReading(true);
                } else {
                    isReading = false;
                }
                return;
            }
            isReading = false;
        }

        const textCode = textareaRef.current?.value || codeText;

        if (textCode && textCode.trim()) {
            tangibleInstance.readCode(textCode);
            setIsReading(true);
        } else {
            tangibleInstance.readCode("No code to read.");
            isReading = false;
        }
    };
}