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
 * Sort the top codes `y` ascending and `x` descending (since video is mirrored).
 * @param a - The first value to compare
 * @param b - The second value to compare
 * @return `0` if `a` and `b` are considered equal (same position);
 * 
 * `1` if `a` comes after `b` in the sorted array;
 * 
 * `-1` if `a` comes before `b` in the sorted array
 */
function sortTopCodeComparator(a: TopCode, b: TopCode): number {

    if (Math.abs(a.y - b.y) <= 40) {
        if (a.x == b.x) {
            return 0;
        }
        if (a.x < b.x) {
            return 1;
        }
        return -1;
    }
    if (a.y < b.y) {
        return -1;
    }
    return 1;
}

/** Sort topCodes into a grid using `(x, y)` coordinates.
 *
 * @param topCodes - The topCodes to sort
 * @return multi-dimensional grid array
 */
function sortTopCodesIntoGrid(topCodes: Array<TopCode>) {
    topCodes.sort(sortTopCodeComparator);
    let grid: Array<Array<TopCode>> = [];
    let line = Array();
    let currentY = -1;

    for (let i = 0; i < topCodes.length; i++) {
        if (currentY >= 0 && topCodes[i].y - currentY >= 40) {
            grid.push(line);
            line = Array();
            currentY = topCodes[i].y;
        } else if (currentY < 0) {
            currentY = topCodes[i].y;
        }
        line.push(topCodes[i]);
    }
    grid.push(line);
    return grid;
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
            const topcodes = sortTopCodesIntoGrid(customEvent.detail.topcodes);

            const video = document.getElementById('video-canvas-video') as HTMLVideoElement;
            const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;

            if (!video || !canvas || video.readyState < 2) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            const isVideoPortrait = videoHeight > videoWidth;

            let expectedCanvasWidth: number;
            let expectedCanvasHeight: number;

            if (isVideoPortrait) {
                expectedCanvasWidth = videoWidth;
                expectedCanvasHeight = videoHeight;
            } else {
                expectedCanvasWidth = 640;
                expectedCanvasHeight = 480;
            }

            if (canvas.width !== expectedCanvasWidth || canvas.height !== expectedCanvasHeight) {
                canvas.width = expectedCanvasWidth;
                canvas.height = expectedCanvasHeight;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "$00640080";
            ctx.strokeStyle = "#006400";
            ctx.lineWidth = 5;
            let counter = 1;

            for (let i = 0; i < topcodes.length; i++) {
                for (let j = 0; j < topcodes[i].length; j++) {
                    const line = topcodes[i];
                    const topCode = line[j];

                    const transformedX = canvas.width - topCode.x;
                    const transformedY = topCode.y;

                    ctx.beginPath();
                    ctx.arc(transformedX, transformedY, topCode.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = "rgba(255, 255, 255, 1)";
                    ctx.font = "900 28px monospace";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(`${counter}`, transformedX, transformedY);

                    ctx.fillStyle = "#00640080";
                    counter++;
                }
            }
        };

        const setupCanvas = () => {
            const video = document.getElementById('video-canvas-video') as HTMLVideoElement;
            const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;
            const container = document.querySelector('.video-container');

            if (video && canvas && container) {
                video.style.display = 'none';

                const videoWidth = video.videoWidth || 640;
                const videoHeight = video.videoHeight || 480;

                const isVideoPortrait = videoHeight > videoWidth;

                let targetWidth: number;
                let targetHeight: number;

                if (isVideoPortrait) {
                    targetWidth = videoWidth;
                    targetHeight = videoHeight;
                } else {
                    targetWidth = 640;
                    targetHeight = 480;
                }

                if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
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

        const video = document.getElementById('video-canvas-video') as HTMLVideoElement;
        const handleLoadedMetadata = () => {
            if (video) {
                setupCanvas();
            }
        };

        const handleResize = () => {
            setupCanvas();
        };

        if (video) {
            if (video.readyState >= 1) {
                setupCanvas();
            }
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.addEventListener('resize', handleResize);
        }

        const handleOrientationChange = () => {
            setTimeout(() => {
                setupCanvas();
            }, 100);
        };

        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);

        const interval = setInterval(() => {
            const videoElement = document.getElementById('video-canvas-video') as HTMLVideoElement;
            if (videoElement && videoElement.readyState >= 1) {
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
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleOrientationChange);
            if (video) {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                video.removeEventListener('resize', handleResize);
            }
            if (observer) {
                observer.disconnect();
            }
        };
    }, [cameraEnabled]);
}