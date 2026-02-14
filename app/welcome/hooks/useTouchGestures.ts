// ./app/welcome/hooks/useTouchGestures.ts

import { useEffect } from "react";
import type { TangibleInstance } from "../types";

let ongoingCountdown = false;
let countdownTimeouts: NodeJS.Timeout[] = [];
let doubleTapTimeout: NodeJS.Timeout | null = null;
let lastTapTime = 0;
const DOUBLE_TAP_DELAY = 250; // milliseconds

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
 * Cancels any ongoing double tap timer.
 */
function cancelDoubleTap(): void {
    if (doubleTapTimeout) {
        clearTimeout(doubleTapTimeout);
        doubleTapTimeout = null;
    }
}

/**
 * Custom hook that detects three-finger touch gestures and double tap gestures and triggers callbacks.
 * 
 * @param onTripleTouch - Callback function to execute on three-finger touch
 * @param onDoubleTap - Callback function to execute on double tap
 * @param cameraEnabled - Whether the camera is currently enabled
 * @param tangibleInstance - The Tangible instance for text-to-speech countdown
 * @param githubBase - The base GitHub URL for loading sound files
 * @param currentSoundSets - Array of current sound sets for each thread
 * @param preloadSoundSet - Function to reload sound sets
 * @param setGestureAnnouncement - Function to set the gesture announcement for screen readers
 * @param dependencies - Dependency array for the effect
 */
export function useTouchGestures(
    onTripleTouch: () => void,
    onDoubleTap: () => void,
    cameraEnabled: boolean,
    tangibleInstance: TangibleInstance | null,
    githubBase: string,
    currentSoundSets: string[],
    preloadSoundSet: (instance: TangibleInstance, soundSet: string, threadIndex: number, githubBase: string) => void,
    setGestureAnnouncement: (announcement: string) => void,
    dependencies: unknown[]
): void {
    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 3) {
                e.preventDefault();
                cancelDoubleTap();
                lastTapTime = 0;
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
                                            setGestureAnnouncement("Playing code gesture");
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
                    setGestureAnnouncement("Playing code gesture");
                    onTripleTouch();
                }
            } else if (e.touches.length === 1) {
                const currentTime = Date.now();
                const timeSinceLastTap = currentTime - lastTapTime;

                if (timeSinceLastTap < DOUBLE_TAP_DELAY && timeSinceLastTap > 0) {
                    e.preventDefault();
                    cancelDoubleTap();
                    lastTapTime = 0;
                    setGestureAnnouncement("Reading code gesture");
                    onDoubleTap();
                } else {
                    lastTapTime = currentTime;

                    cancelDoubleTap();
                    doubleTapTimeout = setTimeout(() => {
                        lastTapTime = 0;
                    }, DOUBLE_TAP_DELAY);
                }
            }
        };

        document.addEventListener("touchstart", handleTouchStart, { passive: false });

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            cancelDoubleTap();
            countdownTimeouts.forEach(timeout => clearTimeout(timeout));
            countdownTimeouts = [];
            ongoingCountdown = false;
        };
    }, dependencies);
}