// ./app/welcome/components/CameraSection.tsx

interface CameraSectionProps {
    cameraEnabled: boolean;
}

/**
 * Renders the camera section with video canvas for code tile detection.
 * Shows canvas when camera is enabled, hides it otherwise.
 * 
 * @param props - Component props
 * @param props.cameraEnabled - Whether the camera is currently enabled
 */
export function CameraSection({ cameraEnabled }: CameraSectionProps) {
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
                        />
                    </div>
                </section>
            )}

            {!cameraEnabled && (
                <canvas id="video-canvas" width="640" height="480" style={{ display: 'none' }} />
            )}
        </>
    );
}