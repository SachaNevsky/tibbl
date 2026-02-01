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
 * Custom hook that sets up and manages the camera video canvas positioning and sizing.
 * Listens for TopCode detection events and draws overlay circles on our canvas.
 * 
 * @param cameraEnabled - Whether the camera is currently enabled
 */
export function useCameraSetup(cameraEnabled: boolean): void {
    useEffect(() => {
        if (!cameraEnabled) return;

        let animationFrameId: number | null = null;
        let currentTopcodes: TopCode[] = [];

        const drawOverlay = () => {
            const video = document.getElementById('video-canvas-video') as HTMLVideoElement;
            const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;

            if (!video || !canvas) {
                animationFrameId = requestAnimationFrame(drawOverlay);
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                animationFrameId = requestAnimationFrame(drawOverlay);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const videoWidth = video.videoWidth || 640;
            const videoHeight = video.videoHeight || 480;
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            const scaleX = canvasWidth / 640;
            const scaleY = canvasHeight / 480;

            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
            ctx.lineWidth = 2;

            for (let i = 0; i < currentTopcodes.length; i++) {
                const topcode = currentTopcodes[i];
                const scaledX = topcode.x * scaleX;
                const scaledY = topcode.y * scaleY;
                const scaledRadius = topcode.radius * Math.min(scaleX, scaleY);

                ctx.beginPath();
                ctx.arc(scaledX, scaledY, scaledRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                ctx.font = "20px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(topcode.code.toString(), scaledX, scaledY);
                ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            }

            animationFrameId = requestAnimationFrame(drawOverlay);
        };

        const handleTopcodesDetected = (event: Event) => {
            const customEvent = event as CustomEvent<{ topcodes: TopCode[] }>;
            currentTopcodes = customEvent.detail.topcodes;
        };

        const moveVideo = () => {
            const video = document.getElementById('video-canvas-video') as HTMLVideoElement;
            const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;
            const container = document.querySelector('.video-container');

            if (video && canvas && container) {
                if (!container.contains(video)) {
                    container.insertBefore(video, container.firstChild);
                }
                video.style.display = 'block';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'cover';

                if (!container.contains(canvas)) {
                    container.appendChild(canvas);
                }

                canvas.style.display = 'block';
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.pointerEvents = 'none';
                canvas.style.zIndex = '10';

                const updateCanvasSize = () => {
                    const rect = video.getBoundingClientRect();
                    canvas.width = rect.width;
                    canvas.height = rect.height;
                };

                const onVideoLoad = () => {
                    updateCanvasSize();
                    if (!animationFrameId) {
                        drawOverlay();
                    }
                };

                video.addEventListener('loadedmetadata', onVideoLoad);
                video.addEventListener('playing', onVideoLoad);
                window.addEventListener('resize', updateCanvasSize);

                if (video.readyState >= 2) {
                    onVideoLoad();
                }

                return () => {
                    video.removeEventListener('loadedmetadata', onVideoLoad);
                    video.removeEventListener('playing', onVideoLoad);
                    window.removeEventListener('resize', updateCanvasSize);
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