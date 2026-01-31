// ./app/welcome/hooks/useTouchGestures.ts

import { useEffect } from "react";

/**
 * Custom hook that detects three-finger touch gestures and triggers a callback.
 * 
 * @param onTripleTouch - Callback function to execute on three-finger touch
 * @param dependencies - Dependency array for the effect
 */
export function useTouchGestures(onTripleTouch: () => void, dependencies: unknown[]): void {
    useEffect(() => {
        const handleTouch = (e: TouchEvent) => {
            if (e.touches.length === 3) {
                e.preventDefault();
                onTripleTouch();
            }
        };

        document.addEventListener("touchstart", handleTouch, { passive: false });
        return () => {
            document.removeEventListener("touchstart", handleTouch);
        };
    }, dependencies);
}