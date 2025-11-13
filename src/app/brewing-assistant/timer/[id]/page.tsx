'use client';

import { useState, useCallback } from 'react';
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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Coffee,
  Download,
  Droplet,
  FastForward,
  Pause,
  Percent,
  Play,
  RotateCcw,
  Timer,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Container } from '@/components/container';
import { Countdown } from '@/components/countdown';

import { formatTime } from '@/utils/formatTime';

interface TimerPageProps {
  params: {
    id: string;
  };
}

export default function TimerPage({ params }: TimerPageProps) {
  const router = useRouter();
  const { id } = params;
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
    calculateProgress,
    totalTimeElapsed,
    resume,
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

  const calculateTotalProgress = (): number => {
    if (!recipe || recipe.totalTime === 0) return 0;
    const totalProgress = (totalTimeElapsed / recipe.totalTime) * 100;
    if (totalProgress > 100) return 100;
    return totalProgress;
  };

  // Toggle timer
  const toggleTimer = useCallback(() => {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      if (totalTimeElapsed > 0) {
        resume();
      } else {
        startTimer();
      }
      // Close recipe details when timer starts
      setIsRecipeDetailsOpen(false);
    }
  }, [isTimerRunning, startTimer, pauseTimer, resume, totalTimeElapsed]);

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
        <Button variant='outline' onClick={goBack}>
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
              <CardHeader className='flex flex-row items-center justify-between cursor-pointer rounded-t-lg transition-colors dark:bg-gray-600 bg-gray-200 mb-4 shadow-md dark:shadow-md'>
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
                {/* <div className='flex flex-col '>
                  <div className='font-thin text-xs text-gray-500'>Method</div>
                  <div className='text-sm sm:text-base'>
                    {brewer?.name} {brewer?.brand}
                  </div>
                </div> */}
                <div className='flex flex-col '>
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
                  <div className='text-sm sm:text-base capitalize'>
                    {recipe.beanName}
                  </div>
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
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          {/* Total Time Card */}
          <Card className='dark:bg-coffee-navy-dark'>
            <CardHeader className='pb-2'>
              <div className='flex items-center gap-2 text-sm font-medium text-gray-500'>
                <Clock className='h-4 w-4' />
                Total Time
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatTime(recipe.totalTime)}
              </div>
            </CardContent>
          </Card>

          {/* Elapsed Time Card */}
          <Card className='dark:bg-coffee-navy-dark'>
            <CardHeader className='pb-2'>
              <div className='flex items-center gap-2 text-sm font-medium text-gray-500'>
                <Timer className='h-4 w-4' />
                Elapsed Time
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatTime(totalTimeElapsed)}
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className='dark:bg-coffee-navy-dark'>
            <CardHeader className='pb-2'>
              <div className='flex items-center gap-2 text-sm font-medium text-gray-500'>
                <Percent className='h-4 w-4' />
                Total Progress
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {Math.round(calculateTotalProgress())}%
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2'>
                <div
                  className='bg-coffee-coral h-2.5 rounded-full'
                  style={{ width: `${calculateTotalProgress()}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          {/* Current Step Card */}
          {currentStep &&
            !(
              currentStepIndex === recipe.steps.length - 1 &&
              timeRemaining === 0
            ) && (
              <Card className='mb-6 dark:bg-coffee-navy-dark'>
                <CardHeader className=''>
                  <div className='flex items-center gap-2'>
                    {currentStep.isPouring ? (
                      <Droplet className='h-5 w-5' />
                    ) : currentStep.isStirring ? (
                      <RotateCcw className='h-5 w-5' />
                    ) : currentStep.isWaiting ? (
                      <Timer className='h-5 w-5 ' />
                    ) : (
                      <Coffee className='h-5 w-5 ' />
                    )}
                    <CardTitle>
                      Step{' '}
                      <span className='font-thin'>
                        {currentStepIndex + 1}/{recipe.steps.length}
                      </span>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-gray-500 dark:text-gray-400'>
                    Add {currentStep.waterAmount} ml of water
                  </div>
                  <div className='text-xl font-semibold mb-2'>
                    {currentStep.description}
                  </div>
                  {/* <div className='flex gap-2 flex-col'>
                      <div className='flex items-center gap-2 text-md'>
                        <FastForward className='h-5 w-5' />
                        Next Step
                      </div>
                      <div className='text-md'>
                        {recipe.steps[currentStepIndex + 1].description}
                      </div>
                    </div> */}
                </CardContent>
              </Card>
            )}

          {/* Timer Card */}
          {currentStep &&
            !(
              currentStepIndex === recipe.steps.length - 1 &&
              timeRemaining === 0
            ) && (
              <Card className='mb-6 dark:bg-coffee-navy-dark'>
                <CardHeader>
                  <CardTitle>Timer</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col items-center'>
                  <div className='relative w-48 h-48 mb-4'>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-4xl md:text-5xl font-bold font-mono'>
                        <Countdown
                          seconds={timeRemaining}
                          formattedTime={formatTime(timeRemaining)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='text-gray-500 mb-4'>
                    {Math.round(calculateProgress())}% complete
                  </div>
                  <div className='flex gap-4'>
                    <Button
                      variant={isTimerRunning ? 'outline' : 'default'}
                      size='lg'
                      onClick={toggleTimer}
                    >
                      {isTimerRunning ? (
                        <Pause className='mr-2 h-5 w-5' />
                      ) : (
                        <Play className='mr-2 h-5 w-5' />
                      )}
                      {isTimerRunning
                        ? 'Pause'
                        : totalTimeElapsed > 0
                        ? 'Resume'
                        : 'Start'}
                    </Button>
                    <Button variant='outline' size='lg' onClick={resetTimer}>
                      <RotateCcw className='mr-2 h-5 w-5' />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        {/* Brewing Complete Card */}
        {currentStepIndex === recipe.steps.length - 1 &&
          timeRemaining === 0 && (
            <Card className='border-green-500/30'>
              <CardHeader className='text-center'>
                <CheckCircle className='h-12 w-12 mx-auto mb-4 text-green-500' />
                <CardTitle className='text-2xl'>Brewing Complete!</CardTitle>
                <CardDescription>
                  Your coffee is ready to enjoy.
                </CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col sm:flex-row gap-3 justify-center'>
                <Button
                  onClick={resetTimer}
                  variant='default'
                  className='w-full sm:w-auto'
                >
                  <RotateCcw className='mr-2 h-4 w-4' /> Brew Again
                </Button>
                <Button
                  onClick={() =>
                    router.push(`/brewing-assistant/recipes/${recipe.id}`)
                  }
                  variant='outline'
                  className='w-full sm:w-auto'
                >
                  <Download className='mr-2 h-4 w-4' /> Download Recipe
                </Button>
              </CardContent>
            </Card>
          )}
      </div>
    </Container>
  );
}
