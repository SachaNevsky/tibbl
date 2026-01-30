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

declare global {
	interface Window {
		Tangible: any;
		Howl: new (config: unknown) => { stop: () => void };
	}
}

interface TangibleInstance {
	soundSets: Record<string, unknown>;
	threads: unknown[];
	codeThreads: unknown[][];
	parseTextAsJavascript: (code: string) => string;
	evalTile: (code: string, context: unknown) => boolean;
	playStart: (sound: unknown, list: unknown[]) => void;
	currThread: number;
	setupTangible: () => void;
	isAudioPlaying: () => boolean;
	stopAllSounds: () => void;
	scanCode: () => string;
	readCode: (code: string) => void;
	synthesis: SpeechSynthesis;
}

export default function Home() {
	const [cameraEnabled, setCameraEnabled] = useState(false);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [codeText, setCodeText] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [soundSets, setSoundSets] = useState<string[]>(["Numbers", "Numbers", "Numbers"]);
	const [tangibleInstance, setTangibleInstance] = useState<TangibleInstance | null>(null);
	const [isReading, setIsReading] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);


	const toggleCamera = () => {
		setCameraEnabled(!cameraEnabled);
	};

	const preloadsWithGitHub = (instance: TangibleInstance, soundSet: string, t: number) => {
		const thread = new window.Howl({
			src: [`${GITHUB_BASE}/assets/sound/${soundSet}.mp3`],
			volume: 0.2,
			sprite: instance.soundSets[soundSet]
		});
		instance.threads[t] = thread;
	};

	const handleSoundSetChange = (threadIndex: number, soundSet: string) => {
		const newSoundSets = [...soundSets];
		newSoundSets[threadIndex] = soundSet;
		setSoundSets(newSoundSets);

		if (tangibleInstance) {
			preloadsWithGitHub(tangibleInstance, soundSet, threadIndex);
		}
	};

	useEffect(() => {
		const loadScripts = async () => {
			try {
				const howlerScript = document.createElement("script");
				howlerScript.src = "https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js";
				document.head.appendChild(howlerScript);
				await new Promise<void>((resolve) => {
					howlerScript.onload = () => resolve();
				});

				const response = await fetch(`${GITHUB_BASE}/assets/js/tangible.js`);
				const tangibleCode = await response.text();
				const modifiedCode = tangibleCode.replace("export default class Tangible", "window.Tangible = class Tangible");
				const script = document.createElement("script");
				script.textContent = modifiedCode;
				document.head.appendChild(script);

				if (window.Tangible) {
					const instance = new window.Tangible();
					setTangibleInstance(instance);
				}

				setIsLoading(false);
			} catch (error) {
				console.error("Error loading scripts:", error);
				setIsLoading(false);
			}
		};
		loadScripts();
	}, []);

	useEffect(() => {
		if (tangibleInstance && cameraEnabled && canvasRef.current) {
			try {
				tangibleInstance.setupTangible();
			} catch (error) {
				console.error("Error setting up tangible:", error);
			}
		}
	}, [tangibleInstance, cameraEnabled]);

	useEffect(() => {
		if (tangibleInstance) {
			preloadsWithGitHub(tangibleInstance, "Numbers", 0);
			preloadsWithGitHub(tangibleInstance, "Numbers", 1);
			preloadsWithGitHub(tangibleInstance, "Numbers", 2);
		}
	}, [tangibleInstance]);

	const handleReadClick = () => {
		if (!tangibleInstance) {
			console.error("Tangible instance not initialized");
			return;
		}

		if (isReading) {
			tangibleInstance.synthesis.cancel();
			setIsReading(false);
			return;
		}

		if (tangibleInstance.isAudioPlaying()) {
			tangibleInstance.stopAllSounds();
			return;
		}

		if (cameraEnabled) {
			const scannedCode = tangibleInstance.scanCode();
			if (scannedCode) {
				setCodeText(scannedCode);
			}
		}

		if (codeText) {
			setIsReading(true);

			const utterances = codeText.toLowerCase().split("\n");
			let utteranceCount = 0;

			utterances.forEach((line, index) => {
				const utterance = new SpeechSynthesisUtterance(line);

				utterance.onend = () => {
					utteranceCount++;
					if (utteranceCount === utterances.length) {
						setIsReading(false);
					}
				};

				utterance.onerror = () => {
					utteranceCount++;
					if (utteranceCount === utterances.length) {
						setIsReading(false);
					}
				};

				tangibleInstance.synthesis.speak(utterance);
			});
		}
	};

	useEffect(() => {
		if (cameraEnabled) {
			navigator.mediaDevices
				.getUserMedia({
					video: { facingMode: "environment" },
					audio: false
				})
				.then((mediaStream) => {
					setStream(mediaStream);
					if (videoRef.current) {
						videoRef.current.srcObject = mediaStream;
					}
				})
				.catch((err) => {
					console.error("Error accessing camera:", err);
				});
		} else {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
				setStream(null);
			}
		}

		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, [cameraEnabled]);

	useEffect(() => {
		if (!cameraEnabled) return;

		const handleTouch = (e: TouchEvent) => {
			if (e.touches.length === 3) {
				e.preventDefault();
				console.log("Run button triggered by three-finger touch");
			}
		};

		document.addEventListener("touchstart", handleTouch);
		return () => {
			document.removeEventListener("touchstart", handleTouch);
		};
	}, [cameraEnabled]);

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
					>
						<i className="fa-solid fa-camera fa-2xl" aria-hidden="true"></i>
						<span>Camera</span>
					</button>
					<button
						className="header-button"
						aria-label="Run code"
					>
						<i className="fa-solid fa-play fa-2xl" aria-hidden="true"></i>
						<span>Play/Stop</span>
					</button>
					<button
						className="header-button"
						onClick={handleReadClick}
						aria-label={isReading ? "Stop reading code" : "Read out code text"}
						aria-pressed={isReading}
						disabled={isLoading || !tangibleInstance}
						style={isReading ? {
							backgroundColor: '#aac9eb',
							color: '#ffffff'
						} : undefined}
					>
						<i className="fa-brands fa-readme fa-2xl" aria-hidden="true"></i>
						<span>{isReading ? 'Stop' : 'Read'}</span>
					</button>
				</nav>
			</header>

			{cameraEnabled && (
				<section
					className="camera-section"
					role="region"
					aria-label="Camera view section"
				>
					<div style={{ position: "relative", width: "100%", height: "100%" }}>
						<video
							ref={videoRef}
							autoPlay
							playsInline
							className="camera-video"
							aria-label="Live camera feed from back camera"
						/>
						<canvas
							ref={canvasRef}
							id="video-canvas"
							aria-label="Code tile detection overlay showing detected code tiles"
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								pointerEvents: 'none'
							}}
						/>
					</div>
				</section>
			)}

			<section
				className={`output-section ${cameraEnabled ? "camera-active" : ""}`}
				role="region"
				aria-label="Code output and thread selection"
			>
				<div className="textbox-container">
					<textarea
						value={codeText}
						onChange={(e) => setCodeText(e.target.value)}
						className="output-textbox"
						placeholder={`thread 1\nloop 3 times\nplay 2\nend loop`}
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