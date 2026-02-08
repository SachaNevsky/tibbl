// ./app/welcome/handlers/playStopHandler.ts

import type { TangibleInstance, TopCode } from "../types";
import { cleanScannedCode } from "../utils/codeCleanup";
import { validateCode } from "../utils/validateCode";
import { cancelCountdown } from "../hooks/useTouchGestures";
import { applyReadingOrderRotation } from "../utils/rotationLogic";
import { convertCodesToText } from "../utils/convertCodesToText";

let isExecuting = false;
let audioCheckInterval: NodeJS.Timeout | null = null;

/**
 * Creates a handler function for the play/stop button.
 * Handles code execution from camera or text input, with validation.
 * Prevents queuing by cancelling any ongoing execution before starting a new one.
 * 
 * @param tangibleInstance - The Tangible instance for code execution
 * @param cameraEnabled - Whether camera scanning is enabled
 * @param codeText - The current code text
 * @param placeholder - Placeholder code to play
 * @param textareaRef - Reference to the textarea element
 * @param setCodeText - State setter for code text
 * @param setIsPlaying - State setter for playing status
 * @param readingOrderRotation - The rotation angle for reading order
 * @returns Handler function for play/stop button clicks
 */
export function createPlayStopHandler(
    tangibleInstance: TangibleInstance | null,
    cameraEnabled: boolean,
    codeText: string,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    setCodeText: (text: string) => void,
    setIsPlaying: (playing: boolean) => void,
    placeholder: string,
    readingOrderRotation: 0 | 90 | 180 | 270
): () => void {
    return () => {
        if (!tangibleInstance) {
            console.error("Tangible instance not initialized");
            return;
        }

        if (audioCheckInterval) {
            clearInterval(audioCheckInterval);
            audioCheckInterval = null;
        }

        if (tangibleInstance.isAudioPlaying() || isExecuting) {
            tangibleInstance.stopAllSounds();
            cancelCountdown(tangibleInstance);
            setIsPlaying(false);
            isExecuting = false;
            return;
        }

        isExecuting = true;

        if (cameraEnabled) {
            // Get current codes from the tangible instance
            const currentCodes = tangibleInstance.currentCodes as TopCode[];

            if (currentCodes && currentCodes.length > 0) {
                // Apply reading order rotation
                const reorderedCodes = applyReadingOrderRotation(
                    [...currentCodes],
                    readingOrderRotation
                );

                // Convert to text using the code library and commands
                const scannedCode = convertCodesToText(
                    reorderedCodes,
                    tangibleInstance.codeLibrary,
                    tangibleInstance.commands
                );

                if (scannedCode) {
                    const cleanedCode = cleanScannedCode(scannedCode);

                    setCodeText(cleanedCode);

                    const validation = validateCode(cleanedCode);
                    if (!validation.valid && validation.error) {
                        tangibleInstance.readCode(validation.error);
                        isExecuting = false;
                        return;
                    }

                    if (cleanedCode && cleanedCode.trim()) {
                        tangibleInstance.codeThreads = [[], [], []];
                        tangibleInstance.runTextCode(cleanedCode);
                        setIsPlaying(true);

                        audioCheckInterval = setInterval(() => {
                            if (!tangibleInstance.isAudioPlaying()) {
                                setIsPlaying(false);
                                isExecuting = false;
                                if (audioCheckInterval) {
                                    clearInterval(audioCheckInterval);
                                    audioCheckInterval = null;
                                }
                            }
                        }, 100);
                    } else {
                        isExecuting = false;
                    }
                    return;
                }
            }
            isExecuting = false;
        }

        const textCode = textareaRef.current?.value || codeText;

        if (textCode && textCode.trim()) {
            const validation = validateCode(textCode);
            if (!validation.valid && validation.error) {
                tangibleInstance.readCode(validation.error);
                isExecuting = false;
                return;
            }
        }

        if (textCode && textCode.trim()) {
            tangibleInstance.codeThreads = [[], [], []];
            tangibleInstance.runTextCode(textCode);
            setIsPlaying(true);

            audioCheckInterval = setInterval(() => {
                if (!tangibleInstance.isAudioPlaying()) {
                    setIsPlaying(false);
                    isExecuting = false;
                    if (audioCheckInterval) {
                        clearInterval(audioCheckInterval);
                        audioCheckInterval = null;
                    }
                }
            }, 100);
        } else if (!textCode && !cameraEnabled) {
            setCodeText(placeholder);
            tangibleInstance.runTextCode(placeholder);
            setIsPlaying(true);

            audioCheckInterval = setInterval(() => {
                if (!tangibleInstance.isAudioPlaying()) {
                    setIsPlaying(false);
                    isExecuting = false;
                    if (audioCheckInterval) {
                        clearInterval(audioCheckInterval);
                        audioCheckInterval = null;
                    }
                }
            }, 100);
        } else {
            tangibleInstance.readCode("No code to run.");
            isExecuting = false;
        }
    };
}