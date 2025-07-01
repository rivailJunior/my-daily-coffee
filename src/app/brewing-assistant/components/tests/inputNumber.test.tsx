import { render, screen, fireEvent } from '@testing-library/react';
import { InputNumber } from '../inputNumber';

// Mock the onlyNumber utility
jest.mock('../../../../utils/inputField', () => ({
  onlyNumber: jest.fn().mockImplementation((value) => {
    // Simple mock that removes non-numeric characters
    const num = value.replace(/\D/g, '');
    return num ? parseInt(num, 10) : NaN;
  }),
}));

describe('InputNumber', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    field: { name: 'test-input' },
    onChange: mockOnChange,
    placeholder: 'Enter a number',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders an input with the provided placeholder', () => {
    render(<InputNumber {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter a number');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('calls onChange with the numeric value when input changes', () => {
    render(<InputNumber {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter a number');

    fireEvent.change(input, { target: { value: '123abc' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(123);
  });

  it('calls onChange with 0 when input is empty after filtering non-numeric characters', () => {
    render(<InputNumber {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter a number');

    fireEvent.change(input, { target: { value: 'abc' } });

    expect(mockOnChange).toHaveBeenCalledWith(0);
  });

  it('applies the correct CSS classes', () => {
    render(<InputNumber {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter a number');

    expect(input).toHaveClass('bg-white');
    expect(input).toHaveClass('dark:bg-gray-700');
    expect(input).toHaveClass('border-gray-300');
    expect(input).toHaveClass('dark:border-gray-600');
    expect(input).toHaveClass('focus:ring-2');
    expect(input).toHaveClass('focus:ring-coffee-coral/50');
    expect(input).toHaveClass('dark:focus:ring-coffee-coral/70');
    expect(input).toHaveClass('transition-colors');
  });

  it('is disabled when the disabled prop is true', () => {
    render(<InputNumber {...defaultProps} disabled={true} />);
    const input = screen.getByPlaceholderText('Enter a number');
    expect(input).toBeDisabled();
  });

  it('is not disabled when the disabled prop is false or not provided', () => {
    const { rerender } = render(
      <InputNumber {...defaultProps} disabled={false} />
    );
    expect(screen.getByPlaceholderText('Enter a number')).not.toBeDisabled();

    rerender(<InputNumber {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter a number')).not.toBeDisabled();
  });

  it('passes through additional field props to the input', () => {
    const customProps = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        'data-testid': 'custom-input',
        className: 'custom-class',
      },
    };

    render(<InputNumber {...customProps} />);
    const input = screen.getByTestId('custom-input');

    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('custom-class');
  });
});
