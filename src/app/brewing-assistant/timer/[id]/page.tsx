"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getRecipeById } from '@/services/brewing-assistant-service';
import { getManualBrewerById } from '@/services/manual-brewing-service';
import { getGrinderById } from '@/services/grinder-service';
import { BrewingRecipe, BrewingStep } from '@/types/brewingAssistant';
import { useAudioNotification } from '@/components/brewing-assistant/audio-notification';

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
  ChevronDown,
  ChevronUp,
  Coffee,
  Droplet,
  FastForward,
  Pause,
  Play,
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
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [totalStepTime, setTotalStepTime] = useState(0);
  const [isRecipeDetailsOpen, setIsRecipeDetailsOpen] = useState(true);
  const { playPourSound, playStepCompleteSound, playBrewingCompleteSound } =
    useAudioNotification();

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

  // Initialize timer when recipe loads
  useEffect(() => {
    if (recipe && recipe.steps.length > 0) {
      setTotalStepTime(recipe.steps[0].time);
      setTimeRemaining(recipe.steps[0].time);
    }
  }, [recipe]);

  // Timer logic
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (isTimerRunning && timeRemaining > 0) {
      timerId = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
        setTotalTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else if (isTimerRunning && timeRemaining === 0) {
      // Current step completed
      playStepCompleteSound();

      // Move to next step if available
      if (recipe && currentStepIndex < recipe.steps.length - 1) {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        setTotalStepTime(recipe.steps[nextIndex].time);
        setTimeRemaining(recipe.steps[nextIndex].time);

        // Play pour sound if the next step is a pouring step
        if (recipe.steps[nextIndex].isPouring) {
          playPourSound();
        }
      } else {
        // Brewing complete
        setIsTimerRunning(false);
        playBrewingCompleteSound();
      }
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [
    isTimerRunning,
    timeRemaining,
    currentStepIndex,
    recipe,
    playStepCompleteSound,
    playPourSound,
    playBrewingCompleteSound,
  ]);

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
    if (totalStepTime === 0) return 0;
    return ((totalStepTime - timeRemaining) / totalStepTime) * 100;
  };

  // Calculate total progress percentage
  const calculateTotalProgress = (): number => {
    if (!recipe || recipe.totalTime === 0) return 0;
    return (totalTimeElapsed / recipe.totalTime) * 100;
  };

  // Toggle timer
  const toggleTimer = useCallback(() => {
    const newIsRunning = !isTimerRunning;
    setIsTimerRunning(newIsRunning);

    // Close recipe details when timer starts
    if (newIsRunning) {
      setIsRecipeDetailsOpen(false);
    }

    // Play sound when starting a pouring step
    if (!isTimerRunning && recipe?.steps[currentStepIndex].isPouring) {
      playPourSound();
    }
  }, [isTimerRunning, recipe?.steps, currentStepIndex, playPourSound]);

  // Reset timer
  const resetTimer = () => {
    setIsTimerRunning(false);
    setCurrentStepIndex(0);
    if (recipe && recipe.steps.length > 0) {
      setTotalStepTime(recipe.steps[0].time);
      setTimeRemaining(recipe.steps[0].time);
    }
    setTotalTimeElapsed(0);
  };

  // Go back to form
  const goBack = () => {
    router.push('/brewing-assistant');
  };

  // Get current step
  const getCurrentStep = (): BrewingStep | null => {
    if (!recipe || !recipe.steps.length) return null;
    return recipe.steps[currentStepIndex];
  };

  const currentStep = getCurrentStep();

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
      <h1 className='text-xl sm:text-2xl font-bold text-coffee-navy dark:text-coffee-coral mb-6 '>
        Brewing Timer
      </h1>

      <div className='flex justify-center flex-col gap-4'>
        {/* Recipe Information */}
        <Collapsible
          open={isRecipeDetailsOpen}
          onOpenChange={setIsRecipeDetailsOpen}
          className='w-full'
        >
          <Card className='w-full'>
            <CollapsibleTrigger asChild className='mb-2'>
              <CardHeader className='flex flex-row items-center justify-between cursor-pointer rounded-t-lg transition-colors'>
                <CardTitle className='flex items-center capitalize'>
                  {recipe.name}
                </CardTitle>
                <div className='text-gray-500'>
                  {isRecipeDetailsOpen ? (
                    <ChevronUp className='h-5 w-5' />
                  ) : (
                    <ChevronDown className='h-5 w-5' />
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

        <Card className='w-full'>
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
                <div
                  className={`p-4 rounded-lg transition-colors duration-300`}
                >
                  <div className='flex flex-row items-start md:items-center gap-2'>
                    {currentStep.isPouring ? (
                      <Droplet className='text-white' />
                    ) : currentStep.isStirring ? (
                      <RotateCcw className='text-amber-500' />
                    ) : currentStep.isWaiting ? (
                      <Timer className='text-gray-500' />
                    ) : (
                      <Coffee className='text-coffee-coral' />
                    )}
                    <div className='text-sm sm:text-base font-regular'>
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
              <div className='border border-gray-200 dark:border-gray-700 p-4 rounded-lg flex items-center gap-2 text-xs sm:text-sm'>
                <FastForward className='h-8 w-8' />
                {/* <Droplet className='h-20 w-20 md:h-8 md:w-8 mr-2 text-white' /> */}
                <div className='font-medium'>
                  Next: {recipe.steps[currentStepIndex + 1].name}
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
          <CardFooter>
            <Button variant='outline' onClick={goBack} className='w-full'>
              Back to Recipe Form
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
}
