// ./app/welcome/utils/scriptLoader.ts

import type { TangibleInstance } from "../types";

/**
 * Loads external JavaScript libraries (Howler, TopCodes, Tangible) and initializes the Tangible instance.
 * 
 * @param githubBase - The base GitHub URL for loading script files
 * @param preloadCallback - Callback function to preload sound sets after initialization
 * @returns Promise resolving to initialized TangibleInstance or null if initialization fails
 */
export async function loadExternalScripts(
    githubBase: string,
    preloadCallback: (instance: TangibleInstance, soundSet: string, threadIndex: number) => void
): Promise<TangibleInstance | null> {
    const howlerResponse = await fetch(`${githubBase}/assets/js/howler.js`);
    const howlerCode = await howlerResponse.text();
    const howlerScript = document.createElement("script");
    howlerScript.textContent = howlerCode;
    document.head.appendChild(howlerScript);

    const topcodesResponse = await fetch(`${githubBase}/assets/js/topcodes.js`);
    const topcodesCode = await topcodesResponse.text();
    const topcodesScript = document.createElement("script");
    topcodesScript.textContent = topcodesCode;
    document.head.appendChild(topcodesScript);

    const response = await fetch(`${githubBase}/assets/js/tangible.js`);
    const tangibleCode = await response.text();

    let modifiedCode = tangibleCode.replace("export default class Tangible", "window.Tangible = class Tangible");

    modifiedCode = modifiedCode.replace(
        /setupTangible\(\) \{[\s\S]*?setVideoFrameCallback\("video-canvas", function \(jsonString\) \{[\s\S]*?\}, this\);[\s\S]*?\}/,
        `setupTangible() {
        this.setVideoCanvasHeight('video-canvas');
        let tangible = this;
        
        TopCodes.setVideoFrameCallback("video-canvas", function (jsonString) {
            
            var canvas = document.querySelector("#video-canvas");
            if (!canvas) {
                console.error("Canvas not found in callback!");
                return;
            }
            var ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error("Could not get context in callback!");
                return;
            }
            
            var json = JSON.parse(jsonString);
            var topcodes = json.topcodes;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
            ctx.lineWidth = 10;
            ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
            
            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            for (let i = 0; i < topcodes.length; i++) {
                ctx.beginPath();
                ctx.arc(topcodes[i].x - (topcodes[i].radius/2), topcodes[i].y, topcodes[i].radius, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.font = "26px Arial";
                ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
                ctx.fillText(topcodes[i].code, topcodes[i].x - topcodes[i].radius, topcodes[i].y);
                ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            }
            tangible.currentCodes = topcodes;
            tangible.once = true;
        }, this);
    }`
    );

    const script = document.createElement("script");
    script.textContent = modifiedCode;
    document.head.appendChild(script);

    await new Promise(resolve => setTimeout(resolve, 200));

    if (window.Tangible) {
        const instance = new window.Tangible();

        instance.setupTangible();

        setTimeout(() => {
            const testCanvas = document.getElementById('video-canvas') as HTMLCanvasElement;
            if (testCanvas) {
                const testCtx = testCanvas.getContext('2d');
                if (testCtx) {
                    testCtx.fillStyle = "rgba(0, 0, 255, 0.5)";
                    testCtx.fillRect(200, 200, 100, 100);
                } else {
                    console.error("Manual test: Could not get canvas context");
                }
            } else {
                console.error("Manual test: Canvas not found");
            }
        }, 1000);

        preloadCallback(instance, "Numbers", 0);
        preloadCallback(instance, "Notifications", 1);
        preloadCallback(instance, "Notifications", 2);

        return instance;
    } else {
        console.error("window.Tangible not available");
        return null;
    }
}