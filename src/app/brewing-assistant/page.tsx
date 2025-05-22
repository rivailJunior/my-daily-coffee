"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";

import { getAllManualBrewers } from "@/services/manual-brewing-service";
import { getAllGrinders } from "@/services/grinder-service";
import { createBrewingRecipe } from "@/services/brewing-assistant-service";
import { BrewingAssistantFormData, ROAST_PROFILES } from "@/types/brewingAssistant";
import { ManualBrewer } from "@/types/manualBrewing";
import { Grinder } from "@/types/grinder";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form schema validation
const formSchema = z.object({
  brewerId: z.string({
    required_error: 'Please select a brewing method',
  }),
  grinderId: z.string({
    required_error: 'Please select a grinder',
  }),
  coffeeAmount: z.coerce
    .number({
      required_error: 'Please enter coffee amount',
    })
    .min(5, {
      message: 'Coffee amount must be at least 5g',
    })
    .max(100, {
      message: 'Coffee amount must be at most 100g',
    }),
  waterAmount: z.coerce
    .number({
      required_error: 'Please enter water amount',
    })
    .min(50, {
      message: 'Water amount must be at least 50ml',
    })
    .max(1500, {
      message: 'Water amount must be at most 1500ml',
    }),
  ratioCoffee: z.coerce
    .number({
      required_error: 'Please enter coffee ratio',
    })
    .min(1, {
      message: 'Coffee ratio must be at least 1',
    })
    .max(100, {
      message: 'Coffee ratio must be at most 100',
    }),
  ratioWater: z.coerce
    .number({
      required_error: 'Please enter water ratio',
    })
    .min(1, {
      message: 'Water ratio must be at least 1',
    })
    .max(100, {
      message: 'Water ratio must be at most 100',
    }),
  beanName: z
    .string({
      required_error: 'Please enter the bean name',
    })
    .min(2, {
      message: 'Bean name must be at least 2 characters',
    }),
  roastProfile: z.enum(['light', 'medium', 'medium-dark', 'dark'], {
    required_error: 'Please select a roast profile',
  }),
});

