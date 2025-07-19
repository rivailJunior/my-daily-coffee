"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Grinder, GrinderFormData, GRINDER_TYPES } from "@/types/grinder";
import { createGrinder, updateGrinder } from "@/services/grinder-service";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface GrinderFormProps {
  grinder?: Grinder;
  onSuccess?: () => void;
}

export function GrinderForm({ grinder, onSuccess }: GrinderFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!grinder;

  const form = useForm<GrinderFormData>({
    defaultValues: grinder
      ? {
          name: grinder.name,
          brand: grinder.brand,
          model: grinder.model,
          type: grinder.type,
          minGrindSize: 1, // Always set to 1
          maxGrindSize: grinder.maxGrindSize,
          stepless: grinder.stepless,
          burrSize: grinder.burrSize,
          burrType: grinder.burrType,
          micronsPerClick: grinder.micronsPerClick,
          notes: grinder.notes,
        }
      : {
          name: "",
          brand: "",
          model: "",
          type: "electric" as const,
          minGrindSize: 1, // Always set to 1
          maxGrindSize: 40, // Default max value
          stepless: false,
          burrSize: undefined,
          burrType: "",
          micronsPerClick: undefined,
          notes: "",
        },
  });

  // Create mutation for adding a new grinder
  const createMutation = useMutation({
    mutationFn: async (data: GrinderFormData) => {
      // Convert the synchronous function to return a Promise
      return Promise.resolve(createGrinder(data));
    },
    onSuccess: () => {
      // Invalidate and refetch grinders list
      queryClient.invalidateQueries({ queryKey: ['grinders'] });
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/grinders");
      }
    },
    onError: (error) => {
      console.error("Error creating grinder:", error);
    }
  });

  // Update mutation for editing an existing grinder
  const updateMutation = useMutation({
    mutationFn: async (data: GrinderFormData) => {
      if (!grinder) throw new Error("No grinder to update");
      // Convert the synchronous function to return a Promise
      const result = updateGrinder(grinder.id, data);
      if (result === null) throw new Error("Failed to update grinder");
      return Promise.resolve(result);
    },
    onSuccess: () => {
      // Invalidate and refetch grinders list and the specific grinder
      queryClient.invalidateQueries({ queryKey: ['grinders'] });
      if (grinder) {
        queryClient.invalidateQueries({ queryKey: ['grinder', grinder.id] });
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/grinders");
      }
    },
    onError: (error) => {
      console.error("Error updating grinder:", error);
    }
  });

  const onSubmit = (data: GrinderFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Required Fields First */}
          <FormField
            control={form.control}
            name='name'
            rules={{ required: 'Grinder name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='My favorite grinder' {...field} />
                </FormControl>
                <FormDescription>
                  Give your grinder a name to easily identify it
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='brand'
            rules={{ required: 'Brand is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder='Baratza, Comandante, etc.' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='model'
            rules={{ required: 'Model is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder='Encore, C40, etc.' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <select
                    className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                    {...field}
                  >
                    {GRINDER_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Min Grind Size - Always 1 and disabled */}
          <FormField
            control={form.control}
            name='minGrindSize'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Grind Size</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    disabled
                    {...field}
                    value={1}
                    onChange={(e) => field.onChange(1)} // Always 1
                  />
                </FormControl>
                <FormDescription>
                  The finest setting on your grinder (always 1)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Max Grind Size - Text field that only accepts numbers */}
          <FormField
            control={form.control}
            name='maxGrindSize'
            rules={{ required: 'Maximum grind size is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Grind Size</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='40'
                    {...field}
                    value={field.value.toString()}
                    onChange={(e) => {
                      // Only allow numeric input
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      field.onChange(value ? parseInt(value, 10) : 0);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The coarsest setting on your grinder
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='stepless'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <FormControl>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      // If switching to stepless, clear the micronsPerClick value
                      if (e.target.checked) {
                        form.setValue('micronsPerClick', undefined);
                      }
                    }}
                    className='h-4 w-4 rounded border-gray-300 text-coffee-coral focus:ring-coffee-coral'
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Stepless Adjustment</FormLabel>
                  <FormDescription>
                    Can be adjusted to any position between min and max
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Optional Fields Last */}
          <FormField
            control={form.control}
            name='burrSize'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Burr Size (mm)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='38'
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='burrType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Burr Type</FormLabel>
                <FormControl>
                  <Input placeholder='Flat, Conical, etc.' {...field} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Only show microns per click field if the grinder is not stepless */}
          {!form.watch('stepless') && (
            <FormField
              control={form.control}
              name='micronsPerClick'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Microns per Click</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='25'
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    How many microns of adjustment each click provides
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <textarea
                  className='flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                  placeholder='Any additional notes about this grinder...'
                  {...field}
                />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='destructive'
            onClick={() => router.push('/grinders')}
          >
            Cancel
          </Button>
          <Button
            variant='default'
            type='submit'
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Saving...'
              : isEditing
              ? 'Update Grinder'
              : 'Add Grinder'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
