"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getRecipeById } from "@/services/brewing-assistant-service";
import { getManualBrewerById } from "@/services/manual-brewing-service";
import { getGrinderById } from "@/services/grinder-service";
import { BrewingRecipe, BrewingStep } from "@/types/brewingAssistant";
import { useAudioNotification } from "@/components/brewing-assistant/audio-notification";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Coffee, Droplet, Pause, Play, RotateCcw, Timer } from "lucide-react";

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
  const { playPourSound, playStepCompleteSound, playBrewingCompleteSound } = useAudioNotification();
  
  // Load recipe data
  const { data: recipe, isLoading, error } = useQuery<BrewingRecipe | undefined, Error>({
    queryKey: ["recipe", id],
    queryFn: () => getRecipeById(id),
    enabled: !!id,
  });

  // Load brewer and grinder data
  const { data: brewer } = useQuery({
    queryKey: ["brewer", recipe?.brewerId],
    queryFn: () => getManualBrewerById(recipe?.brewerId || ""),
    enabled: !!recipe?.brewerId,
  });

  const { data: grinder } = useQuery({
    queryKey: ["grinder", recipe?.grinderId],
    queryFn: () => getGrinderById(recipe?.grinderId || ""),
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
  }, [isTimerRunning, timeRemaining, currentStepIndex, recipe, playStepCompleteSound, playPourSound, playBrewingCompleteSound]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
  const toggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
    
    // Play sound when starting a pouring step
    if (!isTimerRunning && recipe?.steps[currentStepIndex].isPouring) {
      playPourSound();
    }
  };

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
    router.push("/brewing-assistant");
  };

  // Get current step
  const getCurrentStep = (): BrewingStep | null => {
    if (!recipe || !recipe.steps.length) return null;
    return recipe.steps[currentStepIndex];
  };

  const currentStep = getCurrentStep();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center h-[70vh]">
        <p className="text-xl">Loading brewing recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col justify-center items-center h-[70vh]">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-xl mb-4">Error loading brewing recipe</p>
        <Button onClick={goBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-coffee-navy dark:text-coffee-coral mb-6">
        Brewing Timer
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recipe Information */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recipe Details</CardTitle>
            <CardDescription>
              {recipe.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Brewing Method</h3>
              <p>{brewer?.name} ({brewer?.brand})</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Grinder</h3>
              <p>{grinder?.name} ({grinder?.brand})</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Beans</h3>
              <p>{recipe.beanName} <Badge>{recipe.roastProfile}</Badge></p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Coffee</h3>
                <p>{recipe.coffeeAmount}g</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Water</h3>
                <p>{recipe.waterAmount}ml</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Grind Size</h3>
                <p>{recipe.grindSize}/13</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Water Temp</h3>
                <p>{recipe.waterTemperature}°C</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timer Display */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Brewing Timer</CardTitle>
              <div className="text-sm text-gray-500">
                Step {currentStepIndex + 1} of {recipe.steps.length}
              </div>
            </div>
            <CardDescription>
              Total Time: {formatTime(recipe.totalTime)} • Elapsed: {formatTime(totalTimeElapsed)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(calculateTotalProgress())}%</span>
              </div>
              <Progress value={calculateTotalProgress()} className="h-2" />
            </div>

            {/* Current Step */}
            {currentStep && (
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {currentStep.isPouring ? (
                    <Droplet className="h-6 w-6 mr-2 text-blue-500" />
                  ) : currentStep.isStirring ? (
                    <RotateCcw className="h-6 w-6 mr-2 text-amber-500" />
                  ) : currentStep.isWaiting ? (
                    <Timer className="h-6 w-6 mr-2 text-gray-500" />
                  ) : (
                    <Coffee className="h-6 w-6 mr-2 text-coffee-coral" />
                  )}
                  <h3 className="text-xl font-bold">{currentStep.name}</h3>
                </div>
                
                <p className="mb-6 text-gray-700 dark:text-gray-300">{currentStep.description}</p>
                
                {/* Step Progress */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Step Progress</span>
                    <span>{Math.round(calculateProgress())}%</span>
                  </div>
                  <Progress value={calculateProgress()} className="h-3" />
                </div>
                
                {/* Timer Display */}
                <div className="text-center">
                  <div className="text-5xl font-bold mb-4 font-mono">
                    {formatTime(timeRemaining)}
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant={isTimerRunning ? "outline" : "default"}
                      size="lg"
                      onClick={toggleTimer}
                    >
                      {isTimerRunning ? (
                        <>
                          <Pause className="mr-2 h-5 w-5" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" /> {totalTimeElapsed > 0 ? "Resume" : "Start"}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={resetTimer}
                    >
                      <RotateCcw className="mr-2 h-5 w-5" /> Reset
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Next Step Preview */}
            {recipe.steps[currentStepIndex + 1] && (
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Next: {recipe.steps[currentStepIndex + 1].name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.steps[currentStepIndex + 1].description}
                </p>
              </div>
            )}
            
            {/* Brewing Complete */}
            {currentStepIndex === recipe.steps.length - 1 && timeRemaining === 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <h3 className="text-xl font-bold mb-2">Brewing Complete!</h3>
                <p className="mb-4">Your coffee is ready to enjoy.</p>
                <Button onClick={resetTimer} variant="outline">
                  Brew Again
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={goBack} className="w-full">
              Back to Recipe Form
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
