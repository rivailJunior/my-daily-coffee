import { renderHook, act } from '@testing-library/react-hooks';
import { useCountdown } from '../useCountdown';
import { BrewingStep } from '@/types/brewingAssistant';

describe('useCountdown', () => {
  // Mock timers
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const mockSteps: Pick<BrewingStep, 'time'>[] = [
    { time: 30 }, // 30s step
    { time: 60 }, // 60s step
    { time: 45 }, // 45s step
  ];

  it('should initialize with first step and not running', () => {
    const { result } = renderHook(() => useCountdown({ steps: mockSteps }));

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.timeRemaining).toBe(mockSteps[0].time);
    expect(result.current.isRunning).toBe(false);
  });

  it('should handle empty steps array', () => {
    const { result } = renderHook(() => useCountdown({ steps: [] }));

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.timeRemaining).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it('should start and pause the countdown', () => {
    const { result } = renderHook(() => useCountdown({ steps: mockSteps }));

    // Start the countdown
    act(() => {
      result.current.start();
    });
    expect(result.current.isRunning).toBe(true);

    // Fast-forward time by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.timeRemaining).toBe(mockSteps[0].time - 2);

    // Pause the countdown
    act(() => {
      result.current.pause();
    });
    expect(result.current.isRunning).toBe(false);

    // Time should not change when paused
    const timeBeforePause = result.current.timeRemaining;
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.timeRemaining).toBe(timeBeforePause);
  });

  it('should move to next step when current step completes', () => {
    const { result } = renderHook(() => useCountdown({ steps: mockSteps }));

    // Start the countdown
    act(() => {
      result.current.start();
    });

    // Fast-forward to complete first step
    act(() => {
      jest.advanceTimersByTime(mockSteps[0].time * 1000);
    });

    // Should be on second step with its time remaining
    expect(result.current.currentStepIndex).toBe(1);
    expect(result.current.timeRemaining).toBe(mockSteps[1].time);
    expect(result.current.isRunning).toBe(true);
  });

  it('should complete all steps and stop', () => {
    const { result } = renderHook(() => useCountdown({ steps: mockSteps }));

    // Start the countdown
    act(() => {
      result.current.start();
    });
    // Verify final state
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.timeRemaining).toBe(30);
    expect(result.current.isRunning).toBe(true);
    act(() => {
      jest.advanceTimersByTime(30 * 1000);
    });
    expect(result.current.currentStepIndex).toBe(1);
    expect(result.current.timeRemaining).toBe(60);
    expect(result.current.isRunning).toBe(true);
    act(() => {
      jest.advanceTimersByTime(60 * 1000);
    });
    expect(result.current.currentStepIndex).toBe(2);
    expect(result.current.timeRemaining).toBe(45);
    expect(result.current.isRunning).toBe(true);
    act(() => {
      jest.advanceTimersByTime(45 * 1000);
    });
    expect(result.current.currentStepIndex).toBe(2);
    expect(result.current.timeRemaining).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it('should reset the countdown', () => {
    const { result } = renderHook(() => useCountdown({ steps: mockSteps }));

    // Start and let it run for a bit
    act(() => {
      result.current.start();
      jest.advanceTimersByTime(5000);
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    // Should be back to initial state
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.timeRemaining).toBe(mockSteps[0].time);
    expect(result.current.isRunning).toBe(false);
  });

  it('should clean up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { result, unmount } = renderHook(() =>
      useCountdown({ steps: mockSteps })
    );

    // Start the countdown
    act(() => {
      result.current.start();
    });

    // Unmount component
    unmount();

    // Should have cleared the interval
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
