// ./app/welcome/components/Header.tsx

import type { TangibleInstance } from "../types";

interface HeaderProps {
    cameraEnabled: boolean;
    isPlaying: boolean;
    isReading: boolean;
    isLoading: boolean;
    tangibleInstance: TangibleInstance | null;
    onCameraToggle: () => void;
    onPlayStop: () => void;
    onRead: () => void;
}

/**
 * Renders the application header with logo and control buttons.
 * 
 * @param props - Component props
 * @param props.cameraEnabled - Whether the camera is currently enabled
 * @param props.isPlaying - Whether code is currently playing
 * @param props.isReading - Whether code is being read aloud
 * @param props.isLoading - Whether the application is loading
 * @param props.tangibleInstance - The Tangible instance
 * @param props.onCameraToggle - Handler for camera toggle button
 * @param props.onPlayStop - Handler for play/stop button
 * @param props.onRead - Handler for read button
 */
export function Header({
    cameraEnabled,
    isPlaying,
    isReading,
    isLoading,
    tangibleInstance,
    onCameraToggle,
    onPlayStop,
    onRead
}: HeaderProps) {
    return (
        <header className="header" role="banner">
            <div className="logo-container">
                <img
                    src="https://armbennett.github.io/tangible-11ty/assets/img/tibbl-logo.png"
                    alt="Application logo"
                    className="logo"
                />
            </div>
            <nav className="header-buttons" role="navigation" aria-label="Main navigation">
                <button
                    className="header-button"
                    onClick={onCameraToggle}
                    aria-label={cameraEnabled ? "Disable camera" : "Enable camera"}
                    aria-pressed={cameraEnabled}
                    disabled={isLoading || !tangibleInstance}
                >
                    <i className="fa-solid fa-camera fa-2xl" aria-hidden="true"></i>
                    <span>Camera</span>
                </button>
                <button
                    className="header-button"
                    onClick={onPlayStop}
                    aria-label={isPlaying ? "Stop code execution" : "Play and execute code"}
                    aria-pressed={isPlaying}
                    disabled={isLoading || !tangibleInstance}
                >
                    <i className={`fa-solid ${isPlaying ? 'fa-stop' : 'fa-play'} fa-2xl`} aria-hidden="true"></i>
                    <span>{isPlaying ? 'Stop' : 'Play'}</span>
                </button>
                <button
                    className="header-button"
                    onClick={onRead}
                    aria-label={isReading ? "Stop reading code" : "Read out code text"}
                    aria-pressed={isReading}
                    disabled={isLoading || !tangibleInstance}
                >
                    <i className="fa-brands fa-readme fa-2xl" aria-hidden="true"></i>
                    <span>{isReading ? 'Stop' : 'Read'}</span>
                </button>
            </nav>
        </header>
    );
}