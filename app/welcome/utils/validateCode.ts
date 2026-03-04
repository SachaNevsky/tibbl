// ./app/welcome/utils/validateCode.ts

/**
 * Validates code text to ensure proper structure and variable usage.
 * Checks for matching loop/if/function end tiles and variable initialization before use.
 * 
 * @param codeText - The code text to validate
 * @returns Object with valid flag and optional error message
 */
export function validateCode(codeText: string): { valid: boolean; error?: string } {
    const lines = codeText.split('\n').map(line => line.trim().toLowerCase());
    const stack: Array<{ type: string; index: number }> = [];
    let variableSet = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('loop')) {
            stack.push({ type: 'loop', index: i + 1 });
        }
        else if (line.startsWith('end loop') || line.startsWith('endloop')) {
            if (stack.length === 0 || stack[stack.length - 1].type !== 'loop') {
                return { valid: false, error: `Unexpected end loop tile at position ${i + 1}` };
            }
            stack.pop();
        }
        else if (line.startsWith('if')) {
            stack.push({ type: 'if', index: i + 1 });
        }
        else if (line.startsWith('end if') || line.startsWith('endif')) {
            if (stack.length === 0 || stack[stack.length - 1].type !== 'if') {
                return { valid: false, error: `Unexpected end if tile at position ${i + 1}` };
            }
            stack.pop();
        }
        else if (line.startsWith('function')) {
            stack.push({ type: 'function', index: i + 1 });
        }
        else if (line.startsWith('end function') || line.startsWith('endfunction')) {
            if (stack.length === 0 || stack[stack.length - 1].type !== 'function') {
                return { valid: false, error: `Unexpected end function tile at position ${i + 1}` };
            }
            stack.pop();
        }
        else if (line.startsWith('x =') || line.startsWith('x=')) {
            variableSet = true;
        }
        else if ((line.startsWith('play x') || line.startsWith('if x')) && !variableSet) {
            return { valid: false, error: `The variable used at position ${i + 1} has not being set.` };
        }
    }

    if (stack.length > 0) {
        const unclosed = stack[stack.length - 1];
        return {
            valid: false,
            error: `The ${unclosed.type} which starts at tile ${unclosed.index} has not been closed.`
        };
    }

    return { valid: true };
}