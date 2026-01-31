// ./app/welcome/hooks/useScriptInitialization.ts

import { useEffect } from "react";
import type { TangibleInstance } from "../types";
import { loadExternalScripts } from "../utils/scriptLoader";

/**
 * Custom hook that initializes external scripts and the Tangible instance on mount.
 * Loads Howler, TopCodes, and Tangible libraries and preloads initial sound sets.
 * 
 * @param githubBase - The base GitHub URL for loading script files
 * @param setTangibleInstance - State setter for the Tangible instance
 * @param setIsLoading - State setter for loading status
 * @param preloadCallback - Callback function to preload sound sets
 */
export function useScriptInitialization(
    githubBase: string,
    setTangibleInstance: (instance: TangibleInstance | null) => void,
    setIsLoading: (loading: boolean) => void,
    preloadCallback: (instance: TangibleInstance, soundSet: string, threadIndex: number) => void
): void {
    useEffect(() => {
        const initializeScripts = async () => {
            try {
                const instance = await loadExternalScripts(githubBase, preloadCallback);
                setTangibleInstance(instance);
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading scripts:", error);
                setIsLoading(false);
            }
        };
        initializeScripts();
    }, [githubBase, setTangibleInstance, setIsLoading, preloadCallback]);
}