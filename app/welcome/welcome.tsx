// ./app/welcome/welcome.tsx

import { useState, useRef, useCallback } from "react";
import { Header } from "./components/Header";
import { CameraSection } from "./components/CameraSection";
import { OutputSection } from "./components/OutputSection";
import { useCameraSetup } from "./hooks/useCameraSetup";
import { useReadingState } from "./hooks/useReadingState";
import { useScriptInitialization } from "./hooks/useScriptInitialization";
import { useTouchGestures } from "./hooks/useTouchGestures";
import { createPlayStopHandler } from "./handlers/playStopHandler";
import { createReadHandler } from "./handlers/readHandler";
import { preloadSoundSet } from "./utils/preloadSoundSet";
import { initializeAudioContext } from "./utils/initializeAudioContext";
import type { TangibleInstance } from "./types";
import "./welcome.css";

const GITHUB_BASE: string = "https://raw.githubusercontent.com/armbennett/tangible-11ty/main";

const SOUND_SETS: { value: string, label: string }[] = [
	{ value: "Numbers", label: "Numbers" },
	{ value: "MusicLoops1", label: "Music Loops 1" },
	{ value: "Mystery", label: "Mystery" },
	{ value: "Notifications", label: "Notifications" },
	{ value: "OdeToJoy", label: "Ode to Joy" },
	{ value: "FurElise", label: "Fur Elise" }
];

const PLACEHOLDER: string = "Thread 1\nLoop 4 times\nPlay 5\nEnd loop\nPlay 7\n\nThread 2\nDelay 4\nLoop 3 times\nPlay 8\nEnd loop";

export default function Home() {
	const [cameraEnabled, setCameraEnabled] = useState<boolean>(false);
	const [codeText, setCodeText] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [soundSets, setSoundSets] = useState<string[]>(["Numbers", "Notifications", "Notifications"]);
	const [tangibleInstance, setTangibleInstance] = useState<TangibleInstance | null>(null);
	const [isReading, setIsReading] = useState<boolean>(false);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
	const [readingOrderRotation, setReadingOrderRotation] = useState<0 | 90 | 180 | 270>(0);
	const [audioInitialized, setAudioInitialized] = useState<boolean>(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const lastClickTime = useRef<number>(0);

	const preloadCallback = useCallback((instance: TangibleInstance, soundSet: string, threadIndex: number) => {
		preloadSoundSet(instance, soundSet, threadIndex, GITHUB_BASE);
	}, []);

	useCameraSetup(cameraEnabled, readingOrderRotation);
	useReadingState(tangibleInstance, isReading, setIsReading);
	useScriptInitialization(GITHUB_BASE, setTangibleInstance, setIsLoading, preloadCallback);

	const handlePlayStop = createPlayStopHandler(
		tangibleInstance,
		cameraEnabled,
		codeText,
		textareaRef,
		setCodeText,
		setIsPlaying,
		PLACEHOLDER,
		readingOrderRotation
	);

	const handleRead = createReadHandler(
		tangibleInstance,
		cameraEnabled,
		codeText,
		textareaRef,
		setCodeText,
		setIsReading,
		PLACEHOLDER,
		readingOrderRotation
	);

	useTouchGestures(handlePlayStop, cameraEnabled, tangibleInstance, GITHUB_BASE, [tangibleInstance, cameraEnabled, codeText]);

	const toggleCamera = (e: { stopPropagation: () => void; }) => {
		e.stopPropagation();

		const now = Date.now();
		if (now - lastClickTime.current < 300) return;

		lastClickTime.current = now;
		if (!tangibleInstance) {
			console.error("Tangible instance not initialized");
			return;
		}

		if (!audioInitialized) {
			initializeAudioContext();
			setAudioInitialized(true);
		}

		const newCameraState = !cameraEnabled;

		tangibleInstance.cameraStatus = newCameraState;

		if (window.TopCodes) {
			window.TopCodes.startStopVideoScan("video-canvas", tangibleInstance.mode);

			if (!newCameraState) {
				setTimeout(() => {
					const video = document.getElementById('video-canvas-video') as HTMLVideoElement;
					if (video) {
						video.srcObject = null;
						video.remove();
					}
					delete window.TopCodes._mediaStreams["video-canvas"];
				}, 100);
			}
		}

		setCameraEnabled(newCameraState);
	};

	const handleRotate = (e: { stopPropagation: () => void; }) => {
		e.stopPropagation();

		const now = Date.now();
		if (now - lastClickTime.current < 300) return;

		lastClickTime.current = now;
		setRotation((prevRotation) => (prevRotation + 90) % 360 as 0 | 90 | 180 | 270);
	};

	const handleReadingOrderRotate = (e: { stopPropagation: () => void; }) => {
		e.stopPropagation();

		const now = Date.now();
		if (now - lastClickTime.current < 300) return;

		lastClickTime.current = now;
		setReadingOrderRotation((prevRotation) => (prevRotation + 90) % 360 as 0 | 90 | 180 | 270);
	};

	const handleSoundSetChange = (threadIndex: number, soundSet: string) => {
		const newSoundSets = [...soundSets];
		newSoundSets[threadIndex] = soundSet;
		setSoundSets(newSoundSets);

		if (tangibleInstance) {
			preloadSoundSet(tangibleInstance, soundSet, threadIndex, GITHUB_BASE);
		}
	};

	return (
		<div className="app-container">
			<Header
				cameraEnabled={cameraEnabled}
				isPlaying={isPlaying}
				isReading={isReading}
				isLoading={isLoading}
				tangibleInstance={tangibleInstance}
				onCameraToggle={toggleCamera}
				onPlayStop={handlePlayStop}
				onRead={handleRead}
			/>
			<CameraSection
				cameraEnabled={cameraEnabled}
				rotation={rotation}
				readingOrderRotation={readingOrderRotation}
				onRotate={handleRotate}
				onReadingOrderRotate={handleReadingOrderRotate}
			/>
			<OutputSection
				cameraEnabled={cameraEnabled}
				codeText={codeText}
				textareaRef={textareaRef}
				soundSets={soundSets}
				soundSetOptions={SOUND_SETS}
				onCodeTextChange={setCodeText}
				onSoundSetChange={handleSoundSetChange}
				placeholder={PLACEHOLDER}
			/>
		</div>
	);
}