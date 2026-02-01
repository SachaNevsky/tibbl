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
            var json = JSON.parse(jsonString);
            var topcodes = json.topcodes;
            tangible.currentCodes = topcodes;
            tangible.once = true;
            
            const event = new CustomEvent('topcodes-detected', { 
                detail: { topcodes: topcodes } 
            });
            window.dispatchEvent(event);
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

        preloadCallback(instance, "Numbers", 0);
        preloadCallback(instance, "Notifications", 1);
        preloadCallback(instance, "Notifications", 2);

        return instance;
    } else {
        console.error("window.Tangible not available");
        return null;
    }
}