import { useEffect, useState } from 'react';
import { BrewingStep } from '@/types/brewingAssistant';

type useCountdownProps = {
  steps: Pick<BrewingStep, 'time'>[];
};
type useCountdownReturn = {
  currentStepIndex: number;
  timeRemaining: number;
  isRunning: boolean;
  start: () => void;
  resume: () => void;
  pause: () => void;
  reset: () => void;
  calculateProgress: () => number;
  totalTimeElapsed: number;
};

export function useCountdown({ steps }: useCountdownProps): useCountdownReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(steps?.[0]?.time || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);

  useEffect(() => {
    if (steps?.length) {
      setCurrentStepIndex(0);
      setTimeRemaining(steps[0]?.time);
    }
  }, [steps]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (isRunning && timeRemaining > 0) {
      timerId = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeRemaining === 0) {
      // Move to next step if available
      if (currentStepIndex < steps.length - 1) {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        setTimeRemaining(steps[nextIndex].time);
      } else {
        // Brewing complete
        setIsRunning(false);
      }
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeRemaining, currentStepIndex, steps]);

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTotalTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning]);

  if (!steps.length)
    return {
      currentStepIndex: 0,
      timeRemaining: 0,
      isRunning: false,
      start: () => {},
      pause: () => {},
      reset: () => {},
      calculateProgress: () => 0,
      totalTimeElapsed: 0,
      resume: () => {},
    };

  const start = () => {
    setCurrentStepIndex(0);
    setTimeRemaining(steps[0]?.time);
    setIsRunning(true);
  };

  const resume = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setCurrentStepIndex(0);
    setTimeRemaining(steps[0]?.time);
    setTotalTimeElapsed(0);
    setIsRunning(false);
  };

  const calculateProgress = (): number => {
    if (!steps[currentStepIndex]?.time) return 0;
    const currentStepTime = steps[currentStepIndex].time;
    return ((currentStepTime - timeRemaining) / currentStepTime) * 100;
  };

  return {
    currentStepIndex,
    timeRemaining,
    isRunning,
    start,
    resume,
    pause,
    reset,
    calculateProgress,
    totalTimeElapsed,
  };
}
