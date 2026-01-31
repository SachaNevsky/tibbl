// ./app/welcome/hooks/useReadingState.ts

import { useEffect } from "react";
import type { TangibleInstance } from "../types";

/**
 * Custom hook that monitors speech synthesis state and updates reading status.
 * Automatically stops reading state when speech synthesis completes.
 * 
 * @param tangibleInstance - The Tangible instance with speech synthesis
 * @param isReading - Current reading status
 * @param setIsReading - State setter for reading status
 */
export function useReadingState(
    tangibleInstance: TangibleInstance | null,
    isReading: boolean,
    setIsReading: (reading: boolean) => void
): void {
    useEffect(() => {
        if (!tangibleInstance) return;

        const checkSpeaking = setInterval(() => {
            if (isReading && !tangibleInstance.synthesis.speaking) {
                setIsReading(false);
            }
        }, 100);

        return () => clearInterval(checkSpeaking);
    }, [tangibleInstance, isReading, setIsReading]);
}