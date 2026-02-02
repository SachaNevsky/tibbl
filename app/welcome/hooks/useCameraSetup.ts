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

        const handleTopcodesDetected = (event: Event) => {
            const customEvent = event as CustomEvent<{ topcodes: TopCode[] }>;
            const topcodes = customEvent.detail.topcodes;

            const video = document.getElementById('video-canvas-video') as HTMLVideoElement;
            const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;

            if (!video || !canvas || video.readyState < 2) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            const isVideoPortrait = videoHeight > videoWidth;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();

            if (isVideoPortrait) {
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            } else {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            ctx.restore();

            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
            ctx.lineWidth = 2;

            for (let i = 0; i < topcodes.length; i++) {
                const topcode = topcodes[i];

                let transformedX = canvas.width - topcode.x;
                let transformedY = topcode.y;

                if (isVideoPortrait) {
                    transformedX = canvas.width - topcode.y;
                    transformedY = canvas.width - topcode.x;
                }

                ctx.beginPath();
                ctx.arc(transformedX, transformedY, topcode.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "rgba(255, 255, 255, 1)";
                ctx.font = "14px monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(
                    `(${Math.round(transformedX)}, ${Math.round(transformedY)})`,
                    transformedX,
                    transformedY
                );
                ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            }

            ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
            ctx.fillRect(0, 0, 20, 20);

            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.font = "bold 14px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(isVideoPortrait ? "P" : "L", 10, 10);
        };

        const setupCanvas = () => {
            const video = document.getElementById('video-canvas-video') as HTMLVideoElement;
            const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;
            const container = document.querySelector('.video-container');

            if (video && canvas && container) {
                video.style.display = 'none';

                if (canvas.width !== 640 || canvas.height !== 480) {
                    canvas.width = 640;
                    canvas.height = 480;
                }

                if (!container.contains(canvas)) {
                    container.appendChild(canvas);
                }

                const isRotatedSideways = canvas.classList.contains('rotated-sideways');

                canvas.style.display = 'block';
                canvas.style.position = 'relative';
                canvas.style.objectFit = 'contain';

                if (isRotatedSideways) {
                    canvas.style.width = 'auto';
                    canvas.style.height = 'auto';
                    canvas.style.maxWidth = '50vh';
                    canvas.style.maxHeight = 'none';
                } else {
                    canvas.style.width = '100%';
                    canvas.style.height = 'auto';
                    canvas.style.maxHeight = '50vh';
                    canvas.style.maxWidth = '';
                }
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

        const canvas = document.getElementById('video-canvas');
        let observer: MutationObserver | null = null;

        if (canvas) {
            observer = new MutationObserver(() => {
                setupCanvas();
            });
            observer.observe(canvas, { attributes: true, attributeFilter: ['class'] });
        }

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
            window.removeEventListener('topcodes-detected', handleTopcodesDetected);
            if (observer) {
                observer.disconnect();
            }
        };
    }, [cameraEnabled]);
}