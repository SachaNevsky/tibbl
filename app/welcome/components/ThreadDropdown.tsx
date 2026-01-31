// ./app/welcome/components/ThreadDropdown.tsx

interface ThreadDropdownProps {
    threadNumber: 1 | 2 | 3;
    value: string;
    onChange: (value: string) => void;
    soundSets: Array<{ value: string; label: string }>;
}

/**
 * Renders a dropdown selector for thread sound sets.
 * 
 * @param props - Component props
 * @param props.threadNumber - The thread number (1, 2, or 3)
 * @param props.value - Currently selected sound set value
 * @param props.onChange - Handler called when selection changes
 * @param props.soundSets - Array of available sound sets
 */
export function ThreadDropdown({ threadNumber, value, onChange, soundSets }: ThreadDropdownProps) {
    const threadId = `thread${threadNumber}`;
    const threadLabel = `Thread ${threadNumber}`;

    return (
        <div className="dropdown-group">
            <label htmlFor={threadId} className="dropdown-label">
                {threadLabel}
            </label>
            <select
                id={threadId}
                className="dropdown"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label={`Select ${threadLabel} sound options`}
            >
                {soundSets.map((set) => (
                    <option key={set.value} value={set.value}>
                        {set.label}
                    </option>
                ))}
            </select>
        </div>
    );
}