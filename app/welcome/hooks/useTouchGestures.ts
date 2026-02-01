// ./app/welcome/hooks/useTouchGestures.ts

import { useEffect } from "react";
import type { TangibleInstance } from "../types";

/**
 * Custom hook that detects three-finger touch gestures and triggers a callback.
 * When camera is enabled, initiates a 3-second countdown before executing the callback.
 * 
 * @param onTripleTouch - Callback function to execute on three-finger touch
 * @param cameraEnabled - Whether the camera is currently enabled
 * @param tangibleInstance - The Tangible instance for text-to-speech countdown
 * @param dependencies - Dependency array for the effect
 */
export function useTouchGestures(
    onTripleTouch: () => void,
    cameraEnabled: boolean,
    tangibleInstance: TangibleInstance | null,
    dependencies: unknown[]
): void {
    useEffect(() => {
        let countdownTimeout: NodeJS.Timeout | null = null;

        const handleTouch = (e: TouchEvent) => {
            if (e.touches.length === 3) {
                e.preventDefault();

                if (cameraEnabled && tangibleInstance) {
                    const countdown = async () => {
                        tangibleInstance.readCode("3");
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        tangibleInstance.readCode("2");
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        tangibleInstance.readCode("1");
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        onTripleTouch();
                    };

                    countdown();
                } else {
                    onTripleTouch();
                }
            }
        };

        document.addEventListener("touchstart", handleTouch, { passive: false });

        return () => {
            document.removeEventListener("touchstart", handleTouch);
            if (countdownTimeout) {
                clearTimeout(countdownTimeout);
            }
        };
    }, dependencies);
}