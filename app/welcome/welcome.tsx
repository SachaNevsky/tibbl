// ./app/welcome/welcome.tsx

import { useState, useRef, useEffect } from "react";
import "app/welcome.css"

const GITHUB_BASE = "https://raw.githubusercontent.com/armbennett/tangible-11ty/main";

const SOUND_SETS = [
	{ value: "Numbers", label: "Numbers" },
	{ value: "MusicLoops1", label: "Music Loops 1" },
	{ value: "Mystery", label: "Mystery" },
	{ value: "Notifications", label: "Notifications" },
	{ value: "OdeToJoy", label: "Ode to Joy" },
	{ value: "FurElise", label: "Fur Elise" }
];

interface HowlSprite {
	[key: string]: [number, number];
}

interface HowlConfig {
	src: string[];
	volume: number;
	sprite: HowlSprite;
}

interface HowlInstance {
	stop: () => void;
	off: (event: string) => void;
	play: (sprite: string) => void;
	on: (event: string, callback: () => void) => void;
	_sprite: HowlSprite;
	playing: () => boolean;
}

interface TopCode {
	x: number;
	y: number;
	code: number;
	radius: number;
	angle: number;
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

interface TangibleInstance {
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

export default function Home() {
	const [cameraEnabled, setCameraEnabled] = useState(false);
	const [codeText, setCodeText] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [soundSets, setSoundSets] = useState<string[]>(["Numbers", "Notifications", "Notifications"]);
	const [tangibleInstance, setTangibleInstance] = useState<TangibleInstance | null>(null);
	const [isReading, setIsReading] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const preloadsWithGitHub = (instance: TangibleInstance, soundSet: string, t: number) => {
		console.log(`Preloading sound set: ${soundSet} for thread ${t}`);
		const thread = new window.Howl({
			src: [`${GITHUB_BASE}/assets/sound/${soundSet}.mp3`],
			volume: 0.2,
			sprite: instance.soundSets[soundSet]
		});
		instance.threads[t] = thread;
	};

	useEffect(() => {
		if (!cameraEnabled) return;

		const moveVideo = () => {
			const video = document.getElementById('video-canvas-video') as HTMLVideoElement;
			const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;
			const container = document.querySelector('.video-container');

			if (video && canvas && container) {
				console.log('Moving video to container and positioning canvas');
				if (!container.contains(video)) {
					container.insertBefore(video, container.firstChild);
				}
				video.style.display = 'block';

				if (!container.contains(canvas)) {
					container.appendChild(canvas);
				}

				canvas.style.position = 'absolute';
				canvas.style.top = '0';
				canvas.style.left = '0';
				canvas.style.width = '100%';
				canvas.style.height = '100%';
				canvas.style.pointerEvents = 'none';
				canvas.style.zIndex = '10';
				canvas.style.display = 'block';

				console.log('Video and canvas configured');
			}
		};

		const interval = setInterval(() => {
			const video = document.getElementById('video-canvas-video');
			if (video) {
				moveVideo();
				clearInterval(interval);
			}
		}, 100);

		setTimeout(() => clearInterval(interval), 5000);

		return () => clearInterval(interval);
	}, [cameraEnabled]);

	useEffect(() => {
		const loadScripts = async () => {
			try {
				console.log("Loading Howler.js");
				const howlerResponse = await fetch(`${GITHUB_BASE}/assets/js/howler.js`);
				const howlerCode = await howlerResponse.text();
				const howlerScript = document.createElement("script");
				howlerScript.textContent = howlerCode;
				document.head.appendChild(howlerScript);
				console.log("Howler.js loaded");

				console.log("Loading TopCodes.js");
				const topcodesResponse = await fetch(`${GITHUB_BASE}/assets/js/topcodes.js`);
				const topcodesCode = await topcodesResponse.text();
				const topcodesScript = document.createElement("script");
				topcodesScript.textContent = topcodesCode;
				document.head.appendChild(topcodesScript);
				console.log("TopCodes.js loaded");

				console.log("Loading Tangible.js");
				const response = await fetch(`${GITHUB_BASE}/assets/js/tangible.js`);
				const tangibleCode = await response.text();
				const modifiedCode = tangibleCode.replace("export default class Tangible", "window.Tangible = class Tangible");
				const script = document.createElement("script");
				script.textContent = modifiedCode;
				document.head.appendChild(script);
				console.log("Tangible.js loaded");

				await new Promise(resolve => setTimeout(resolve, 200));

				if (window.Tangible) {
					console.log("Creating Tangible instance");
					const instance = new window.Tangible();

					instance.setupTangible();
					console.log("setupTangible called");

					preloadsWithGitHub(instance, "Numbers", 0);
					preloadsWithGitHub(instance, "Notifications", 1);
					preloadsWithGitHub(instance, "Notifications", 2);

					setTangibleInstance(instance);
				} else {
					console.error("window.Tangible not available");
				}

				setIsLoading(false);
			} catch (error) {
				console.error("Error loading scripts:", error);
				setIsLoading(false);
			}
		};
		loadScripts();
	}, []);



	const toggleCamera = () => {
		if (!tangibleInstance) {
			console.error("Tangible instance not initialized");
			return;
		}

		const newCameraState = !cameraEnabled;
		console.log("Toggling camera to:", newCameraState);

		tangibleInstance.cameraStatus = newCameraState;

		if (window.TopCodes) {
			window.TopCodes.startStopVideoScan("video-canvas", tangibleInstance.mode);

			if (!newCameraState) {
				setTimeout(() => {
					delete window.TopCodes._mediaStreams["video-canvas"];
					console.log("Deleted mediaStream reference to allow reinitialization");
				}, 100);
			}
		}

		setCameraEnabled(newCameraState);
	};

	const handleSoundSetChange = (threadIndex: number, soundSet: string) => {
		console.log(`Changing thread ${threadIndex} to sound set: ${soundSet}`);
		const newSoundSets = [...soundSets];
		newSoundSets[threadIndex] = soundSet;
		setSoundSets(newSoundSets);

		if (tangibleInstance) {
			preloadsWithGitHub(tangibleInstance, soundSet, threadIndex);
		}
	};

	const handlePlayStop = () => {
		if (!tangibleInstance) {
			console.error("Tangible instance not initialized");
			return;
		}

		if (tangibleInstance.isAudioPlaying()) {
			console.log("Stopping audio");
			tangibleInstance.stopAllSounds();
			setIsPlaying(false);
			return;
		}

		if (cameraEnabled) {
			console.log("Camera enabled, scanning code");
			const scannedCode = tangibleInstance.scanCode();
			console.log("Scanned code:", scannedCode);

			if (scannedCode) {
				const cleanedCode = scannedCode
					.replace(/<br\/>/g, '\n')
					.replace(/,\s*X:\[object Object\]/g, '');
				setCodeText(cleanedCode);

				console.log("Running scanned code:", cleanedCode);

				if (cleanedCode && cleanedCode.trim()) {
					tangibleInstance.codeThreads = [[], [], []];
					tangibleInstance.runTextCode(cleanedCode);
					setIsPlaying(true);

					const checkAudio = setInterval(() => {
						if (!tangibleInstance.isAudioPlaying()) {
							setIsPlaying(false);
							clearInterval(checkAudio);
						}
					}, 100);
				}
				return;
			}
		}

		const textCode = textareaRef.current?.value || codeText;

		console.log("Running code:", textCode);

		if (textCode && textCode.trim()) {
			tangibleInstance.codeThreads = [[], [], []];
			tangibleInstance.runTextCode(textCode);
			setIsPlaying(true);

			const checkAudio = setInterval(() => {
				if (!tangibleInstance.isAudioPlaying()) {
					setIsPlaying(false);
					clearInterval(checkAudio);
				}
			}, 100);
		} else {
			console.log("No code to run");
		}
	};

	const handleReadClick = () => {
		if (!tangibleInstance) {
			console.error("Tangible instance not initialized");
			return;
		}

		if (tangibleInstance.synthesis.speaking) {
			console.log("Stopping speech synthesis");
			tangibleInstance.synthesis.cancel();
			setIsReading(false);
			return;
		}

		if (tangibleInstance.isAudioPlaying()) {
			console.log("Stopping audio");
			tangibleInstance.stopAllSounds();
			return;
		}

		if (cameraEnabled) {
			console.log("Camera enabled, scanning code for reading");
			const scannedCode = tangibleInstance.scanCode();
			console.log("Scanned code:", scannedCode);

			if (scannedCode) {
				const cleanedCode = scannedCode
					.replace(/<br\/>/g, '\n')
					.replace(/,\s*X:\[object Object\]/g, '');
				setCodeText(cleanedCode);

				console.log("Reading scanned code:", cleanedCode);

				if (cleanedCode && cleanedCode.trim()) {
					tangibleInstance.readCode(cleanedCode);
					setIsReading(true);
				}
				return;
			}
		}

		const textCode = textareaRef.current?.value || codeText;

		console.log("Reading code:", textCode);

		if (textCode && textCode.trim()) {
			tangibleInstance.readCode(textCode);
			setIsReading(true);
		} else {
			console.log("No code to read");
		}
	};

	useEffect(() => {
		if (!tangibleInstance) return;

		const checkSpeaking = setInterval(() => {
			if (isReading && !tangibleInstance.synthesis.speaking) {
				setIsReading(false);
			}
		}, 100);

		return () => clearInterval(checkSpeaking);
	}, [tangibleInstance, isReading]);

	useEffect(() => {
		const handleTouch = (e: TouchEvent) => {
			if (e.touches.length === 3) {
				e.preventDefault();
				handlePlayStop();
			}
		};

		document.addEventListener("touchstart", handleTouch, { passive: false });
		return () => {
			document.removeEventListener("touchstart", handleTouch);
		};
	}, [tangibleInstance, cameraEnabled, codeText]);

	return (
		<div className="app-container">
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
						onClick={toggleCamera}
						aria-label={cameraEnabled ? "Disable camera" : "Enable camera"}
						aria-pressed={cameraEnabled}
						disabled={isLoading || !tangibleInstance}
					>
						<i className="fa-solid fa-camera fa-2xl" aria-hidden="true"></i>
						<span>Camera</span>
					</button>
					<button
						className="header-button"
						onClick={handlePlayStop}
						aria-label={isPlaying ? "Stop code execution" : "Play and execute code"}
						aria-pressed={isPlaying}
						disabled={isLoading || !tangibleInstance}
					>
						<i className={`fa-solid ${isPlaying ? 'fa-stop' : 'fa-play'} fa-2xl`} aria-hidden="true"></i>
						<span>{isPlaying ? 'Stop' : 'Play'}</span>
					</button>
					<button
						className="header-button"
						onClick={handleReadClick}
						aria-label={isReading ? "Stop reading code" : "Read out code text"}
						aria-pressed={isReading}
						disabled={isLoading || !tangibleInstance}
					>
						<i className="fa-brands fa-readme fa-2xl" aria-hidden="true"></i>
						<span>{isReading ? 'Stop' : 'Read'}</span>
					</button>
				</nav>
			</header>

			{/* Camera section - only show when camera is enabled */}
			{cameraEnabled && (
				<section className="camera-section" role="region" aria-label="Camera view">
					<div className="video-container">
						<canvas
							id="video-canvas"
							width="640"
							height="480"
							aria-label="Code tile detection overlay"
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								pointerEvents: 'none',
								zIndex: 10
							}}
						/>
					</div>
				</section>
			)}

