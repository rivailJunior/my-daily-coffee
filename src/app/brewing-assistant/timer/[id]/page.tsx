"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getRecipeById } from '@/services/brewing-assistant-service';
import { getManualBrewerById } from '@/services/manual-brewing-service';
import { getGrinderById } from '@/services/grinder-service';
import { BrewingRecipe } from '@/types/brewingAssistant';
import { useCountdown } from '@/hooks/useCountdown';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  AlertCircle,
  CheckCircle,
  Coffee,
  Droplet,
  FastForward,
  GlassWater,
  Pause,
  Play,
  PoundSterling,
  RotateCcw,
  Timer,
  X,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Container } from '@/components/container';
import { Countdown } from '@/components/countdown';

interface TimerPageProps {
  params: {
    id: string;
  };
}

export default function TimerPage({ params }: TimerPageProps) {
  const router = useRouter();
  const { id } = params;
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [isRecipeDetailsOpen, setIsRecipeDetailsOpen] = useState(true);

  // Load recipe data
  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery<BrewingRecipe | undefined, Error>({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id),
    enabled: !!id,
  });

  const {
    currentStepIndex,
    timeRemaining,
    isRunning: isTimerRunning,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
  } = useCountdown({
    steps: recipe?.steps || [],
  });

  // Load brewer and grinder data
  const { data: brewer } = useQuery({
    queryKey: ['brewer', recipe?.brewerId],
    queryFn: () => getManualBrewerById(recipe?.brewerId || ''),
    enabled: !!recipe?.brewerId,
  });

  const { data: grinder } = useQuery({
    queryKey: ['grinder', recipe?.grinderId],
    queryFn: () => getGrinderById(recipe?.grinderId || ''),
    enabled: !!recipe?.grinderId,
  });

  // Update total time elapsed when timer is running
  useEffect(() => {
    if (isTimerRunning) {
      const timer = setInterval(() => {
        setTotalTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTimerRunning]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (!recipe?.steps[currentStepIndex]?.time) return 0;
    const currentStepTime = recipe.steps[currentStepIndex].time;
    return ((currentStepTime - timeRemaining) / currentStepTime) * 100;
  };

  // Calculate total progress percentage
  const calculateTotalProgress = (): number => {
    if (!recipe || recipe.totalTime === 0) return 0;
    return (totalTimeElapsed / recipe.totalTime) * 100;
  };

  // Toggle timer
  const toggleTimer = useCallback(() => {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      startTimer();
      // Close recipe details when timer starts
      setIsRecipeDetailsOpen(false);
    }
  }, [isTimerRunning, startTimer, pauseTimer]);

  // Reset timer
  const handleResetTimer = useCallback(() => {
    resetTimer();
    setTotalTimeElapsed(0);

    // Reset to first step if recipe exists
    if (recipe?.steps?.length) {
      // Force re-render with initial values
      const firstStepTime = recipe.steps[0].time;
      resetTimer();
    }
  }, [resetTimer, recipe]);

  // Go back to form
  const goBack = () => {
    router.push('/brewing-assistant');
  };

  // Get current step
  const currentStep = recipe?.steps[currentStepIndex] || null;

  if (isLoading) {
    return (
      <Container>
        <p className='text-lg sm:text-xl'>Loading recipe...</p>
      </Container>
    );
  }

  if (error || !recipe) {
    return (
      <Container>
        <AlertCircle className='h-12 w-12 sm:h-16 sm:w-16 text-red-500 mb-4' />
        <p className='text-lg sm:text-xl mb-4'>Error loading recipe</p>
        <Button onClick={goBack}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container>
      <div className='flex flex-row justify-between items-center mb-6'>
        <div className='text-xl sm:text-2xl font-bold text-coffee-navy dark:text-coffee-coral '>
          Brewing Timer
        </div>
        <Button
          variant='outline'
          onClick={goBack}
          className='bg-coffee-coral text-white dark:bg-coffee-navy-dark'
        >
          Back to Recipe Form
        </Button>
      </div>

      <div className='flex justify-center flex-col gap-4'>
        {/* Recipe Information */}
        <Collapsible
          open={isRecipeDetailsOpen}
          onOpenChange={setIsRecipeDetailsOpen}
          className='w-full'
        >
          <Card className='w-full bg-white dark:bg-coffee-navy-dark'>
            <CollapsibleTrigger asChild className='mb-2'>
              <CardHeader className='flex flex-row items-center justify-between cursor-pointer rounded-t-lg transition-colors'>
                <CardTitle className='flex items-center capitalize'>
                  {recipe.name}
                </CardTitle>
                <div className='text-gray-500'>
                  {isTimerRunning ? (
                    <Pause className='h-4 w-4' />
                  ) : (
                    <Play className='h-4 w-4' />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className='gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
                <div className='flex flex-col'>
                  <div className='font-thin text-xs text-gray-500'>Method</div>
                  <div className='text-sm sm:text-base'>
                    {brewer?.name} {brewer?.brand}
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div className='font-thin text-xs text-gray-500'>Grinder</div>
                  <div className='text-sm sm:text-base'>{grinder?.name}</div>
                </div>
                <div className='flex flex-col'>
                  <div className='font-thin text-xs text-gray-500'>
                    Grind Size
                  </div>
                  <div className='text-sm sm:text-base'>
                    {recipe.grindSize} microns
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div className='font-thin text-xs text-gray-500'>Beans</div>
                  <div className='text-sm sm:text-base'>{recipe.beanName}</div>
                </div>
                <div className='flex flex-col'>
                  <div className='font-thin text-xs text-gray-500'>Coffee</div>
                  <div className='text-sm sm:text-base'>
                    {recipe.coffeeAmount}g
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div className='font-thin text-xs text-gray-500'>Water</div>
                  <div className='text-sm sm:text-base'>
                    {recipe.waterAmount}ml
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div className='font-thin text-xs text-gray-500'>
                    Temperature
                  </div>
                  <div className='text-sm sm:text-base'>
                    {recipe.waterTemperature}°C
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Timer Display */}

        <Card className='w-full bg-white dark:bg-coffee-navy-dark'>
          <CardHeader>
            <div className='flex justify-between items-center'>
              <CardTitle>Brewing Timer</CardTitle>
              <div className='text-xs sm:text-sm text-gray-500'>
                Step {currentStepIndex + 1} of {recipe.steps.length}
              </div>
            </div>
            <CardDescription>
              Total Time: {formatTime(recipe.totalTime)} • Elapsed:{' '}
              {formatTime(totalTimeElapsed)}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Progress information */}
            <div className='flex justify-between text-xs sm:text-sm px-1 mb-2'>
              <span>
                Step {currentStepIndex + 1} of {recipe.steps.length}
              </span>
              <span>
                Total Progress: {Math.round(calculateTotalProgress())}%
              </span>
            </div>

            {/* Current Step */}
            {currentStep &&
              !(
                currentStepIndex === recipe.steps.length - 1 &&
                timeRemaining === 0
              ) && (
                <div>
                  <div className='flex flex-row items-start gap-5'>
                    <div className='flex items-center justify-center'>
                      {currentStep.isPouring ? (
                        <Droplet className='text-coffee-navy dark:text-white' />
                      ) : currentStep.isStirring ? (
                        <RotateCcw className='text-coffee-coral dark:text-amber-400' />
                      ) : currentStep.isWaiting ? (
                        <Timer className='text-coffee-navy dark:text-white' />
                      ) : (
                        <Coffee className='text-coffee-coral dark:text-coffee-coral' />
                      )}
                    </div>
                    <div className='text-sm sm:text-base font-regular flex justify-center flex-row'>
                      {currentStep.description}
                    </div>
                  </div>

                  {/* Circular Timer Display */}
                  <div className='flex flex-col items-center justify-center mb-6 mt-6'>
                    <div className='relative w-36 h-36 sm:w-48 sm:h-48 mb-2'>
                      {/* Time display in center */}
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='text-2xl sm:text-3xl md:text-5xl font-bold font-mono'>
                          {/* {formatTime(timeRemaining)} */}
                          <Countdown seconds={timeRemaining} />
                        </div>
                      </div>
                    </div>

                    <div className='text-xs sm:text-sm text-gray-500'>
                      {Math.round(calculateProgress())}% complete
                    </div>
                  </div>

                  <div className='flex flex-wrap justify-center gap-4'>
                    <Button
                      variant={isTimerRunning ? 'outline' : 'default'}
                      size='lg'
                      className='w-full sm:w-auto'
                      onClick={toggleTimer}
                    >
                      {isTimerRunning ? (
                        <>
                          <Pause className='mr-2 h-5 w-5' /> Pause
                        </>
                      ) : (
                        <>
                          <Play className='mr-2 h-5 w-5' />{' '}
                          {totalTimeElapsed > 0 ? 'Resume' : 'Start'}
                        </>
                      )}
                    </Button>

                    <Button
                      variant='outline'
                      size='lg'
                      className='w-full sm:w-auto'
                      onClick={resetTimer}
                    >
                      <RotateCcw className='mr-2 h-5 w-5' /> Reset
                    </Button>
                  </div>
                </div>
              )}

            {/* Next Step Preview */}
            {recipe.steps[currentStepIndex + 1] && (
              <div className='flex flex-row items-center gap-2 text-xs sm:text-sm'>
                <div>
                  <FastForward className='text-coffee-navy dark:text-white' />
                </div>
                <div className='font-medium'>
                  Next Step: {recipe.steps[currentStepIndex + 1].name}
                </div>
              </div>
            )}

            {/* Brewing Complete */}
            {currentStepIndex === recipe.steps.length - 1 &&
              timeRemaining === 0 && (
                <div className='bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center'>
                  <CheckCircle className='h-12 w-12 mx-auto mb-2 text-green-500' />
                  <h3 className='text-lg sm:text-xl font-bold mb-2'>
                    Brewing Complete!
                  </h3>
                  <p className='text-sm sm:text-base mb-4'>
                    Your coffee is ready to enjoy.
                  </p>
                  <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                    <Button
                      onClick={resetTimer}
                      variant='outline'
                      className='w-full sm:w-auto'
                    >
                      <RotateCcw className='mr-2 h-4 w-4' /> Brew Again
                    </Button>
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
