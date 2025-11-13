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
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CircleMinus, CirclePlus, Loader2 } from 'lucide-react';
import { BrewingFormSchema, BrewAssistantProps } from '@/types/brewForm';
import { onlyNumber } from '@/utils/inputField';
import { StepButton } from './stepButton';
import { InputNumber } from './inputNumber';
import { FormContainer } from '@/components/formContainer';
import { ComboBoxResponsive } from '../combobox';

export function BrewingAssistantForm({
  handleFormSubmit,
  heading,
  isManualRecipe,
  title,
  headingDescription,
}: Readonly<BrewAssistantProps>) {
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
      grindSize: undefined,
      waterTemperature: undefined,
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
    mutationFn: handleFormSubmit,
    onSuccess: (recipe) => {
      router.push(`/brewing-assistant/timer/${recipe.id}`);
    },
    onError: (error) => {
      console.error('Error generating recipe:', error);
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
      grindSize: values?.grindSize,
      steps: values?.steps || [],
      waterTemperature: values?.waterTemperature,
    };

    mutation.mutate(formData);
  };

  const isLoading = isLoadingBrewers || isLoadingGrinders;

  return (
    <FormContainer
      heading={heading}
      href='/brewing-assistant/recipes'
      title={title}
      headingDescription={headingDescription}
    >
      {isLoading ? (
        <div className='flex justify-center items-center h-auto'>
          <p className='text-gray-500'>Loading...</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Brewing Method Selection */}
              <FormField
                control={form.control}
                name='brewerId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method</FormLabel>
                    <ComboBoxResponsive
                      label='Select method'
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
                      setSelectedItem={(item) => {
                        if (item) {
                          field.onChange(item.value);
                        } else {
                          field.onChange('');
                        }
                      }}
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
                          <InputNumber
                            field={field}
                            onChange={onChange}
                            placeholder='e.g. 93'
                          />
                        </FormControl>
                        <span className='text-md font-bold'>:</span>
                        <FormField
                          control={form.control}
                          name='ratioWater'
                          render={({ field: { onChange, ...field } }) => (
                            <FormControl>
                              <InputNumber
                                field={field}
                                onChange={onChange}
                                placeholder='e.g. 150'
                              />
                            </FormControl>
                          )}
                        />
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Bean Information */}
              <div className='md:col-span-1'>
                <FormField
                  control={form.control}
                  name='beanName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bean Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Bourbon Amarelo'
                          className='bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-coffee-coral/50 dark:focus:ring-coffee-coral/70 transition-colors'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Grind Size (only for manual recipes) */}
              {isManualRecipe ? (
                <div className='md:col-span-1'>
                  <FormField
                    control={form.control}
                    name='grindSize'
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Grind Size</FormLabel>
                        <FormControl>
                          <InputNumber
                            field={field}
                            onChange={onChange}
                            placeholder='e.g. 700'
                            disabled={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}
              {/* Coffee Amount */}
              <div className='md:col-span-1'>
                <FormField
                  control={form.control}
                  name='coffeeAmount'
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Coffee (g)</FormLabel>
                      <FormControl>
                        <InputNumber
                          field={field}
                          placeholder='e.g. 150'
                          onChange={(numValue: number) => {
                            onChange(numValue || 0);
                            if (!isNaN(numValue) && numValue > 0) {
                              updateWaterAmount(numValue);
                            }
                          }}
                        />
                      </FormControl>
                      {isManualRecipe && (
                        <div className='text-xs text-gray-400 mt-1'>
                          Total Water Amount - {form.getValues('waterAmount')}{' '}
                          ml
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!isManualRecipe ? (
                <div className='md:col-span-1'>
                  <FormItem>
                    <FormLabel>Total Water Amount</FormLabel>
                    <Input
                      type='number'
                      className='bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-coffee-coral/50 dark:focus:ring-coffee-coral/70 transition-colors'
                      value={form.getValues('waterAmount')}
                      disabled
                      aria-label='Water amount (ml)'
                    />
                  </FormItem>
                </div>
              ) : null}
              {isManualRecipe ? (
                <div className='md:col-span-1'>
                  <FormField
                    control={form.control}
                    name='waterTemperature'
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Water Temperature (°C)</FormLabel>
                        <FormControl>
                          <InputNumber
                            field={field}
                            placeholder='e.g. 93'
                            onChange={onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}
            </div>

            {isManualRecipe ? (
              <div className='flex flex-col gap-4 border border-gray-400 p-4 rounded-md'>
                {Array.from(
                  { length: form.watch('stepsAmount') ?? 1 },
                  (_, index) => (
                    <div key={index} className='flex flex-col gap-4 '>
                      <FormField
                        control={form.control}
                        name={`steps.${index}.description`}
                        render={({ field }) => (
                          <FormItem className='w-full'>
                            <FormLabel>{index + 1}. Step Description</FormLabel>
                            <FormControl>
                              <Input type='text' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='flex gap-2 justify-center items-end w-full'>
                        <FormField
                          control={form.control}
                          name={`steps.${index}.time`}
                          render={({ field }) => (
                            <FormItem className='w-full'>
                              <FormLabel>{index + 1}. Time (Seconds)</FormLabel>
                              <FormControl>
                                <Input
                                  type='text'
                                  {...field}
                                  onChange={(e) => {
                                    const numValue = onlyNumber(e.target.value);
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
                          name='stepsAmount'
                          render={({ field }) => (
                            <FormItem className='w-full'>
                              <div className='flex items-center gap-3'>
                                <StepButton
                                  icon={<CirclePlus className='h-4 w-4' />}
                                  onClick={() =>
                                    field.onChange(
                                      Math.max(1, Number(field.value || 1) + 1)
                                    )
                                  }
                                />
                                <StepButton
                                  disabled={field.value === 1}
                                  onClick={() =>
                                    field.onChange(
                                      Math.max(1, Number(field.value || 1) - 1)
                                    )
                                  }
                                  variant='destructive'
                                  icon={<CircleMinus className='h-4 w-4' />}
                                />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : null}
            <div className='grid grid-cols-1 col-span-1'>
              <FormField
                control={form.control}
                name='roastProfile'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roast Profile</FormLabel>
                    <div className='grid grid-cols-1 gap-3 mt-2 md:grid-cols-4'>
                      {ROAST_PROFILES.map((profile) => (
                        <Button
                          key={profile.value}
                          type='button'
                          variant={
                            field.value === profile.value
                              ? 'default'
                              : 'outline'
                          }
                          className={`justify-start h-auto p-4 rounded-lg ${
                            field.value === profile.value
                              ? 'bg-coffee-coral text-white border-coffee-coral hover:bg-coffee-coral/90'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => field.onChange(profile.value)}
                        >
                          <div className='flex items-center w-full'>
                            <div className='flex items-center justify-center w-5 h-5 mr-3 border rounded-full border-gray-300 dark:border-gray-600'>
                              {field.value === profile.value && (
                                <div className='w-3 h-3 rounded-full bg-white dark:bg-gray-900' />
                              )}
                            </div>
                            <span className='text-sm font-medium leading-none'>
                              {profile.label}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <FormDescription className='mt-2'>
                      Choose the roast level of your beans
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
    </FormContainer>
  );
}
