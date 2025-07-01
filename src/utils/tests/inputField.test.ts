import { onlyNumber } from '../inputField';

describe('onlyNumber', () => {
  it('returns the number when input is numeric only', () => {
    expect(onlyNumber('12345')).toBe(12345);
  });

  it('removes non-numeric characters and returns the number', () => {
    expect(onlyNumber('a1b2c3')).toBe(123);
    expect(onlyNumber('abc123def')).toBe(123);
    expect(onlyNumber('12-34!')).toBe(1234);
  });

  it('returns NaN when there are no numeric characters', () => {
    expect(onlyNumber('abcdef')).toBeNaN();
    expect(onlyNumber('!@#$%')).toBeNaN();
  });

  it('returns NaN for empty string', () => {
    expect(onlyNumber('')).toBeNaN();
  });

  it('handles leading zeros correctly', () => {
    expect(onlyNumber('00123')).toBe(123);
    expect(onlyNumber('0a0b1')).toBe(1);
  });

  it('removes spaces and returns the number', () => {
    expect(onlyNumber(' 1 2 3 ')).toBe(123);
    expect(onlyNumber(' 0 0 7 ')).toBe(7);
  });

  it('handles mixed input robustly', () => {
    expect(onlyNumber('abc 123 xyz 456')).toBe(123456);
    expect(onlyNumber('0xFF')).toBe(0);
  });
});
