// ./app/welcome/hooks/useCameraSetup.ts

import { useEffect } from "react";

/**
 * Custom hook that sets up and manages the camera video canvas positioning and sizing.
 * Moves video element into the container and configures canvas overlay.
 * 
 * @param cameraEnabled - Whether the camera is currently enabled
 */
export function useCameraSetup(cameraEnabled: boolean): void {
    useEffect(() => {
        if (!cameraEnabled) return;

        let cleanupFn: (() => void) | undefined;

        const moveVideo = () => {
            const video = document.getElementById('video-canvas-video') as HTMLVideoElement;
            const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;
            const container = document.querySelector('.video-container');

            if (video && canvas && container) {
                if (!container.contains(video)) {
                    container.insertBefore(video, container.firstChild);
                }
                video.style.display = 'block';

                if (!container.contains(canvas)) {
                    container.appendChild(canvas);
                }

                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.pointerEvents = 'none';
                canvas.style.zIndex = '10';
                canvas.style.display = 'block';

                const resizeCanvas = () => {
                    canvas.width = 640;
                    canvas.height = 480;
                };

                const onVideoLoad = () => {
                    resizeCanvas();
                };

                video.addEventListener('loadedmetadata', onVideoLoad);
                video.addEventListener('playing', onVideoLoad);

                resizeCanvas();

                cleanupFn = () => {
                    video.removeEventListener('loadedmetadata', onVideoLoad);
                    video.removeEventListener('playing', onVideoLoad);
                };
            }
        };

        const interval = setInterval(() => {
            const video = document.getElementById('video-canvas-video');
            if (video) {
                moveVideo();
                clearInterval(interval);
            }
        }, 100);

        const timeout = setTimeout(() => clearInterval(interval), 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
            if (cleanupFn) cleanupFn();
        };
    }, [cameraEnabled]);
}