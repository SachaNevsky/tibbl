// ./app/welcome/utils/codeCleanup.ts

/**
 * Cleans and formats scanned code by removing HTML artifacts and normalizing capitalization.
 * 
 * @param scannedCode - The raw scanned code from the camera
 * @returns Cleaned and formatted code string
 */
export function cleanScannedCode(scannedCode: string): string {
    return scannedCode
        .replace(/<br\/>/g, '\n')
        .replace(/,\s*X:\[object Object\]/g, '')
        .toLowerCase()
        .replace(/(^|\n)([a-z])/g, (_, prefix, char) => prefix + char.toUpperCase())
        .replace(/x/g, 'X');
}