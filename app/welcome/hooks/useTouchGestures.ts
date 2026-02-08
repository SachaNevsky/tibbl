// ./app/welcome/hooks/useTouchGestures.ts

import { useEffect } from "react";
import type { TangibleInstance } from "../types";

let ongoingCountdown = false;
let countdownTimeouts: NodeJS.Timeout[] = [];

/**
 * Cancels any ongoing countdown and clears all timeout timers.
 * 
 * @param tangibleInstance - Optional Tangible instance to cancel synthesis
 */
export function cancelCountdown(tangibleInstance?: TangibleInstance | null): void {
    if (ongoingCountdown) {
        countdownTimeouts.forEach(timeout => clearTimeout(timeout));
        countdownTimeouts = [];
        if (tangibleInstance && tangibleInstance.threads[0]) {
            tangibleInstance.threads[0].stop();
        }
        ongoingCountdown = false;
    }
}

/**
 * Custom hook that detects three-finger touch gestures and triggers a callback.
 * 
 * @param onTripleTouch - Callback function to execute on three-finger touch
 * @param cameraEnabled - Whether the camera is currently enabled
 * @param tangibleInstance - The Tangible instance for text-to-speech countdown
 * @param githubBase - The base GitHub URL for loading sound files
 * @param currentSoundSets - Array of current sound sets for each thread
 * @param preloadSoundSet - Function to reload sound sets
 * @param dependencies - Dependency array for the effect
 */
export function useTouchGestures(
    onTripleTouch: () => void,
    cameraEnabled: boolean,
    tangibleInstance: TangibleInstance | null,
    githubBase: string,
    currentSoundSets: string[],
    preloadSoundSet: (instance: TangibleInstance, soundSet: string, threadIndex: number, githubBase: string) => void,
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
                        const originalSoundSet = currentSoundSets[0];

                        if (tangibleInstance.soundSets['Numbers']) {
                            const numbersHowl = new window.Howl({
                                src: [`${githubBase}/assets/sound/Numbers.mp3`],
                                volume: 1.0,
                                sprite: tangibleInstance.soundSets['Numbers']
                            });
                            tangibleInstance.threads[0] = numbersHowl;

                            numbersHowl.play('c');

                            const timeout1 = setTimeout(() => {
                                if (!ongoingCountdown) return;

                                numbersHowl.play('b');

                                const timeout2 = setTimeout(() => {
                                    if (!ongoingCountdown) return;

                                    numbersHowl.play('a');

                                    const timeout3 = setTimeout(() => {
                                        if (!ongoingCountdown) return;

                                        numbersHowl.stop();
                                        preloadSoundSet(tangibleInstance, originalSoundSet, 0, githubBase);

                                        setTimeout(() => {
                                            ongoingCountdown = false;
                                            countdownTimeouts = [];
                                            onTripleTouch();
                                        }, 100);
                                    }, 1000);

                                    countdownTimeouts.push(timeout3);
                                }, 1000);

                                countdownTimeouts.push(timeout2);
                            }, 1000);

                            countdownTimeouts.push(timeout1);
                        }
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