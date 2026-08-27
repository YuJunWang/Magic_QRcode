import { useMemo } from 'react';
import { generateQRMatrix } from '../utils/qrHelper';
import type { QRMatrixData } from '../types';

export function useQRMatrix(text: string): QRMatrixData {
  return useMemo(() => {
    return generateQRMatrix(text);
  }, [text]);
}
