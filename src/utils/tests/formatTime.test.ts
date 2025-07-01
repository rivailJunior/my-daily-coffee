import { formatTime } from '../formatTime';

describe('formatTime', () => {
  it('formats 0 seconds as 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats seconds less than a minute', () => {
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(59)).toBe('00:59');
  });

  it('formats exactly one minute', () => {
    expect(formatTime(60)).toBe('01:00');
  });

  it('formats minutes and seconds', () => {
    expect(formatTime(90)).toBe('01:30');
    expect(formatTime(125)).toBe('02:05');
    expect(formatTime(3599)).toBe('59:59');
  });

  it('formats large numbers of seconds', () => {
    expect(formatTime(3600)).toBe('60:00');
    expect(formatTime(3661)).toBe('61:01');
  });

  it('handles negative values (should still format, but negative minutes)', () => {
    expect(formatTime(-1)).toBe('-1:59'); // -1/60 = -1, -1%60 = 59
  });

  it('handles non-integer input by flooring (if ever used that way)', () => {
    expect(formatTime(90.7)).toBe('01:30');
  });
});
