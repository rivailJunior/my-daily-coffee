import { render, screen } from '@testing-library/react';
import { HomeCardHorizontal } from '../homeCard';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('HomeCardHorizontal', () => {
  const defaultProps = {
    title: 'Horizontal Test Title',
    description: 'Horizontal Test Description',
    image: '/test-horizontal-image.jpg',
    onClick: jest.fn(),
  };

  it('renders with required props', () => {
    render(<HomeCardHorizontal {...defaultProps} />);

    expect(screen.getByText('Horizontal Test Title')).toBeInTheDocument();
    expect(screen.getByText('Horizontal Test Description')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src');
  });

  it('applies horizontal layout styles', () => {
    render(<HomeCardHorizontal {...defaultProps} />);

    const card = screen.getByText('Horizontal Test Title').closest('div');
    expect(card).toHaveClass(
      'text-lg font-medium tracking-tight text-gray-900 dark:text-white capitalize'
    );
  });

  it('matches snapshot', () => {
    const { container } = render(<HomeCardHorizontal {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('capitalizes the title', () => {
    render(<HomeCardHorizontal {...defaultProps} title='test title' />);

    const titleElement = screen.getByText('test title');
    expect(titleElement).toHaveClass('capitalize');
  });
});
