// ./app/welcome/handlers/readHandler.ts

import type { TangibleInstance, TopCode } from "../types";
import { cleanScannedCode } from "../utils/codeCleanup";
import { convertCodesToText } from "../utils/convertCodesToText";
import { applyReadingOrderRotation } from "../utils/rotationLogic";

let isReading = false;

/**
 * Creates a handler function for the read button.
 * 
 * @param tangibleInstance - The Tangible instance for speech synthesis
 * @param cameraEnabled - Whether camera scanning is enabled
 * @param codeText - The current code text
 * @param placeholder - Placeholder code to read
 * @param textareaRef - Reference to the textarea element
 * @param setCodeText - State setter for code text
 * @param setIsReading - State setter for reading status
 * @param readingOrderRotation - The rotation angle for reading order
 * @returns Handler function for read button clicks
 */
export function createReadHandler(
    tangibleInstance: TangibleInstance | null,
    cameraEnabled: boolean,
    codeText: string,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    setCodeText: (text: string) => void,
    setIsReading: (reading: boolean) => void,
    placeholder: string,
    readingOrderRotation: 0 | 90 | 180 | 270
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
            const currentCodes = tangibleInstance.currentCodes as TopCode[];

            if (currentCodes && currentCodes.length > 0) {
                const reorderedCodes = applyReadingOrderRotation(
                    [...currentCodes],
                    readingOrderRotation
                );

                const scannedCode = convertCodesToText(
                    reorderedCodes,
                    tangibleInstance.codeLibrary,
                    tangibleInstance.commands
                );

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
            }
            isReading = false;
        }

        const textCode = textareaRef.current?.value || codeText;

        if (textCode && textCode.trim()) {
            tangibleInstance.readCode(textCode);
            setIsReading(true);
        } else if (!textCode && !cameraEnabled) {
            setCodeText(placeholder);
            tangibleInstance.readCode(placeholder);
            setIsReading(true);
        } else {
            tangibleInstance.readCode("No code to read.");
            isReading = false;
        }
    };
}