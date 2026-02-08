// ./app/welcome/hooks/useTouchGestures.ts

import { useEffect } from "react";
import type { HowlInstance, TangibleInstance } from "../types";

let ongoingCountdown = false;
let countdownTimeouts: NodeJS.Timeout[] = [];
let countdownHowl: HowlInstance | null = null;

/**
 * Cancels any ongoing countdown and clears all timeout timers.
 * 
 * @param tangibleInstance - Optional Tangible instance to cancel synthesis
 */
export function cancelCountdown(tangibleInstance?: TangibleInstance | null): void {
    if (ongoingCountdown) {
        countdownTimeouts.forEach(timeout => clearTimeout(timeout));
        countdownTimeouts = [];
        if (countdownHowl) {
            countdownHowl.stop();
            countdownHowl = null;
        }
        if (tangibleInstance) {
            tangibleInstance.synthesis.cancel();
        }
        ongoingCountdown = false;
    }
}

/**
 * Custom hook that detects three-finger touch gestures and triggers a callback.
 * When camera is enabled, initiates a 3-second countdown before executing the callback.
 * Prevents queuing by cancelling any ongoing countdown before starting a new one.
 * 
 * @param onTripleTouch - Callback function to execute on three-finger touch
 * @param cameraEnabled - Whether the camera is currently enabled
 * @param tangibleInstance - The Tangible instance for text-to-speech countdown
 * @param githubBase - The base GitHub URL for loading sound files
 * @param dependencies - Dependency array for the effect
 */
export function useTouchGestures(
    onTripleTouch: () => void,
    cameraEnabled: boolean,
    tangibleInstance: TangibleInstance | null,
    githubBase: string,
    dependencies: unknown[]
): void {
    useEffect(() => {
        const handleTouch = (e: TouchEvent) => {
            if (e.touches.length === 3) {
                e.preventDefault();

                cancelCountdown(tangibleInstance);

                if (cameraEnabled && tangibleInstance) {
                    ongoingCountdown = true;

                    const countdown = async () => {
                        if (!countdownHowl) {
                            countdownHowl = new window.Howl({
                                src: [`${githubBase}/assets/sound/Numbers.mp3`],
                                volume: 1.0,
                                sprite: tangibleInstance.soundSets['Numbers']
                            });
                        }

                        countdownHowl.play('3');
                        const timeout1 = setTimeout(() => {
                            if (!ongoingCountdown) return;

                            countdownHowl?.play('2');
                            const timeout2 = setTimeout(() => {
                                if (!ongoingCountdown) return;

                                countdownHowl?.play('1');
                                const timeout3 = setTimeout(() => {
                                    if (!ongoingCountdown) return;

                                    ongoingCountdown = false;
                                    countdownTimeouts = [];
                                    if (countdownHowl) {
                                        countdownHowl = null;
                                    }

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
            if (countdownHowl) {
                countdownHowl.stop();
                countdownHowl = null;
            }
            ongoingCountdown = false;
        };
    }, dependencies);
}