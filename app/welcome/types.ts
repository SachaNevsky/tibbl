// ./app/welcome/types.ts

export interface HowlSprite {
    [key: string]: [number, number];
}

export interface HowlConfig {
    src: string[];
    volume?: number;
    sprite?: HowlSprite;
    onload?: () => void;
    onloaderror?: () => void;
}

export interface HowlInstance {
    stop: () => void;
    off: (event: string) => void;
    play: (sprite?: string) => void;
    on: (event: string, callback: () => void) => void;
    unload: () => void;
    _sprite: HowlSprite;
    playing: () => boolean;
}

export interface TopCode {
    x: number;
    y: number;
    code: number;
    radius: number;
    angle: number;
}

export interface TangibleInstance {
    soundSets: Record<string, HowlSprite>;
    threads: HowlInstance[];
    codeThreads: string[][];
    parseTextAsJavascript: (code: string) => string;
    evalTile: (code: string, context: TangibleInstance) => boolean;
    playStart: (sound: HowlInstance, list: string[]) => void;
    currThread: number;
    setupTangible: () => void;
    isAudioPlaying: () => boolean;
    stopAllSounds: () => void;
    scanCode: () => string;
    readCode: (code: string) => void;
    synthesis: SpeechSynthesis;
    currentCodes: TopCode[];
    codeLibrary: Record<number, string>;
    commands: Record<string, string>;
    topcodeHeight: number;
    topcodeWidth: number;
    userInput: number;
    variableIncrementer: number;
    declarations: string;
    attempts: number;
    funcText: string;
    funcActive: boolean;
    parseCodesAsText: (topCodes: TopCode[]) => string;
    sortTopCodesIntoGrid: (topCodes: TopCode[]) => TopCode[][];
    decodeDial: (angle: number) => string;
    runTextCode: (codeText: string) => void;
    preloads: (soundSet: string, t: number) => void;
    mode: string;
    cameraStatus: boolean;
}

declare global {
    interface Window {
        Tangible: new () => TangibleInstance;
        Howl: new (config: HowlConfig) => HowlInstance;
        Howler: {
            _howls: HowlInstance[];
        };
        TopCodes: {
            startStopVideoScan: (canvasId: string, mode: string) => void;
            setVideoFrameCallback: (
                canvasId: string,
                callback: (jsonString: string) => void,
                context?: unknown
            ) => void;
            _relayFrameData: (canvasId: string, json: string) => void;
            _callbacks: Record<string, (json: string) => void>;
            _mediaStreams: Record<string, MediaStream | null>;
        };
    }
}