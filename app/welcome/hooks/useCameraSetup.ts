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

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
            ctx.lineWidth = 2;

            for (let i = 0; i < topcodes.length; i++) {
                const topcode = topcodes[i];

                const transformedX = canvas.width - topcode.x;
                const transformedY = topcode.y;

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
            ctx.fillRect(0, 0, 100, 44);

            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.font = "bold 14px monospace";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(isVideoPortrait ? "Portrait" : "Landscape", 5, 10);
            ctx.fillText(`(${canvas.width} x ${canvas.height})`, 5, 30);

            ctx.fillStyle = "rgba(0, 100, 0, 0.8)";
            ctx.fillRect(0, canvas.height - 110, 140, 110);

            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.font = "12px monospace";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(`Video: ${videoWidth}x${videoHeight}`, 5, canvas.height - 105);
            ctx.fillText(`Canvas: ${canvas.width}x${canvas.height}`, 5, canvas.height - 90);
            ctx.fillText(`Aspect: ${(videoWidth / videoHeight).toFixed(2)}`, 5, canvas.height - 75);
            ctx.fillText(`TopCodes: ${topcodes.length}`, 5, canvas.height - 60);
            ctx.fillText(`Browser: ${navigator.userAgent.includes('Safari') ? 'Safari' : navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Other'}`, 5, canvas.height - 45);
            ctx.fillText(`Platform: ${navigator.platform}`, 5, canvas.height - 30);
            ctx.fillText(`Ready: ${video.readyState}/4`, 5, canvas.height - 15);
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