			{/* If camera is not enabled, still need canvas in DOM but hidden */}
			{!cameraEnabled && (
				<canvas id="video-canvas" width="640" height="480" style={{ display: 'none' }} />
			)}

			<section
				className={`output-section ${cameraEnabled ? "camera-active" : ""}`}
				role="region"
				aria-label="Code output and thread selection"
			>
				<div className="textbox-container">
					<textarea
						ref={textareaRef}
						value={codeText}
						onChange={(e) => setCodeText(e.target.value)}
						className="output-textbox"
						placeholder="THREAD 1\nLOOP 4 TIMES\nPLAY 5\nEND LOOP\nPLAY 7\n\nTHREAD 2\nDELAY 4\nLOOP 3 TIMES\nPLAY 8\nEND LOOP"
						aria-label="Code output text area"
					/>
				</div>
				<div className="dropdown-container">
					<div className="dropdown-group">
						<label htmlFor="thread1" className="dropdown-label">Thread 1</label>
						<select
							id="thread1"
							className="dropdown"
							value={soundSets[0]}
							onChange={(e) => handleSoundSetChange(0, e.target.value)}
							aria-label="Select Thread 1 sound options"
						>
							{SOUND_SETS.map((set) => (
								<option key={set.value} value={set.value}>
									{set.label}
								</option>
							))}
						</select>
					</div>
					<div className="dropdown-group">
						<label htmlFor="thread2" className="dropdown-label">Thread 2</label>
						<select
							id="thread2"
							className="dropdown"
							value={soundSets[1]}
							onChange={(e) => handleSoundSetChange(1, e.target.value)}
							aria-label="Select Thread 2 sound options"
						>
							{SOUND_SETS.map((set) => (
								<option key={set.value} value={set.value}>
									{set.label}
								</option>
							))}
						</select>
					</div>
					<div className="dropdown-group">
						<label htmlFor="thread3" className="dropdown-label">Thread 3</label>
						<select
							id="thread3"
							className="dropdown"
							value={soundSets[2]}
							onChange={(e) => handleSoundSetChange(2, e.target.value)}
							aria-label="Select Thread 3 sound options"
						>
							{SOUND_SETS.map((set) => (
								<option key={set.value} value={set.value}>
									{set.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</section>
		</div>
	);
}