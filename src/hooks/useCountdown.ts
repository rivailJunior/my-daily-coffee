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
  pause: () => void;
  reset: () => void;
};

export function useCountdown({ steps }: useCountdownProps): useCountdownReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(steps?.[0]?.time || 0);
  const [isRunning, setIsRunning] = useState(false);

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

  if (!steps.length)
    return {
      currentStepIndex: 0,
      timeRemaining: 0,
      isRunning: false,
      start: () => {},
      pause: () => {},
      reset: () => {},
    };

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setCurrentStepIndex(0);
    setTimeRemaining(steps[0]?.time);
    setIsRunning(false);
  };

  return {
    currentStepIndex,
    timeRemaining,
    isRunning,
    start,
    pause,
    reset,
  };
}
