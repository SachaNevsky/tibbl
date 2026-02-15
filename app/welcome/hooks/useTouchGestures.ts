// ./app/welcome/hooks/useTouchGestures.ts

import { useEffect } from "react";
import type { TangibleInstance } from "../types";

/** Elements that should suppress global keyboard shortcuts when focused. */
const FOCUSABLE_INPUT_TAGS = new Set(["INPUT", "SELECT", "TEXTAREA"]);

function isFocusedOnInteractiveInput(): boolean {
    const active = document.activeElement;
    if (!active) return false;
    return (
        FOCUSABLE_INPUT_TAGS.has(active.tagName) ||
        (active as HTMLElement).isContentEditable
    );
}

let ongoingCountdown = false;
let countdownTimeouts: NodeJS.Timeout[] = [];
let doubleTapTimeout: NodeJS.Timeout | null = null;
let lastTapTime = 0;
const DOUBLE_TAP_DELAY = 250;

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
 * Custom hook that detects touch gestures and keyboard shortcuts, then triggers the appropriate callbacks.
 *
 * @param onTripleTouch - Callback function to execute on three-finger touch / Enter key
 * @param onDoubleTap - Callback function to execute on double tap / Space key
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
        const handleTouch = (e: TouchEvent) => {
            if (e.touches.length === 3) {
                e.preventDefault();

                cancelCountdown(tangibleInstance);
                cancelDoubleTap();
                lastTapTime = 0;

                if (cameraEnabled && tangibleInstance) {
                    ongoingCountdown = true;
                    setGestureAnnouncement("Three finger touch detected");

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
                                            setGestureAnnouncement("Playing code");
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
                    setGestureAnnouncement("Three finger touch detected");
                    onTripleTouch();
                }
            }
            else if (e.touches.length === 1) {
                const currentTime = Date.now();
                const timeSinceLastTap = currentTime - lastTapTime;

                if (timeSinceLastTap < DOUBLE_TAP_DELAY && timeSinceLastTap > 0) {
                    e.preventDefault();
                    cancelDoubleTap();
                    lastTapTime = 0;
                    setGestureAnnouncement("Double tap detected");
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

        document.addEventListener("touchstart", handleTouch, { passive: false });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isFocusedOnInteractiveInput()) return;

            if (e.key === " ") {
                e.preventDefault();
                setGestureAnnouncement("Space key detected");
                onDoubleTap();
            } else if (e.key === "Enter") {
                e.preventDefault();
                setGestureAnnouncement("Enter key detected");
                onTripleTouch();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("touchstart", handleTouch);
            document.removeEventListener("keydown", handleKeyDown);
            cancelDoubleTap();
            countdownTimeouts.forEach(timeout => clearTimeout(timeout));
            countdownTimeouts = [];
            ongoingCountdown = false;
        };
    }, dependencies);
}