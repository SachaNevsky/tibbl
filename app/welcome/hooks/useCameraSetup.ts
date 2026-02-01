// ./app/welcome/hooks/useCameraSetup.ts

import { useEffect } from "react";

interface TopCode {
    code: number;
    x: number;
    y: number;
    radius: number;
    angle: number;
}

/**
 * Custom hook that sets up and manages the camera video canvas.
 * IMPORTANT: This draws the video feed to the canvas every frame (like the original TopCodes implementation).
 * The video element stays hidden, only the canvas is visible.
 * 
 * @param cameraEnabled - Whether the camera is currently enabled
 */
export function useCameraSetup(cameraEnabled: boolean): void {
    useEffect(() => {
        if (!cameraEnabled) return;

        let animationFrameId: number | null = null;
        let currentTopcodes: TopCode[] = [];

        const drawVideoAndOverlay = () => {
            const video = document.getElementById('video-canvas-video') as HTMLVideoElement;
            const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;

            if (!video || !canvas) {
                animationFrameId = requestAnimationFrame(drawVideoAndOverlay);
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                animationFrameId = requestAnimationFrame(drawVideoAndOverlay);
                return;
            }

            if (video.readyState < 2) {
                animationFrameId = requestAnimationFrame(drawVideoAndOverlay);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.restore();

            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
            ctx.lineWidth = 2;

            for (let i = 0; i < currentTopcodes.length; i++) {
                const topcode = currentTopcodes[i];

                ctx.beginPath();
                ctx.arc(topcode.x, topcode.y, topcode.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                // ctx.font = "20px Arial";
                // ctx.textAlign = "center";
                // ctx.textBaseline = "middle";
                // ctx.fillText(topcode.code.toString(), topcode.x, topcode.y);
                // ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            }

            animationFrameId = requestAnimationFrame(drawVideoAndOverlay);
        };

        const handleTopcodesDetected = (event: Event) => {
            const customEvent = event as CustomEvent<{ topcodes: TopCode[] }>;
            currentTopcodes = customEvent.detail.topcodes;
        };

        const setupCanvas = () => {
            const video = document.getElementById('video-canvas-video') as HTMLVideoElement;
            const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;
            const container = document.querySelector('.video-container');

            if (video && canvas && container) {
                video.style.display = 'none';

                if (!container.contains(canvas)) {
                    container.appendChild(canvas);
                }

                canvas.style.display = 'block';
                canvas.style.position = 'relative';
                canvas.style.width = '100%';
                canvas.style.height = 'auto';
                canvas.style.maxHeight = '50vh';
                canvas.style.objectFit = 'contain';

                const onVideoReady = () => {
                    if (!animationFrameId) {
                        drawVideoAndOverlay();
                    }
                };

                video.addEventListener('loadedmetadata', onVideoReady);
                video.addEventListener('playing', onVideoReady);

                if (video.readyState >= 2) {
                    onVideoReady();
                }

                return () => {
                    video.removeEventListener('loadedmetadata', onVideoReady);
                    video.removeEventListener('playing', onVideoReady);
                };
            }
        };

        const interval = setInterval(() => {
            const video = document.getElementById('video-canvas-video');
            if (video) {
                setupCanvas();
                clearInterval(interval);
            }
        }, 100);

        const timeout = setTimeout(() => clearInterval(interval), 5000);

        window.addEventListener('topcodes-detected', handleTopcodesDetected);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
            window.removeEventListener('topcodes-detected', handleTopcodesDetected);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [cameraEnabled]);
}