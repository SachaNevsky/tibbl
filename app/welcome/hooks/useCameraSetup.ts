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
 * Draws the video feed to the canvas every frame and overlays TopCode detection circles.
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

            // Check if video is ready
            if (video.readyState < 2) {
                animationFrameId = requestAnimationFrame(drawVideoAndOverlay);
                return;
            }

            // Get the canvas's ACTUAL rendering dimensions (accounting for CSS scaling)
            const canvasWidth = canvas.width;   // Internal resolution (640)
            const canvasHeight = canvas.height; // Internal resolution (480)

            // Clear canvas
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // Draw the video frame to the canvas WITHOUT horizontal flip
            // The TopCodes library flips it when scanning, but we don't want to flip the display
            ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);

            // Now draw the TopCode overlays on top
            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
            ctx.lineWidth = 2;

            for (let i = 0; i < currentTopcodes.length; i++) {
                const topcode = currentTopcodes[i];

                // TopCodes returns coordinates in the flipped space
                // We need to flip them back to match our non-flipped video display
                const flippedX = canvasWidth - topcode.x;

                ctx.beginPath();
                ctx.arc(flippedX, topcode.y, topcode.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                ctx.font = "20px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(topcode.code.toString(), flippedX, topcode.y);
                ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
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
                // Keep video HIDDEN
                video.style.display = 'none';

                // Ensure canvas internal dimensions match what TopCodes expects
                // This is critical - the canvas internal resolution must be 640x480
                if (canvas.width !== 640 || canvas.height !== 480) {
                    canvas.width = 640;
                    canvas.height = 480;
                }

                // Make sure canvas is in the container
                if (!container.contains(canvas)) {
                    container.appendChild(canvas);
                }

                // Style the canvas to be visible and responsive
                // The CSS will scale the canvas visually, but internal resolution stays 640x480
                canvas.style.display = 'block';
                canvas.style.position = 'relative';
                canvas.style.width = '100%';
                canvas.style.height = 'auto';
                canvas.style.maxHeight = '50vh';
                canvas.style.objectFit = 'contain';

                // Start the render loop when video is ready
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

        // Wait for video element to be created by TopCodes
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