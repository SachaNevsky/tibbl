// ./app/welcome/utils/tileInfo.ts

import type { TileInfo } from "../types";

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