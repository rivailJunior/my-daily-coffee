import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCountdownProps {
  initialTime: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

interface UseCountdownReturn {
  timeRemaining: number;
  isRunning: boolean;
  totalTimeElapsed: number;
  start: () => void;
  pause: () => void;
  reset: (newTime?: number) => void;
  setTime: (time: number, shouldStart?: boolean) => void;
  formatTime: (seconds: number) => string;
  setOnComplete?: (callback: () => void) => void;
}

export function useCountdown({ 
  initialTime, 
  onComplete,
  autoStart = false 
}: UseCountdownProps): UseCountdownReturn {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const onCompleteRef = useRef<(() => void) | null>(null);
  
  // Initialize the onComplete ref
  useEffect(() => {
    onCompleteRef.current = onComplete || null;
  }, [onComplete]);

  // Handle countdown logic
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (isRunning) {
      timerId = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            // Don't set isRunning to false here, let the parent component handle the completion
            onCompleteRef.current?.();
            return 0;
          }
          return newTime;
        });
        setTotalTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeRemaining, onComplete]);

  // Start the countdown
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Pause the countdown
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset the countdown to initial time
  const reset = useCallback((newTime = initialTime) => {
    setIsRunning(false);
    setTimeRemaining(newTime);
    setTotalTimeElapsed(0);
  }, [initialTime]);

  // Set a new time and optionally start the countdown
  const setTime = useCallback((newTime: number, shouldStart = false) => {
    setTimeRemaining(newTime);
    setTotalTimeElapsed(0);
    setIsRunning(shouldStart);
  }, []);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Function to update the onComplete callback
  const setOnComplete = useCallback((callback: () => void) => {
    // @ts-ignore - We're mutating the callback ref
    onCompleteRef.current = callback;
  }, []);

  return {
    timeRemaining,
    isRunning,
    totalTimeElapsed,
    start,
    pause,
    reset,
    setTime,
    formatTime,
    setOnComplete,
  };
}
