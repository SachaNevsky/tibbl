// ./app/welcome/components/OutputSection.tsx

import { ThreadDropdown } from "./ThreadDropdown";

interface OutputSectionProps {
    cameraEnabled: boolean;
    codeText: string;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    soundSets: string[];
    soundSetOptions: Array<{ value: string; label: string }>;
    onCodeTextChange: (text: string) => void;
    onSoundSetChange: (threadIndex: number, soundSet: string) => void;
}

/**
 * Renders the output section with code textarea and thread sound set selectors.
 * 
 * @param props - Component props
 * @param props.cameraEnabled - Whether the camera is currently enabled
 * @param props.codeText - The current code text
 * @param props.textareaRef - Reference to the textarea element
 * @param props.soundSets - Currently selected sound sets for each thread
 * @param props.soundSetOptions - Available sound set options
 * @param props.onCodeTextChange - Handler for code text changes
 * @param props.onSoundSetChange - Handler for sound set selection changes
 */
export function OutputSection({
    cameraEnabled,
    codeText,
    textareaRef,
    soundSets,
    soundSetOptions,
    onCodeTextChange,
    onSoundSetChange
}: OutputSectionProps) {
    return (
        <section
            className={`output-section ${cameraEnabled ? "camera-active" : ""}`}
            role="region"
            aria-label="Code output and thread selection"
        >
            <div className="textbox-container">
                <textarea
                    ref={textareaRef}
                    value={codeText}
                    onChange={(e) => onCodeTextChange(e.target.value)}
                    className="output-textbox"
                    placeholder={`Thread 1\nLoop 4 times\nPlay 5\nEnd loop\nPlay 7\n\nThread 2\nDelay 4\nLoop 3 times\nPlay 8\nEnd loop`}
                    aria-label="Code output text area"
                />
            </div>
            <div className="dropdown-container">
                <ThreadDropdown
                    threadNumber={1}
                    value={soundSets[0]}
                    onChange={(value) => onSoundSetChange(0, value)}
                    soundSets={soundSetOptions}
                />
                <ThreadDropdown
                    threadNumber={2}
                    value={soundSets[1]}
                    onChange={(value) => onSoundSetChange(1, value)}
                    soundSets={soundSetOptions}
                />
                <ThreadDropdown
                    threadNumber={3}
                    value={soundSets[2]}
                    onChange={(value) => onSoundSetChange(2, value)}
                    soundSets={soundSetOptions}
                />
            </div>
        </section>
    );
}