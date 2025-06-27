import { z } from 'zod';
import { BrewingAssistantFormData, BrewingRecipe } from './brewingAssistant';

// Form schema validation
export const BrewingFormSchema = z.object({
  brewerId: z
    .string({
      required_error: 'Please select a brewing method',
    })
    .nonempty(),
  grinderId: z
    .string({
      required_error: 'Please select a grinder',
    })
    .nonempty(),
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
  stepsAmount: z.coerce
    .number({
      required_error: 'Please enter steps amount',
    })
    .min(1, {
      message: 'Steps amount must be at least 1',
    })
    .max(10, {
      message: 'Steps amount must be at most 10',
    })
    .optional(),
  steps: z
    .array(
      z.object({
        time: z.coerce.number().min(1, { message: 'Time must be at least 1' }),
        description: z
          .string()
          .min(2, { message: 'Description must be at least 2 characters' }),
      })
    )
    .optional(),
  roastProfile: z.enum(['light', 'medium', 'medium-dark', 'dark'], {
    required_error: 'Please select a roast profile',
  }),
  waterTemperature: z.coerce
    .number({
      required_error: 'Please enter water temperature',
    })
    .min(50, {
      message: 'Water temperature must be at least 50°C',
    })
    .max(100, {
      message: 'Water temperature must be at most 100°C',
    }),
});

export type BrewAssistantProps = {
  handleFormSubmit: (
    formData: BrewingAssistantFormData & { steps?: { time: number }[] }
  ) => Promise<BrewingRecipe>;
  heading: string;
  isManualRecipe?: boolean;
};
