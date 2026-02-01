// ./app/welcome/hooks/useTouchGestures.ts

import { useEffect } from "react";
import type { TangibleInstance } from "../types";

let ongoingCountdown = false;
let countdownTimeouts: NodeJS.Timeout[] = [];

/**
 * Custom hook that detects three-finger touch gestures and triggers a callback.
 * When camera is enabled, initiates a 3-second countdown before executing the callback.
 * Prevents queuing by cancelling any ongoing countdown before starting a new one.
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
        const handleTouch = (e: TouchEvent) => {
            if (e.touches.length === 3) {
                e.preventDefault();

                if (ongoingCountdown) {
                    countdownTimeouts.forEach(timeout => clearTimeout(timeout));
                    countdownTimeouts = [];
                    if (tangibleInstance) {
                        tangibleInstance.synthesis.cancel();
                    }
                    ongoingCountdown = false;
                }

                if (cameraEnabled && tangibleInstance) {
                    ongoingCountdown = true;

                    const countdown = async () => {
                        tangibleInstance.readCode("3");
                        const timeout1 = setTimeout(async () => {
                            if (!ongoingCountdown) return;

                            tangibleInstance.readCode("2");
                            const timeout2 = setTimeout(async () => {
                                if (!ongoingCountdown) return;

                                tangibleInstance.readCode("1");
                                const timeout3 = setTimeout(() => {
                                    if (!ongoingCountdown) return;

                                    ongoingCountdown = false;
                                    countdownTimeouts = [];
                                    onTripleTouch();
                                }, 1000);

                                countdownTimeouts.push(timeout3);
                            }, 1000);

                            countdownTimeouts.push(timeout2);
                        }, 1000);

                        countdownTimeouts.push(timeout1);
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
            countdownTimeouts.forEach(timeout => clearTimeout(timeout));
            countdownTimeouts = [];
            ongoingCountdown = false;
        };
    }, dependencies);
}