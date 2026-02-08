// ./app/welcome/utils/rotationLogic.ts

import type { TopCode } from "../types";

/**
 * Comparator function to sort topcodes by position.
 * Sorts by y-coordinate ascending, then by x-coordinate descending (since video is mirrored).
 * Topcodes within 40 pixels vertically are considered to be on the same line.
 * 
 * This matches the sortTopCodeComparator function in tangible.js (lines 232-249).
 * 
 * @param a - First topcode to compare
 * @param b - Second topcode to compare
 * @returns Negative if a comes before b, positive if a comes after b, 0 if equal
 */
function sortTopCodeComparator(a: TopCode, b: TopCode): number {
    if (Math.abs(a.y - b.y) <= 40) {
        if (a.x == b.x) {
            return 0;
        }
        if (a.x < b.x) {
            return 1;
        }
        return -1;
    }
    if (a.y < b.y) {
        return -1;
    }
    return 1;
}

/**
 * Sort topcodes into a 2D grid based on their spatial coordinates.
 * Groups topcodes into rows where topcodes within 40 pixels vertically are on the same row.
 * Within each row, topcodes are sorted by x-coordinate descending (mirrored video).
 * 
 * This matches the sortTopCodesIntoGrid function in tangible.js (lines 201-223).
 * 
 * @param topCodes - Array of topcodes to organize into a grid
 * @returns 2D array where each inner array represents a row of topcodes
 */
function sortTopCodesIntoGrid(topCodes: Array<TopCode>): Array<Array<TopCode>> {
    topCodes.sort(sortTopCodeComparator);
    let grid: Array<Array<TopCode>> = [];
    let line = Array();
    let currentY = -1;

    for (let i = 0; i < topCodes.length; i++) {
        if (currentY >= 0 && topCodes[i].y - currentY >= 40) {
            grid.push(line);
            line = Array();
            currentY = topCodes[i].y;
        } else if (currentY < 0) {
            currentY = topCodes[i].y;
        }
        line.push(topCodes[i]);
    }
    grid.push(line);
    return grid;
}

/**
 * Reorder topcodes from a grid based on the specified reading order rotation.
 * Flattens the 2D grid into a 1D array following the reading direction.
 * 
 * @param grid - 2D array of topcodes organized by spatial position
 * @param rotation - Rotation angle in degrees (0, 90, 180, or 270)
 * @returns Flattened array of topcodes in the specified reading order
 */
function reorderTopCodesForReading(grid: Array<Array<TopCode>>, rotation: 0 | 90 | 180 | 270): Array<TopCode> {
    const flatList: Array<TopCode> = [];

    switch (rotation) {
        case 0: // top-left to bottom-right
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid[i].length; j++) {
                    flatList.push(grid[i][j]);
                }
            }
            break;

        case 90: // top-right to bottom-left
            const maxCols90 = Math.max(...grid.map(row => row.length));
            for (let col = maxCols90 - 1; col >= 0; col--) {
                for (let row = 0; row < grid.length; row++) {
                    if (col < grid[row].length) {
                        flatList.push(grid[row][col]);
                    }
                }
            }
            break;

        case 180: // bottom-right to top-left
            for (let i = grid.length - 1; i >= 0; i--) {
                for (let j = grid[i].length - 1; j >= 0; j--) {
                    flatList.push(grid[i][j]);
                }
            }
            break;

        case 270: // bottom-left to top-right
            const maxCols270 = Math.max(...grid.map(row => row.length));
            for (let col = 0; col < maxCols270; col++) {
                for (let row = grid.length - 1; row >= 0; row--) {
                    if (col < grid[row].length) {
                        flatList.push(grid[row][col]);
                    }
                }
            }
            break;

        default:
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid[i].length; j++) {
                    flatList.push(grid[i][j]);
                }
            }
    }

    return flatList;
}

/**
 * Apply reading order rotation to an array of topcodes.
 * This is the main exported function used by both:
 * - useCameraSetup (for visual display with numbered overlays)
 * - Handler functions (for correct read/play order)
 * 
 * The function first organizes topcodes into a spatial grid, then reorders them
 * according to the specified reading direction.
 * 
 * @param topcodes - Array of topcodes to reorder
 * @param rotation - Reading order rotation angle (0, 90, 180, or 270 degrees)
 * @returns Reordered array of topcodes following the specified reading direction
 */
export function applyReadingOrderRotation(
    topcodes: TopCode[],
    rotation: 0 | 90 | 180 | 270
): TopCode[] {
    const grid = sortTopCodesIntoGrid([...topcodes]);
    return reorderTopCodesForReading(grid, rotation);
}