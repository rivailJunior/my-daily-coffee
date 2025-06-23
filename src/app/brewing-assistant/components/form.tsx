/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';

import { getAllManualBrewers } from '@/services/manual-brewing-service';
import { getAllGrinders } from '@/services/grinder-service';
import {
  BrewingAssistantFormData,
  ROAST_PROFILES,
  BrewingRecipe,
} from '@/types/brewingAssistant';
import { ManualBrewer } from '@/types/manualBrewing';
import { Grinder } from '@/types/grinder';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ComboBoxResponsive } from '@/components/combobox';
import { List, Loader2 } from 'lucide-react';
import { Container } from '@/components/container';
import { BrewingFormSchema, BrewAssistantProps } from '@/types/brewForm';

export function BrewingAssistantForm({
  handleFormSubmit,
  heading,
  isManualRecipe,
}: BrewAssistantProps) {
  const router = useRouter();
  const [ratio, setRatio] = useState<number>(15); // Default coffee:water ratio
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
  const form = useForm<z.infer<typeof BrewingFormSchema>>({
    resolver: zodResolver(BrewingFormSchema),
    defaultValues: {
      brewerId: '',
      grinderId: '',
      coffeeAmount: 15,
      waterAmount: 240,
      ratioCoffee: 1,
      ratioWater: 16,
      beanName: '',
      stepsAmount: 1,
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
  // Setup mutation for form submission
  const mutation = useMutation<BrewingRecipe, Error, BrewingAssistantFormData>({
    // mutationFn: createBrewingRecipe,
    mutationFn: handleFormSubmit,
    onSuccess: (recipe) => {
      // Navigate to the brewing timer page with the recipe ID
      router.push(`/brewing-assistant/timer/${recipe.id}`);
    },
    onError: (error) => {
      console.error('Error generating recipe:', error);
      // You might want to show an error toast here
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof BrewingFormSchema>) => {
    const formData: BrewingAssistantFormData = {
      brewerId: values.brewerId,
      grinderId: values.grinderId,
      coffeeAmount: values.coffeeAmount,
      waterAmount: values.waterAmount,
      beanName: values.beanName,
      roastProfile: values.roastProfile as any, // This cast should be fixed in the form schema
      steps: values?.steps || [],
    };

    mutation.mutate(formData);
  };

  const isLoading = isLoadingBrewers || isLoadingGrinders;

  return (
    <Container>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-coffee-navy dark:text-coffee-coral'>
          {heading || 'Brewing Assistant'}
        </h1>
        <div>
          <Button
            onClick={() => router.push('/brewing-assistant/recipes')}
            className='text-white'
          >
            <List />
            Recipes
          </Button>
        </div>
      </div>

      <Card className='w-full mx-auto bg-white dark:bg-coffee-navy border-coffee-navy/30 dark:border-coffee-navy'>
        <CardHeader>
          <CardTitle>Create Your Brewing Recipe</CardTitle>
          <CardDescription>
            Select your brewing method, grinder, and beans to get a personalized
            brewing recipe with timer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex justify-center items-center h-auto'>
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
                        <ComboBoxResponsive
                          label='Select brewing method'
                          items={brewers.map((brewer: ManualBrewer) => ({
                            value: brewer.id,
                            label:
                              `${brewer.name} ${brewer.brand} ${brewer.model}`.trim(),
                          }))}
                          selectedItem={
                            brewers
                              .map((brewer: ManualBrewer) => ({
                                value: brewer.id,
                                label:
                                  `${brewer.name} ${brewer.brand} ${brewer.model}`.trim(),
                              }))
                              .find((b) => b.value === field.value) || null
                          }
                          setSelectedItem={(item) =>
                            field.onChange(item ? item.value : null)
                          }
                        />
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
                        <ComboBoxResponsive
                          selectedBrewerId={field.value}
                          setSelectedBrewerId={field.onChange}
                          items={grinders.map((grinder: Grinder) => ({
                            value: grinder.id,
                            label: `${grinder.name} ${grinder.brand}`,
                          }))}
                          selectedItem={
                            field.value
                              ? {
                                  value: field.value,
                                  label: grinders.find(
                                    (g: Grinder) => g.id === field.value
                                  )
                                    ? `${
                                        grinders.find(
                                          (g: Grinder) => g.id === field.value
                                        )?.name
                                      } ${
                                        grinders.find(
                                          (g: Grinder) => g.id === field.value
                                        )?.brand
                                      }`
                                    : 'Select grinder',
                                }
                              : null
                          }
                          setSelectedItem={(item) => {
                            if (item) {
                              field.onChange(item.value);
                            } else {
                              field.onChange('');
                            }
                          }}
                          label='Select grinder'
                        />
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
                            className='bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-coffee-coral/50 dark:focus:ring-coffee-coral/70 transition-colors'
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
                        <ComboBoxResponsive
                          items={ROAST_PROFILES}
                          selectedItem={
                            ROAST_PROFILES.find(
                              (p) => p.value === field.value
                            ) || null
                          }
                          setSelectedItem={(item) =>
                            item && field.onChange(item.value)
                          }
                          label='Select roast profile'
                        />
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
                                className='text-center bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-coffee-coral/50 dark:focus:ring-coffee-coral/70 transition-colors'
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
                                    className='text-center bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-coffee-coral/50 dark:focus:ring-coffee-coral/70 transition-colors'
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
                          <div className='text-xs text-gray-500 mt-1'>
                            Coffee:Water
                          </div>
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
                              className='bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-coffee-coral/50 dark:focus:ring-coffee-coral/70 transition-colors'
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
                  {!isManualRecipe ? (
                    <div className='md:col-span-1'>
                      <FormItem>
                        <FormLabel>Current Ratio</FormLabel>
                        <div className='bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded-md w-full text-center h-[40px] flex items-center justify-center'>
                          <p className='text-sm font-medium'>
                            1:{ratio.toFixed(1)}
                          </p>
                        </div>
                      </FormItem>
                    </div>
                  ) : (
                    <div className='md:col-span-1'>
                      <FormField
                        control={form.control}
                        name='stepsAmount'
                        render={({ field }) => (
                          <FormItem className='w-full'>
                            <FormLabel>
                              Add more steps to your recipe?
                            </FormLabel>
                            <div className='flex items-center gap-3'>
                              {field?.value && field.value > 1 && (
                                <>
                                  <button
                                    type='button'
                                    className='px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition w-full'
                                    onClick={() =>
                                      field.onChange(
                                        Math.max(
                                          1,
                                          Number(field.value || 1) - 1
                                        )
                                      )
                                    }
                                  >
                                    Remove Step
                                  </button>
                                  <span className='font-semibold'>
                                    {field.value}
                                  </span>
                                </>
                              )}
                              <button
                                type='button'
                                className='px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition w-full'
                                onClick={() =>
                                  field.onChange(
                                    Math.max(1, Number(field.value || 1) + 1)
                                  )
                                }
                              >
                                Add Step
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
                {isManualRecipe && (
                  <div className='flex flex-col gap-4 border border-coffee-coral/70 p-4 rounded-md'>
                    {Array.from(
                      { length: form.watch('stepsAmount') ?? 1 },
                      (_, index) => (
                        <div key={index} className='flex flex-row gap-4 '>
                          <FormField
                            control={form.control}
                            name={`steps.${index}.time`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Step {index + 1} Time</FormLabel>
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
                                      field.onChange(numValue || 0);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`steps.${index}.description`}
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>
                                  Step {index + 1} Description
                                </FormLabel>
                                <FormControl>
                                  <Input type='text' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )
                    )}
                  </div>
                )}

                <Button
                  type='submit'
                  className='w-full text-white'
                  disabled={isLoading}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Creating your recipe...
                    </>
                  ) : (
                    'Create Recipe & Start Timer'
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
