// ./app/welcome/utils/parseCodeToGrid.ts

const GITHUB_BASE = 'https://raw.githubusercontent.com/armbennett/tangible-11ty/main';

/** Information about a tile type, including display name, command, and rotation config. */
export interface TileInfo {
    name: string;
    command: string;
    rotatable: boolean;
    rotationValues?: string[];
}

/** Map of tile type keys to their metadata. */
export const TILE_INFO: Record<string, TileInfo> = {
    'add': { name: 'X = X + 1', command: 'x = x + 1', rotatable: false },
    'subtract': { name: 'X = X - 1', command: 'x = x - 1', rotatable: false },
    'delay': { name: 'Delay', command: 'delay', rotatable: true, rotationValues: ['1', '2', '3', '4', '5', '6', '7', '8'] },
    'else': { name: 'Else', command: 'else', rotatable: false },
    'endfunction': { name: 'End Function', command: 'end function', rotatable: false },
    'endif': { name: 'End If', command: 'end if', rotatable: false },
    'endloop': { name: 'End Loop', command: 'end loop', rotatable: false },
    'function': { name: 'Function', command: 'function', rotatable: false },
    'functioncall': { name: 'Call Function', command: 'call function', rotatable: false },
    'if': { name: 'If X <', command: 'if x <', rotatable: true, rotationValues: ['1', '2', '3', '4', '5', '6', '7', '8'] },
    'loop': { name: 'Loop', command: 'loop', rotatable: true, rotationValues: ['1', '2', '3', '4', '5', '6', '7', '8'] },
    'play': { name: 'Play', command: 'play', rotatable: true, rotationValues: ['1', '2', '3', '4', '5', '6', '7', '8'] },
    'playx': { name: 'Play X', command: 'play x', rotatable: false },
    'random': { name: 'X=Random', command: 'x = random', rotatable: false },
    'thread1': { name: 'Thread 1', command: 'thread 1', rotatable: false },
    'thread2': { name: 'Thread 2', command: 'thread 2', rotatable: false },
    'thread3': { name: 'Thread 3', command: 'thread 3', rotatable: false },
    'variable': { name: 'X =', command: 'x =', rotatable: true, rotationValues: ['1', '2', '3', '4', '5', '6', '7', '8'] }
};

/** The base URL for tile images on GitHub. */
export const TILE_IMAGE_BASE = GITHUB_BASE;

/** A single tile placed in the grid, with a type key and rotation index. */
export interface GridTile {
    type: string;
    rotation: number;
}

/** The result of parsing TIBBL code text into a grid. */
export interface ParseResult {
    success: boolean;
    grid: (GridTile | null)[][];
    error?: string;
}

/** The result of parsing a single line of TIBBL code. */
interface ParseLineResult {
    success: boolean;
    tile?: GridTile;
    error?: string;
}

/**
 * Parses a single line of TIBBL code and converts it to a grid tile.
 *
 * @param line - A lowercase string containing a single TIBBL command
 * @returns A result object containing either a tile or an error message
 */
