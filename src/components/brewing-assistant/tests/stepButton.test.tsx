import { render, screen, fireEvent } from '@testing-library/react';
import { StepButton } from '../stepButton';
import { Plus, Minus } from 'lucide-react';

describe('StepButton', () => {
  it('renders the button with the provided icon', () => {
    render(
      <StepButton icon={<Plus data-testid='test-icon' />} onClick={jest.fn()} />
    );

    const button = screen.getByRole('button');
    const icon = screen.getByTestId('test-icon');

    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });

  it('calls the onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<StepButton icon={<Plus />} onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    render(<StepButton icon={<Plus />} onClick={jest.fn()} disabled={true} />);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('is not disabled when the disabled prop is false or not provided', () => {
    const { rerender } = render(
      <StepButton icon={<Plus />} onClick={jest.fn()} disabled={false} />
    );
    expect(screen.getByRole('button')).not.toBeDisabled();

    rerender(<StepButton icon={<Plus />} onClick={jest.fn()} />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });


  it('renders different icons when provided', () => {
    const { rerender } = render(
      <StepButton icon={<Plus data-testid='plus-icon' />} onClick={jest.fn()} />
    );
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();

    rerender(
      <StepButton
        icon={<Minus data-testid='minus-icon' />}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
  });
});
