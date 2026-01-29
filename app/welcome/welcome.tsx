// ./app/welcome/welcome.tsx

import { useState, useRef, useEffect } from 'react';
import "app/home.css"

export default function Home() {
	const [cameraEnabled, setCameraEnabled] = useState(false);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	const toggleCamera = () => {
		setCameraEnabled(!cameraEnabled);
	};

	useEffect(() => {
		if (cameraEnabled) {
			navigator.mediaDevices
				.getUserMedia({
					video: { facingMode: 'environment' },
					audio: false
				})
				.then((mediaStream) => {
					setStream(mediaStream);
					if (videoRef.current) {
						videoRef.current.srcObject = mediaStream;
					}
				})
				.catch((err) => {
					console.error('Error accessing camera:', err);
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
				console.log('Run button triggered by three-finger touch');
			}
		};

		document.addEventListener('touchstart', handleTouch);
		return () => {
			document.removeEventListener('touchstart', handleTouch);
		};
	}, [cameraEnabled]);

	return (
		<div className="app-container">
			{/* Header */}
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
						aria-label="Run operation"
					>
						<i className="fa-solid fa-play fa-2xl" aria-hidden="true"></i>
						<span>Play/Stop</span>
					</button>
					<button
						className="header-button"
						aria-label="Read content"
					>
						<i className="fa-brands fa-readme fa-2xl" aria-hidden="true"></i>
						<span>Read</span>
					</button>
				</nav>
			</header>

			{/* Camera Section */}
			{cameraEnabled && (
				<section
					className="camera-section"
					role="region"
					aria-label="Camera view"
				>
					<video
						ref={videoRef}
						autoPlay
						playsInline
						className="camera-video"
						aria-label="Live camera feed from back camera"
					/>
				</section>
			)}

			{/* Output Section */}
			<section
				className={`output-section ${cameraEnabled ? 'camera-active' : ''}`}
				role="region"
				aria-label="Output and thread selection"
			>
				<div className="textbox-container">
					<textarea
						className="output-textbox"
						placeholder="Output will appear here..."
						readOnly
						aria-label="Output text area"
					/>
				</div>
				<div className="dropdown-container">
					<div className="dropdown-group">
						<label htmlFor="thread1" className="dropdown-label">Thread 1</label>
						<select
							id="thread1"
							className="dropdown"
							aria-label="Select Thread 1 option"
						>
							<option value="">Select...</option>
							<option value="option1">Option 1</option>
						</select>
					</div>
					<div className="dropdown-group">
						<label htmlFor="thread2" className="dropdown-label">Thread 2</label>
						<select
							id="thread2"
							className="dropdown"
							aria-label="Select Thread 2 option"
						>
							<option value="">Select...</option>
							<option value="option1">Option 1</option>
						</select>
					</div>
					<div className="dropdown-group">
						<label htmlFor="thread3" className="dropdown-label">Thread 3</label>
						<select
							id="thread3"
							className="dropdown"
							aria-label="Select Thread 3 option"
						>
							<option value="">Select...</option>
							<option value="option1">Option 1</option>
						</select>
					</div>
				</div>
			</section>
		</div>
	);
}