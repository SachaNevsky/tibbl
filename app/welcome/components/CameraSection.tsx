// ./app/welcome/components/CameraSection.tsx

interface CameraSectionProps {
    cameraEnabled: boolean;
    rotation: number;
    onRotate: () => void;
}

/**
 * Renders the camera section with video canvas for code tile detection.
 * Shows canvas when camera is enabled, hides it otherwise.
 * Includes a rotation button to rotate the entire canvas element 90 degrees clockwise via CSS.
 * 
 * @param props - Component props
 * @param props.cameraEnabled - Whether the camera is currently enabled
 * @param props.rotation - Current canvas rotation in degrees
 * @param props.onRotate - Handler for rotating the canvas
 */
export function CameraSection({ cameraEnabled, rotation, onRotate }: CameraSectionProps) {
    const isRotatedSideways = rotation === 90 || rotation === 270;

    return (
        <>
            {cameraEnabled && (
                <section className="camera-section" role="region" aria-label="Camera view">
                    <div className="video-container">
                        <canvas
                            id="video-canvas"
                            width="640"
                            height="480"
                            aria-label="Camera view and code tile detection overlay"
                            className={isRotatedSideways ? 'rotated-sideways' : ''}
                            style={{ transform: `rotate(${rotation}deg)` }}
                        />
                        <button
                            className="rotate-button"
                            onClick={onRotate}
                            aria-label={`Rotate camera view 90 degrees clockwise (currently ${rotation} degrees)`}
                            type="button"
                        >
                            <i className="fa-solid fa-camera-rotate" aria-hidden="true"></i>
                        </button>
                    </div>
                </section>
            )}

            {!cameraEnabled && (
                <canvas id="video-canvas" width="640" height="480" style={{ display: 'none' }} />
            )}
        </>
    );
}