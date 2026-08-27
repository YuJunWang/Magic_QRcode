import QRCode from 'qrcode';
import type { QRMatrixData } from '../types';

/**
 * Checks if a given row and column falls inside any of the three 7x7 corner finder patterns.
 */
export function isFinderPattern(r: number, c: number, size: number): boolean {
  // Top-Left (0..6, 0..6)
  if (r < 7 && c < 7) return true;
  // Top-Right (0..6, size-7..size-1)
  if (r < 7 && c >= size - 7) return true;
  // Bottom-Left (size-7..size-1, 0..6)
  if (r >= size - 7 && c < 7) return true;
  return false;
}

/**
 * Checks if a coordinate is the center 3x3 anchor of one of the 3 finder patterns.
 */
export function isFinderCenter(r: number, c: number, size: number): boolean {
  // Top-Left center (2..4, 2..4)
  if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
  // Top-Right center (2..4, size-5..size-3)
  if (r >= 2 && r <= 4 && c >= size - 5 && c <= size - 3) return true;
  // Bottom-Left center (size-5..size-3, 2..4)
  if (r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4) return true;
  return false;
}

/**
 * Generates a structured QRMatrixData from any text with Level H error correction (30% redundancy).
 */
export function generateQRMatrix(text: string): QRMatrixData {
  const safeText = text.trim() || 'https://github.com';
  
  // Generate QR code with High error correction level for maximum 3D tolerance
  const qr = QRCode.create(safeText, {
    errorCorrectionLevel: 'H',
  });

  const size = qr.modules.size;
  const matrix: boolean[][] = [];
  let darkCount = 0;

  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      // modules.get(r, c) returns true/1 for dark module
      const isDark = Boolean(qr.modules.get(r, c));
      row.push(isDark);
      if (isDark) darkCount++;
    }
    matrix.push(row);
  }

  return {
    size,
    matrix,
    darkCount,
    isFinderPattern: (r: number, c: number) => isFinderPattern(r, c, size),
    isFinderCenter: (r: number, c: number) => isFinderCenter(r, c, size),
  };
}