export default function BrewingAssistantPage() {
  const router = useRouter();
  const [ratio, setRatio] = useState<number>(16); // Default coffee:water ratio
  const isUpdatingRef = useRef<boolean>(false);

  // Fetch brewing methods and grinders
  const { data: brewers = [], isLoading: isLoadingBrewers } = useQuery({
    queryKey: ['manualBrewers'],
    queryFn: () => getAllManualBrewers(),
  });

  const { data: grinders = [], isLoading: isLoadingGrinders } = useQuery({
    queryKey: ['grinders'],
    queryFn: () => getAllGrinders(),
  });

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brewerId: '',
      grinderId: '',
      coffeeAmount: 15,
      waterAmount: 240,
      ratioCoffee: 1,
      ratioWater: 16,
      beanName: '',
      roastProfile: 'medium',
    },
  });

  // Watch for changes to update ratio
  const coffeeAmount = form.watch('coffeeAmount');
  const waterAmount = form.watch('waterAmount');
  const ratioCoffee = form.watch('ratioCoffee');
  const ratioWater = form.watch('ratioWater');

  // Update ratio when coffee or water amount changes
  useEffect(() => {
    if (isUpdatingRef.current) return;

    if (coffeeAmount && waterAmount) {
      const calculatedRatio =
        Math.round((waterAmount / coffeeAmount) * 10) / 10;
      setRatio(calculatedRatio);

      // Update ratio fields without triggering the ratio change effect
      isUpdatingRef.current = true;
      form.setValue('ratioCoffee', 1);
      form.setValue('ratioWater', Math.round(calculatedRatio));
      isUpdatingRef.current = false;
    }
  }, [coffeeAmount, waterAmount, form]);

  // Update ratio when ratio inputs change
  useEffect(() => {
    if (isUpdatingRef.current) return;

    if (ratioCoffee && ratioWater) {
      const newRatio = ratioWater / ratioCoffee;
      setRatio(newRatio);

      // Update water amount based on new ratio and coffee amount
      isUpdatingRef.current = true;
      const newWaterAmount = Math.round(coffeeAmount * newRatio);
      form.setValue('waterAmount', newWaterAmount);
      isUpdatingRef.current = false;
    }
  }, [ratioCoffee, ratioWater, coffeeAmount, form]);

  // Update water amount when coffee amount changes to maintain ratio
  const updateWaterAmount = (coffee: number) => {
    isUpdatingRef.current = true;
    const water = Math.round(coffee * ratio);
    form.setValue('waterAmount', water);
    isUpdatingRef.current = false;
  };

  // Update coffee amount when water amount changes to maintain ratio
  // This function is no longer needed since water amount is now disabled
  const updateCoffeeAmount = (water: number) => {
    isUpdatingRef.current = true;
    const coffee = Math.round(water / ratio);
    form.setValue('coffeeAmount', coffee);
    isUpdatingRef.current = false;
  };

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData: BrewingAssistantFormData = {
      brewerId: values.brewerId,
      grinderId: values.grinderId,
      coffeeAmount: values.coffeeAmount,
      waterAmount: values.waterAmount,
      beanName: values.beanName,
      roastProfile: values.roastProfile as any,
    };

    const recipe = createBrewingRecipe(formData);
    
    if (recipe) {
      // Navigate to the brewing timer page with the recipe ID
      router.push(`/brewing-assistant/timer/${recipe.id}`);
    }
  };

  const isLoading = isLoadingBrewers || isLoadingGrinders;

  return (
    <div className='container mx-auto py-8 px-4'>
      <h1 className='text-2xl font-bold text-coffee-navy dark:text-coffee-coral mb-6'>
        Brewing Assistant
      </h1>

      <Card className='w-full max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle>Create Your Brewing Recipe</CardTitle>
          <CardDescription>
            Select your brewing method, grinder, and beans to get a personalized
            brewing recipe with timer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex justify-center items-center h-40'>
              <p className='text-gray-500'>Loading...</p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Brewing Method Selection */}
                  <FormField
                    control={form.control}
                    name='brewerId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brewing Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select brewing method' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {brewers.map((brewer: ManualBrewer) => (
                              <SelectItem key={brewer.id} value={brewer.id}>
                                {brewer.name} ({brewer.brand} {brewer.model})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the brewing method you'll be using
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Grinder Selection */}
                  <FormField
                    control={form.control}
                    name='grinderId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grinder</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select grinder' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grinders.map((grinder: Grinder) => (
                              <SelectItem key={grinder.id} value={grinder.id}>
                                {grinder.name} ({grinder.brand})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the grinder you'll be using
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Bean Information */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='beanName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bean Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g., Ethiopia Yirgacheffe'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the name of your coffee beans
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='roastProfile'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roast Profile</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select roast profile' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ROAST_PROFILES.map((profile) => (
                              <SelectItem
                                key={profile.value}
                                value={profile.value}
                              >
                                {profile.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the roast level of your beans
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Combined Ratio and Coffee/Water Amounts */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                  {/* Ratio Section */}
                  <div className='md:col-span-1'>
                    <FormField
                      control={form.control}
                      name='ratioCoffee'
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Ratio</FormLabel>
                          <div className='flex items-center space-x-1'>
                            <FormControl>
                              <Input
                                type='text'
                                className='text-center'
                                {...field}
                                onChange={(e) => {
                                  // Only allow numeric input
                                  const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ''
                                  );
                                  if (value !== e.target.value) {
                                    e.target.value = value;
                                  }
                                  const numValue = parseInt(value, 10);
                                  onChange(numValue || 1);
                                }}
                              />
                            </FormControl>
                            <span className='text-md font-bold'>:</span>
                            <FormField
                              control={form.control}
                              name='ratioWater'
                              render={({ field: { onChange, ...field } }) => (
                                <FormControl>
                                  <Input
                                    type='text'
                                    className='text-center'
                                    {...field}
                                    onChange={(e) => {
                                      // Only allow numeric input
                                      const value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ''
                                      );
                                      if (value !== e.target.value) {
                                        e.target.value = value;
                                      }
                                      const numValue = parseInt(value, 10);
                                      onChange(numValue || 1);
                                    }}
                                  />
                                </FormControl>
                              )}
                            />
                          </div>
                          <div className='text-xs text-gray-500 mt-1'>Coffee:Water</div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Coffee Amount */}
                  <div className='md:col-span-1'>
                    <FormField
                      control={form.control}
                      name='coffeeAmount'
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Coffee (g)</FormLabel>
                          <FormControl>
                            <Input
                              type='text'
                              {...field}
                              onChange={(e) => {
                                // Only allow numeric input
                                const value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ''
                                );
                                if (value !== e.target.value) {
                                  e.target.value = value;
                                }
                                const numValue = parseInt(value, 10);
                                onChange(numValue || 0);
                                if (!isNaN(numValue) && numValue > 0) {
                                  updateWaterAmount(numValue);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Water Amount */}
                  <div className='md:col-span-1'>
                    <FormField
                      control={form.control}
                      name='waterAmount'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Water (ml)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              {...field}
                              disabled
                              className='bg-gray-100 dark:bg-gray-800'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Current Ratio Display */}
                  <div className='md:col-span-1'>
                    <FormItem>
                      <FormLabel>Current Ratio</FormLabel>
                      <div className='bg-gray-100 dark:bg-gray-800 p-2 rounded-md w-full text-center h-[40px] flex items-center justify-center'>
                        <p className='text-sm font-medium'>1:{ratio.toFixed(1)}</p>
                      </div>
                    </FormItem>
                  </div>
                </div>

                <Button type='submit' className='w-full'>
                  Generate Recipe & Start Timer
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
