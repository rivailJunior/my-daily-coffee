"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ManualBrewer, 
  ManualBrewerFormData, 
  BREW_METHODS, 
  BREWER_TYPES, 
  BREWER_MATERIALS, 
  FILTER_TYPES 
} from "@/types/manualBrewing";
import { createManualBrewer, updateManualBrewer } from "@/services/manual-brewing-service";

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

interface ManualBrewerFormProps {
  brewer?: ManualBrewer;
  onSuccess?: () => void;
}

export function ManualBrewerForm({ brewer, onSuccess }: ManualBrewerFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!brewer;

  const form = useForm<ManualBrewerFormData>({
    defaultValues: brewer
      ? {
          name: brewer.name,
          brand: brewer.brand,
          model: brewer.model,
          brewMethod: brewer.brewMethod,
          type: brewer.type,
          material: brewer.material,
          filterType: brewer.filterType,
          capacity: brewer.capacity,
          recommendedGrindSize: brewer.recommendedGrindSize,
          brewTime: brewer.brewTime,
          pressure: brewer.pressure,
          notes: brewer.notes,
        }
      : {
          name: "",
          brand: "",
          model: "",
          brewMethod: "percolation" as const,
          type: "conical" as const,
          material: "ceramic" as const,
          filterType: "paper" as const,
          capacity: 400, // Default capacity in ml
          recommendedGrindSize: 7, // Medium grind size
          brewTime: {
            min: 120, // 2 minutes in seconds
            max: 240, // 4 minutes in seconds
          },
          pressure: false,
          notes: "",
        },
  });

  // Create mutation for adding a new manual brewer
  const createMutation = useMutation({
    mutationFn: async (data: ManualBrewerFormData) => {
      // Convert the synchronous function to return a Promise
      return Promise.resolve(createManualBrewer(data));
    },
    onSuccess: () => {
      // Invalidate and refetch manual brewers list
      queryClient.invalidateQueries({ queryKey: ['manualBrewers'] });
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/manual-brewing");
      }
    },
    onError: (error) => {
      console.error("Error creating manual brewer:", error);
    }
  });

  // Update mutation for editing an existing manual brewer
  const updateMutation = useMutation({
    mutationFn: async (data: ManualBrewerFormData) => {
      if (!brewer) throw new Error("No manual brewer to update");
      // Convert the synchronous function to return a Promise
      const result = updateManualBrewer(brewer.id, data);
      if (result === null) throw new Error("Failed to update manual brewer");
      return Promise.resolve(result);
    },
    onSuccess: () => {
      // Invalidate and refetch manual brewers list and the specific manual brewer
      queryClient.invalidateQueries({ queryKey: ['manualBrewers'] });
      if (brewer) {
        queryClient.invalidateQueries({ queryKey: ['manualBrewer', brewer.id] });
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/manual-brewing");
      }
    },
    onError: (error) => {
      console.error("Error updating manual brewer:", error);
    }
  });

  const onSubmit = (data: ManualBrewerFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Required Fields First */}
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Brewer name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="My V60 setup" {...field} />
                </FormControl>
                <FormDescription>
                  Give your brewing device a name to easily identify it
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            rules={{ required: "Brand is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Hario, Chemex, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            rules={{ required: "Model is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="V60 02, Classic, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brewMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brewing Method</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      // Update type based on brew method
                      const method = e.target.value as ManualBrewer['brewMethod'];
                      if (method === 'immersion') {
                        form.setValue('type', 'press');
                      } else if (method === 'percolation') {
                        form.setValue('type', 'conical');
                      }
                    }}
                  >
                    {BREW_METHODS.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormDescription>
                  The primary brewing method this device uses
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...field}
                  >
                    {BREWER_TYPES.map((type) => (
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

          <FormField
            control={form.control}
            name="material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...field}
                  >
                    {BREWER_MATERIALS.map((material) => (
                      <option key={material.value} value={material.value}>
                        {material.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="filterType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filter Type</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...field}
                  >
                    {FILTER_TYPES.map((filter) => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            rules={{ required: "Capacity is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity (ml)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="400"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                  />
                </FormControl>
                <FormDescription>
                  Maximum brewing capacity in milliliters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recommendedGrindSize"
            rules={{ required: "Recommended grind size is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recommended Grind Size</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="7"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                  />
                </FormControl>
                <FormDescription>
                  Recommended grind size (1-13, where 1 is finest and 13 is coarsest)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brewTime.min"
            rules={{ required: "Minimum brew time is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Brew Time (seconds)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="120"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                  />
                </FormControl>
                <FormDescription>
                  Minimum recommended brewing time in seconds
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brewTime.max"
            rules={{ required: "Maximum brew time is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Brew Time (seconds)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="240"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                  />
                </FormControl>
                <FormDescription>
                  Maximum recommended brewing time in seconds
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pressure"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-coffee-coral focus:ring-coffee-coral"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Uses Pressure</FormLabel>
                  <FormDescription>
                    Check if this brewing method uses pressure (e.g., AeroPress)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Any additional notes about this brewing device..."
                  {...field}
                />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/manual-brewing-methods")}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : isEditing
                ? "Update Brewer"
                : "Add Brewer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
