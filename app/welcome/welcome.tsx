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
import type { TangibleInstance } from "./types";
import "./welcome.css";

const GITHUB_BASE = "https://raw.githubusercontent.com/armbennett/tangible-11ty/main";

const SOUND_SETS = [
	{ value: "Numbers", label: "Numbers" },
	{ value: "MusicLoops1", label: "Music Loops 1" },
	{ value: "Mystery", label: "Mystery" },
	{ value: "Notifications", label: "Notifications" },
	{ value: "OdeToJoy", label: "Ode to Joy" },
	{ value: "FurElise", label: "Fur Elise" }
];

export default function Home() {
	const [cameraEnabled, setCameraEnabled] = useState(false);
	const [codeText, setCodeText] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [soundSets, setSoundSets] = useState<string[]>(["Numbers", "Notifications", "Notifications"]);
	const [tangibleInstance, setTangibleInstance] = useState<TangibleInstance | null>(null);
	const [isReading, setIsReading] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const preloadCallback = useCallback((instance: TangibleInstance, soundSet: string, threadIndex: number) => {
		preloadSoundSet(instance, soundSet, threadIndex, GITHUB_BASE);
	}, []);

	useCameraSetup(cameraEnabled);
	useReadingState(tangibleInstance, isReading, setIsReading);
	useScriptInitialization(GITHUB_BASE, setTangibleInstance, setIsLoading, preloadCallback);

	const handlePlayStop = createPlayStopHandler(
		tangibleInstance,
		cameraEnabled,
		codeText,
		textareaRef,
		setCodeText,
		setIsPlaying
	);

	const handleRead = createReadHandler(
		tangibleInstance,
		cameraEnabled,
		codeText,
		textareaRef,
		setCodeText,
		setIsReading
	);

	useTouchGestures(handlePlayStop, [tangibleInstance, cameraEnabled, codeText]);

	const toggleCamera = () => {
		if (!tangibleInstance) {
			console.error("Tangible instance not initialized");
			return;
		}

		const newCameraState = !cameraEnabled;

		tangibleInstance.cameraStatus = newCameraState;

		if (window.TopCodes) {
			window.TopCodes.startStopVideoScan("video-canvas", tangibleInstance.mode);

			if (!newCameraState) {
				setTimeout(() => {
					delete window.TopCodes._mediaStreams["video-canvas"];
				}, 100);
			}
		}

		setCameraEnabled(newCameraState);
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
			<CameraSection cameraEnabled={cameraEnabled} />
			<OutputSection
				cameraEnabled={cameraEnabled}
				codeText={codeText}
				textareaRef={textareaRef}
				soundSets={soundSets}
				soundSetOptions={SOUND_SETS}
				onCodeTextChange={setCodeText}
				onSoundSetChange={handleSoundSetChange}
			/>
		</div>
	);
}