// ./app/welcome/utils/preloadSoundSet.ts

import type { TangibleInstance } from "../types";

/**
 * Preloads a sound set for a specific thread by creating a Howl instance.
 * 
 * @param instance - The Tangible instance to load sounds into
 * @param soundSet - The name of the sound set to load
 * @param threadIndex - The thread index (0-2) to load the sound set into
 * @param githubBase - The base GitHub URL for loading sound files
 */
export function preloadSoundSet(
    instance: TangibleInstance,
    soundSet: string,
    threadIndex: number,
    githubBase: string
): void {
    const thread = new window.Howl({
        src: [`${githubBase}/assets/sound/${soundSet}.mp3`],
        volume: 1.0,
        sprite: instance.soundSets[soundSet]
    });
    instance.threads[threadIndex] = thread;
}