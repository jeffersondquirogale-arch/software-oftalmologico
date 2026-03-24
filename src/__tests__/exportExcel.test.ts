import { describe, it, expect } from 'vitest';
import { exportToExcel } from '../utils/exportExcel';

describe('exportExcel', () => {
  it('exportToExcel function exists and is callable', () => {
    expect(typeof exportToExcel).toBe('function');
  });
});
