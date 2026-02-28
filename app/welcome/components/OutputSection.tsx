// ./app/welcome/components/OutputSection.tsx

import { useState } from "react";
import { ThreadDropdown } from "./ThreadDropdown";
import { CodeVisualGrid } from "./CodeVisualGrid";

interface OutputSectionProps {
    cameraEnabled: boolean;
    codeText: string;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    soundSets: string[];
    soundSetOptions: Array<{ value: string; label: string }>;
    onCodeTextChange: (text: string) => void;
    onSoundSetChange: (threadIndex: number, soundSet: string) => void;
    placeholder: string;
}

/**
 * Renders the output section with a toggle between a code textarea and a visual tile grid, along with thread sound set selectors.
 *
 * @param props - Component props
 * @param props.cameraEnabled - Whether the camera is currently enabled
 * @param props.codeText - The current code text
 * @param props.placeholder - Placeholder code shown in the textarea
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
    onSoundSetChange,
    placeholder
}: OutputSectionProps) {
    const [isVisual, setIsVisual] = useState<boolean>(false);

    const toggleViewMode = () => {
        setIsVisual(prev => !prev);
    };

    return (
        <section
            className={`output-section ${cameraEnabled ? "camera-active" : ""}`}
            role="region"
            aria-label="Code output and thread selection"
        >
            <div className="textbox-container">
                <button
                    className="view-mode-toggle"
                    onClick={toggleViewMode}
                    aria-pressed={isVisual}
                    aria-label={isVisual ? "Switch to text view" : "Switch to visual view"}
                    title={isVisual ? "Switch to text view" : "Switch to visual view"}
                >
                    <i
                        className={`fa-solid ${isVisual ? "fa-file-lines" : "fa-image"}`}
                        aria-hidden="true"
                    />
                </button>

                {isVisual ? (
                    <CodeVisualGrid codeText={codeText} />
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={codeText}
                        onChange={(e) => onCodeTextChange(e.target.value)}
                        className="output-textbox"
                        placeholder={placeholder}
                        aria-label="Code output text area"
                    />
                )}
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