import { render, screen, fireEvent } from '@testing-library/react';
import { FormContainer } from '../formContainer';
import { useRouter } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('FormContainer', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Setup the mock implementation
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
  });

  it('renders with default heading when none is provided', () => {
    render(<FormContainer>Test Content</FormContainer>);
    
    expect(screen.getByText('Brewing Assistant')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with custom heading when provided', () => {
    render(<FormContainer heading="Custom Heading">Test Content</FormContainer>);
    
    expect(screen.getByText('Custom Heading')).toBeInTheDocument();
    expect(screen.queryByText('Brewing Assistant')).not.toBeInTheDocument();
  });

  it('renders the recipes button with correct text and icon', () => {
    render(<FormContainer>Test Content</FormContainer>);
    
    const button = screen.getByRole('button', { name: /recipes/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Recipes');
  });

  it('navigates to recipes page when the recipes button is clicked', () => {
    render(<FormContainer>Test Content</FormContainer>);
    
    const button = screen.getByRole('button', { name: /recipes/i });
    fireEvent.click(button);
    
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/brewing-assistant/recipes');
  });

  it('renders the card with correct title and description', () => {
    render(<FormContainer>Test Content</FormContainer>);
    
    expect(screen.getByText('Create Your Brewing Recipe')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Select your brewing method, grinder, and beans to get a personalized brewing recipe with timer.'
      )
    ).toBeInTheDocument();
  });

  it('renders children content inside the card', () => {
    render(
      <FormContainer>
        <div data-testid="test-child">Child Content</div>
      </FormContainer>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('applies the correct dark mode classes', () => {
    render(<FormContainer>Test Content</FormContainer>);
    
    const card = screen.getByTestId('recipe-card');
    expect(card).toHaveClass('dark:bg-coffee-navy');
    expect(card).toHaveClass('dark:border-coffee-navy');
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('dark:text-coffee-coral');
  });
});
