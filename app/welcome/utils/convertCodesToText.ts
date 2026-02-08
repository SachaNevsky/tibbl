// ./app/welcome/utils/convertCodesToText.ts

import type { TopCode } from "../types";

/**
 * Utility functions for converting topcodes to text.
 * Source: https://github.com/armbennett/tangible-11ty/blob/main/tangible.js
 */

/**
 * Decode the dial angle of a topcode to a number between 1 and 8.
 * 
 * @param angle - The angle value from the topcode (in radians)
 * @returns String representation of the dial value (1-8)
 */
function decodeDial(angle: number): string {
    if (angle < 0.43) {
        return "5";
    } else if (angle < 1.4) {
        return "4";
    } else if (angle < 1.98) {
        return "3";
    } else if (angle < 2.85) {
        return "2";
    } else if (angle < 3.62) {
        return "1";
    } else if (angle < 4.30) {
        return "8";
    } else if (angle < 5.07) {
        return "7";
    } else {
        return "6";
    }
}

/**
 * Convert an array of topcodes to their text representation.
 * Handles special cases for dial-based codes (LOOP, PLAY, DELAY, IF, VARIABLE) that require extracting values from the topcode's angle property.
 * 
 * @param topcodes - Array of topcodes to convert
 * @param codeLibrary - Mapping of topcode numbers to their base text representations
 * @param commands - Command constants from the Tangible instance
 * @returns Multi-line string representation of the code
 */
export function convertCodesToText(
    topcodes: TopCode[],
    codeLibrary: Record<number, string>,
    commands: Record<string, string>
): string {
    const lines: string[] = [];

    for (const topcode of topcodes) {
        const parsedCode = codeLibrary[topcode.code];

        if (!parsedCode) continue;

        if (parsedCode === commands.LOOP) {
            const value = decodeDial(topcode.angle);
            lines.push(`LOOP ${value} TIMES`);
        } else if (parsedCode === commands.PLAY) {
            const value = decodeDial(topcode.angle);
            lines.push(`PLAY ${value}`);
        } else if (parsedCode === commands.DELAY) {
            const value = decodeDial(topcode.angle);
            lines.push(`DELAY ${value}`);
        } else if (parsedCode === commands.IF) {
            const value = decodeDial(topcode.angle);
            lines.push(`IF X < ${value}`);
        } else if (parsedCode === commands.VARIABLE) {
            const value = decodeDial(topcode.angle);
            lines.push(`X = ${value}`);
        } else if (parsedCode === commands.ENDLOOP) {
            lines.push("END LOOP");
        } else if (parsedCode === commands.PLAYX) {
            lines.push("PLAY X");
        } else if (parsedCode === commands.THREAD1) {
            lines.push("THREAD 1");
        } else if (parsedCode === commands.THREAD2) {
            lines.push("THREAD 2");
        } else if (parsedCode === commands.THREAD3) {
            lines.push("THREAD 3");
        } else if (parsedCode === commands.FUNCTION) {
            lines.push("FUNCTION");
        } else if (parsedCode === commands.ENDFUNCTION) {
            lines.push("END FUNCTION");
        } else if (parsedCode === commands.FUNCTIONCALL) {
            lines.push("CALL FUNCTION");
        } else if (parsedCode === commands.ENDIF) {
            lines.push("END IF");
        } else if (parsedCode === commands.ELSE) {
            lines.push("ELSE");
        } else if (parsedCode === commands.RANDOM) {
            lines.push("X = RANDOM");
        } else if (parsedCode === commands.INCREMENT) {
            lines.push("X = X + 1");
        } else if (parsedCode === commands.DECREMENT) {
            lines.push("X = X - 1");
        } else {
            lines.push(parsedCode);
        }
    }

    return lines.join('\n');
}