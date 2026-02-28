// ./app/welcome/components/CodeVisualGrid.tsx

import { useMemo, useRef, useState, useEffect } from "react";
import { parseCodeToGrid, getTileLabel } from "../utils/parseCodeToGrid";
import { TILE_INFO } from "../utils/tileInfo";
import { GITHUB_BASE } from "../types";

const GRID_COLS = 5;
const GRID_ROWS = 5;
const GRID_GAP_PX = 4;

/**
 * The rotation degree values based on the rotation index.
 */
const DIAL_ROTATION_DEG: Record<number, number> = {
    0: 0,
    1: 45,
    2: 90,
    3: 135,
    4: 180,
    5: 225,
    6: 270,
    7: 315,
};

interface CodeVisualGridProps {
    codeText: string;
}

/**
 * Renders a 5×5 visual grid of TIBBL tiles parsed from the provided code text.
 *
 * @param props - Component props
 * @param props.codeText - The TIBBL code string to parse and visualise
 */
export function CodeVisualGrid({ codeText }: CodeVisualGridProps) {
    const { grid, error } = useMemo(() => parseCodeToGrid(codeText), [codeText]);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const [cellSize, setCellSize] = useState<number>(0);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;

            const { width, height } = entry.contentRect;
            const sizeByWidth = (width - GRID_GAP_PX * (GRID_COLS - 1)) / GRID_COLS;
            const sizeByHeight = (height - GRID_GAP_PX * (GRID_ROWS - 1)) / GRID_ROWS;
            setCellSize(Math.floor(Math.min(sizeByWidth, sizeByHeight)));
        });

        observer.observe(wrapper);
        return () => observer.disconnect();
    }, []);

    const cellStyle = cellSize > 0
        ? { width: cellSize, height: cellSize, flex: 'none' as const }
        : {};

    return (
        <div
            className="visual-grid-wrapper"
            role="region"
            aria-label="Visual representation of TIBBL code"
        >
            <div
                ref={wrapperRef}
                className="visual-grid"
                role="grid"
                aria-label="5 by 5 tile grid"
                aria-rowcount={GRID_ROWS}
                aria-colcount={GRID_COLS}
            >
                {grid.map((row, rowIdx) => (
                    <div
                        key={rowIdx}
                        className="visual-grid-row"
                        role="row"
                        aria-rowindex={rowIdx + 1}
                    >
                        {row.map((cell, colIdx) => {
                            const isRotatable = cell ? TILE_INFO[cell.type]?.rotatable : false;
                            const dialDeg = (cell && isRotatable)
                                ? DIAL_ROTATION_DEG[cell.rotation] ?? 0
                                : null;

                            return (
                                <div
                                    key={`${rowIdx}-${colIdx}`}
                                    className={`visual-grid-cell${cell ? ' visual-grid-cell--filled' : ''}`}
                                    role="gridcell"
                                    aria-colindex={colIdx + 1}
                                    aria-label={cell ? getTileLabel(cell) : 'Empty cell'}
                                    style={cellStyle}
                                >
                                    {cell && (
                                        <img
                                            src={`${GITHUB_BASE}/assets/demo-files/tiles/${cell.type}.png`}
                                            alt={getTileLabel(cell)}
                                            className="visual-grid-tile-image"
                                            style={dialDeg !== null
                                                ? { transform: `rotate(${dialDeg}deg)` }
                                                : undefined
                                            }
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            {error && (
                <div
                    className="visual-grid-error"
                    role="alert"
                    aria-live="polite"
                >
                    <span className="visual-grid-error__title">Error: </span>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}