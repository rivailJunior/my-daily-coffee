"use client";

import { useState, useEffect } from "react";
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
    required_error: "Please select a brewing method",
  }),
  grinderId: z.string({
    required_error: "Please select a grinder",
  }),
  coffeeAmount: z.coerce.number({
    required_error: "Please enter coffee amount",
  }).min(5, {
    message: "Coffee amount must be at least 5g",
  }).max(100, {
    message: "Coffee amount must be at most 100g",
  }),
  waterAmount: z.coerce.number({
    required_error: "Please enter water amount",
  }).min(50, {
    message: "Water amount must be at least 50ml",
  }).max(1500, {
    message: "Water amount must be at most 1500ml",
  }),
  beanName: z.string({
    required_error: "Please enter the bean name",
  }).min(2, {
    message: "Bean name must be at least 2 characters",
  }),
  roastProfile: z.enum(["light", "medium", "medium-dark", "dark"], {
    required_error: "Please select a roast profile",
  }),
});

export default function BrewingAssistantPage() {
  const router = useRouter();
  const [ratio, setRatio] = useState<number>(16); // Default coffee:water ratio

  // Fetch brewing methods and grinders
  const { data: brewers = [], isLoading: isLoadingBrewers } = useQuery({
    queryKey: ["manualBrewers"],
    queryFn: () => getAllManualBrewers(),
  });

  const { data: grinders = [], isLoading: isLoadingGrinders } = useQuery({
    queryKey: ["grinders"],
    queryFn: () => getAllGrinders(),
  });

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brewerId: "",
      grinderId: "",
      coffeeAmount: 15,
      waterAmount: 240,
      beanName: "",
      roastProfile: "medium",
    },
  });

  // Watch for changes to update ratio
  const coffeeAmount = form.watch("coffeeAmount");
  const waterAmount = form.watch("waterAmount");

  // Update ratio when coffee or water amount changes
  useEffect(() => {
    if (coffeeAmount && waterAmount) {
      setRatio(Math.round((waterAmount / coffeeAmount) * 10) / 10);
    }
  }, [coffeeAmount, waterAmount]);

  // Update water amount when coffee amount changes to maintain ratio
  const updateWaterAmount = (coffee: number) => {
    const water = Math.round(coffee * ratio);
    form.setValue("waterAmount", water);
  };

  // Update coffee amount when water amount changes to maintain ratio
  const updateCoffeeAmount = (water: number) => {
    const coffee = Math.round(water / ratio);
    form.setValue("coffeeAmount", coffee);
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-coffee-navy dark:text-coffee-coral mb-6">
        Brewing Assistant
      </h1>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Your Brewing Recipe</CardTitle>
          <CardDescription>
            Select your brewing method, grinder, and beans to get a personalized brewing recipe with timer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brewing Method Selection */}
                  <FormField
                    control={form.control}
                    name="brewerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brewing Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select brewing method" />
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
                    name="grinderId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grinder</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grinder" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="beanName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bean Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Ethiopia Yirgacheffe" {...field} />
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
                    name="roastProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roast Profile</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select roast profile" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ROAST_PROFILES.map((profile) => (
                              <SelectItem key={profile.value} value={profile.value}>
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

                {/* Coffee and Water Amounts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="coffeeAmount"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Coffee Amount (g)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              onChange(e);
                              if (!isNaN(value)) {
                                updateWaterAmount(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Amount of coffee in grams
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="waterAmount"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Water Amount (ml)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              onChange(e);
                              if (!isNaN(value)) {
                                updateCoffeeAmount(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Amount of water in milliliters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Ratio Display */}
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                  <p className="text-center font-medium">
                    Coffee to Water Ratio: 1:{ratio}
                  </p>
                </div>

                <Button type="submit" className="w-full">
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