function parseLine(line: string): ParseLineResult {
    const parts = line.split(/\s+/);

    if (parts[0] === 'thread') {
        if (parts.length < 2) {
            return { success: false, error: 'Thread command requires a thread number (1, 2, or 3)' };
        }
        const threadNum = parts[1];
        if (threadNum === '1') return { success: true, tile: { type: 'thread1', rotation: 0 } };
        if (threadNum === '2') return { success: true, tile: { type: 'thread2', rotation: 0 } };
        if (threadNum === '3') return { success: true, tile: { type: 'thread3', rotation: 0 } };
        return { success: false, error: 'Thread number must be 1, 2, or 3' };
    }

    if (parts[0] === 'loop') {
        if (parts.length < 2) {
            return { success: false, error: 'Loop command requires a number (1-8)' };
        }
        const times = parseInt(parts[1]);
        if (isNaN(times) || times < 1 || times > 8) {
            return { success: false, error: 'Loop number must be between 1 and 8' };
        }
        return { success: true, tile: { type: 'loop', rotation: times - 1 } };
    }

    if (parts[0] === 'end' && parts[1] === 'loop') {
        return { success: true, tile: { type: 'endloop', rotation: 0 } };
    }

    if (parts[0] === 'play') {
        if (parts.length < 2) {
            return { success: false, error: 'Play command requires a note number (1-8) or x' };
        }
        if (parts[1] === 'x') return { success: true, tile: { type: 'playx', rotation: 0 } };
        const note = parseInt(parts[1]);
        if (isNaN(note) || note < 1 || note > 8) {
            return { success: false, error: 'Play note must be between 1 and 8, or x' };
        }
        return { success: true, tile: { type: 'play', rotation: note - 1 } };
    }

    if (parts[0] === 'delay') {
        if (parts.length < 2) {
            return { success: false, error: 'Delay command requires a duration (1-8)' };
        }
        const duration = parseInt(parts[1]);
        if (isNaN(duration) || duration < 1 || duration > 8) {
            return { success: false, error: 'Delay duration must be between 1 and 8' };
        }
        return { success: true, tile: { type: 'delay', rotation: duration - 1 } };
    }

    if (parts[0] === 'x') {
        if (parts.length < 2 || parts[1] !== '=') {
            return { success: false, error: 'Variable command must be in format "x = ..."' };
        }
        if (parts.length >= 3 && parts[2] === 'random') {
            return { success: true, tile: { type: 'random', rotation: 0 } };
        }
        if (parts.length >= 5 && parts[2] === 'x') {
            if (parts[3] === '+' && parts[4] === '1') return { success: true, tile: { type: 'add', rotation: 0 } };
            if (parts[3] === '-' && parts[4] === '1') return { success: true, tile: { type: 'subtract', rotation: 0 } };
            return { success: false, error: 'Variable arithmetic must be "x = x + 1" or "x = x - 1"' };
        }
        if (parts.length >= 3) {
            const value = parseInt(parts[2]);
            if (isNaN(value) || value < 1 || value > 8) {
                return { success: false, error: 'Variable value must be between 1 and 8' };
            }
            return { success: true, tile: { type: 'variable', rotation: value - 1 } };
        }
        return { success: false, error: 'Invalid variable command' };
    }

    if (parts[0] === 'if') {
        if (parts.length < 4 || parts[1] !== 'x' || parts[2] !== '<') {
            return { success: false, error: 'If command must be in format "if x < number"' };
        }
        const condition = parseInt(parts[3]);
        if (isNaN(condition) || condition < 1 || condition > 8) {
            return { success: false, error: 'If condition must be between 1 and 8' };
        }
        return { success: true, tile: { type: 'if', rotation: condition - 1 } };
    }

    if (parts[0] === 'else') return { success: true, tile: { type: 'else', rotation: 0 } };

    if (parts[0] === 'end' && parts[1] === 'if') return { success: true, tile: { type: 'endif', rotation: 0 } };

    if (parts[0] === 'function') return { success: true, tile: { type: 'function', rotation: 0 } };

    if (parts[0] === 'end' && parts[1] === 'function') return { success: true, tile: { type: 'endfunction', rotation: 0 } };

    if (parts[0] === 'call' && parts[1] === 'function') return { success: true, tile: { type: 'functioncall', rotation: 0 } };

    return { success: false, error: `Unknown command: "${line}"` };
}

/**
 * Parses TIBBL code text and converts it into a 5×5 grid of tiles.
 *
 * @param codeText - Multi-line string containing TIBBL code commands
 * @returns A result object containing the 5×5 grid and success status, or an error message
 */
export function parseCodeToGrid(codeText: string): ParseResult {
    const ROWS = 5;
    const COLS = 5;
    const grid: (GridTile | null)[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

    if (!codeText.trim()) {
        return { success: true, grid };
    }

    const lines = codeText.toLowerCase().trim().split('\n').filter(line => line.trim());

    const parsedLines: { tile: GridTile | null; isThread: boolean }[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const result = parseLine(line);
        if (!result.success) {
            return { success: false, grid, error: `Line ${i + 1}: ${result.error}` };
        }

        const isThread =
            result.tile?.type === 'thread1' ||
            result.tile?.type === 'thread2' ||
            result.tile?.type === 'thread3';

        parsedLines.push({ tile: result.tile ?? null, isThread });
    }

    const totalTiles = parsedLines.filter(p => p.tile !== null).length;
    const maxGridCapacity = ROWS * COLS;

    const hasThreads = parsedLines.some(p => p.isThread);
    let useThreadRows = false;

    if (hasThreads && totalTiles <= maxGridCapacity) {
        let simRow = 0;
        let simCol = 0;

        for (const parsed of parsedLines) {
            if (!parsed.tile) continue;
            if (parsed.isThread && simCol > 0) { simRow++; simCol = 0; }
            if (simRow >= ROWS) break;
            if (simCol >= COLS) { simRow++; simCol = 0; }
            if (simRow < ROWS) simCol++;
        }

        useThreadRows = simRow < ROWS;
    }

    let row = 0;
    let col = 0;

    for (const parsed of parsedLines) {
        if (!parsed.tile) continue;

        if (useThreadRows && parsed.isThread && col > 0) {
            row++;
            col = 0;
        }

        if (row >= ROWS) {
            return { success: false, grid, error: `Code exceeds grid size (${ROWS} rows maximum)` };
        }

        if (col >= COLS) {
            row++;
            col = 0;
            if (row >= ROWS) {
                return { success: false, grid, error: `Code exceeds grid size (${ROWS} rows maximum)` };
            }
        }

        grid[row][col] = parsed.tile;
        col++;
    }

    return { success: true, grid };
}

/**
 * Generates a human-readable label for a tile to display in the UI.
 *
 * @param tile - The grid tile containing type and rotation information
 * @returns A formatted string label for the tile
 */
export function getTileLabel(tile: GridTile): string {
    const info = TILE_INFO[tile.type];
    if (!info.rotatable) return info.name;
    const value = (tile.rotation % 8) + 1;
    return `${info.name} ${value}`;
}