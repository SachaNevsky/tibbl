// ./app/welcome/components/CameraSection.tsx

interface CameraSectionProps {
    cameraEnabled: boolean;
    rotation: number;
    readingOrderRotation: number;
    onRotate: (e: { stopPropagation: () => void; }) => void;
    onReadingOrderRotate: (e: { stopPropagation: () => void; }) => void;
}

/**
 * Renders the camera section with video canvas for code tile detection.
 * 
 * @param props - Component props
 * @param props.cameraEnabled - Whether the camera is currently enabled
 * @param props.rotation - Current canvas rotation in degrees
 * @param props.readingOrderRotation - Current reading order rotation in degrees
 * @param props.onRotate - Handler for rotating the canvas
 * @param props.onReadingOrderRotate - Handler for rotating the reading order
 */
export function CameraSection({ cameraEnabled, rotation, readingOrderRotation, onRotate, onReadingOrderRotate }: CameraSectionProps) {
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
                        <button
                            className="reading-order-button"
                            onClick={onReadingOrderRotate}
                            aria-label={`Rotate reading order 90 degrees clockwise (currently ${readingOrderRotation} degrees)`}
                            type="button"
                        >
                            <i className="fa-solid fa-rotate-right" aria-hidden="true"></i>
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