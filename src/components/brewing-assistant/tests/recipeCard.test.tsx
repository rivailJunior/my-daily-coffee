import { render, screen } from '@testing-library/react';
import { RecipeCard } from '../recipeCard';
import { DetailItem } from '../recipeCard';

describe('DetailItem', () => {
  it('renders value and icon', () => {
    render(<DetailItem value='Test Value' icon='⭐' />);

    expect(screen.getByText('⭐')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<DetailItem label='Test Label' value='Test Value' icon='⭐' />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('applies custom value class name', () => {
    render(
      <DetailItem value='Test Value' icon='⭐' valueClassName='custom-class' />
    );

    const valueElement = screen.getByText('Test Value');
    expect(valueElement).toHaveClass('custom-class');
  });
});

describe('RecipeCard', () => {
  const mockRecipe = {
    name: 'Test Recipe',
    totalTime: '3:30',
    drip: 'V60',
    ratio: '1:16',
    waterTemperature: 92,
    waterAmount: 250,
    grinder: 'Commandante',
    grindSize: 'Medium',
    steps: [
      { id: '1', name: 'Bloom', time: '0:30', description: 'Pour 50ml water' },
      {
        id: '2',
        name: 'Main Pour',
        time: '1:00',
        description: 'Pour remaining water',
      },
      { id: '3', name: 'Drawdown', time: '2:00' },
    ],
  };

  beforeEach(() => {
    render(<RecipeCard recipe={mockRecipe} />);
  });

  it('renders recipe name', () => {
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
  });

  it('renders all recipe details', () => {
    expect(screen.getByText('00:03')).toBeInTheDocument();
    expect(screen.getByText('V60')).toBeInTheDocument();
    expect(screen.getByText('1:16')).toBeInTheDocument();
    expect(screen.getByText('92°C')).toBeInTheDocument();
    expect(screen.getByText('250ml')).toBeInTheDocument();
    expect(screen.getByText('Commandante - Medium')).toBeInTheDocument();
  });

  it('renders all brewing steps', () => {
    expect(screen.getByText('1. Pour 50ml water')).toBeInTheDocument();
    expect(screen.getByText('2. Pour remaining water')).toBeInTheDocument();
    expect(screen.getByText('3. Drawdown')).toBeInTheDocument();

    // Check that step times are rendered
    expect(screen.getByText('⏱ 00:00')).toBeInTheDocument();
    expect(screen.getByText('⏱ 00:01')).toBeInTheDocument();
    expect(screen.getByText('⏱ 00:02')).toBeInTheDocument();
  });

  it('renders the footer with app information', () => {
    expect(screen.getByText('@mydailycoffee')).toBeInTheDocument();
  });
});
