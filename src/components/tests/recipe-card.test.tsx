import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RecipeCard } from '../recipes/recipe-card';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BrewingRecipe } from '@/types/brewingAssistant';

dayjs.extend(relativeTime);

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockImplementation(() => ({
  push: mockPush,
}));

describe('RecipeCard', () => {
  const mockRecipe: Partial<BrewingRecipe> = {
    id: '1',
    name: 'Test Recipe',
    beanName: 'Test Bean',
    roastProfile: 'medium',
    coffeeAmount: 18,
    waterAmount: 300,
    waterTemperature: 92,
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock dayjs().from to return a fixed value
    const actualDayjs = jest.requireActual('dayjs');
    jest.spyOn(actualDayjs(), 'from').mockReturnValue('2 hours');
  });

  it('renders recipe details correctly', () => {
    render(<RecipeCard recipe={mockRecipe} />);

    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('Test Bean - medium')).toBeInTheDocument();
    expect(screen.getByText('18g')).toBeInTheDocument();
    expect(screen.getByText('300ml')).toBeInTheDocument();
    expect(screen.getByText('92°C')).toBeInTheDocument();
    expect(screen.getByText('16.7:1')).toBeInTheDocument();
  });

  it('displays relative time', () => {
    render(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
  });

  it('navigates to brew timer when Brew button is clicked', () => {
    render(<RecipeCard recipe={mockRecipe} />);

    const brewButton = screen.getByRole('button', { name: /brew/i });
    fireEvent.click(brewButton);

    expect(mockPush).toHaveBeenCalledWith('/brewing-assistant/timer/1');
  });

  it('navigates to recipe details when Screenshot button is clicked', () => {
    render(<RecipeCard recipe={mockRecipe} />);

    const screenshotButton = screen.getByRole('button', {
      name: /screenshot/i,
    });
    fireEvent.click(screenshotButton);

    expect(mockPush).toHaveBeenCalledWith('/brewing-assistant/recipes/1');
  });

  it('handles missing recipe name', () => {
    const recipeWithoutName = { ...mockRecipe, name: '' };
    render(<RecipeCard recipe={recipeWithoutName} />);

    expect(screen.getByText('Unnamed Recipe')).toBeInTheDocument();
  });

  it('displays correct coffee to water ratio', () => {
    const recipeWithDifferentAmounts = {
      ...mockRecipe,
      coffeeAmount: 20,
      waterAmount: 340,
    };

    render(<RecipeCard recipe={recipeWithDifferentAmounts} />);

    expect(screen.getByText('17:1')).toBeInTheDocument();
  });
});
