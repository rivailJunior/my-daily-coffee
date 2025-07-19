import { render, screen, fireEvent } from '@testing-library/react';
import { HomeCard } from '../homeCard';

describe('HomeCard', () => {
  const mockOnClick = jest.fn();
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
    image: '/test-image.jpg',
    onClick: mockOnClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with required props', () => {
    render(<HomeCard {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src');
    expect(screen.getByText('See more')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    render(<HomeCard {...defaultProps} />);

    const button = screen.getByText('See more');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('matches snapshot', () => {
    const { container } = render(<HomeCard {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });
});
