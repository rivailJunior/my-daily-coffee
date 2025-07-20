import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '@/components/navigation/header';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: jest.fn().mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    user: { name: 'John Doe' },
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });

describe('Header Component', () => {
  // Mock window.scrollY and related properties
  const mockScrollY = (value: number) => {
    Object.defineProperty(window, 'scrollY', {
      value,
      writable: true,
    });

    // Trigger scroll event
    window.dispatchEvent(new Event('scroll'));
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Reset scroll position
    mockScrollY(0);
  });

  it('renders the header with logo and navigation items', () => {
    render(<Header />);

    // Check if logo is rendered
    // expect(screen.getByText('MyDailyCoffee')).toBeInTheDocument();

    // Check if navigation items are rendered on desktop
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();

    // Check for dropdown menus
    expect(
      screen.getByRole('button', { name: /recipes/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gear/i })).toBeInTheDocument();
  });

  it('highlights the active navigation item', () => {
    // Mock the current pathname
    (usePathname as jest.Mock).mockReturnValue('/grinders');

    render(<Header />);

    // Check if active link has the correct class
    const activeLink = screen.getByRole('link', { name: /home/i });
    expect(activeLink).toHaveClass(
      'text-sm font-medium transition-colors text-foreground/80 hover:text-foreground'
    );

    // Check if dropdown menu items show active state when their route is active
    const gearButton = screen.getByRole('button', { name: /gear/i });
    expect(gearButton).toHaveClass(
      'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary focus:outline-none data-[state=open]:text-primary'
    );
  });

  it('toggles mobile menu when menu button is clicked', () => {
    // Set mobile viewport
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    render(<Header />);

    // Menu should be closed by default
    expect(
      screen.queryByRole('navigation', { name: 'Mobile menu' })
    ).not.toBeInTheDocument();

    // Open menu
    const menuButton = screen.getByRole('button', { name: '' });
    fireEvent.click(menuButton);

    // Menu should be open
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    // Close menu by clicking a link
    const homeLink = screen.getAllByRole('link', { name: /home/i });
    fireEvent.click(homeLink[0]);

    // Menu should be closed after clicking a link
    waitFor(() => {
      expect(
        screen.queryByRole('navigation', { name: '' })
      ).not.toBeInTheDocument();
    });
  });

  it.skip('navigates to the correct routes', () => {
    const mockPush = jest.fn();
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
      usePathname: jest.fn().mockReturnValue('/'),
    }));

    render(<Header />);

    // Test navigation to Grinders
    const grindersLink = screen.getByRole('link', { name: /grinders/i });
    fireEvent.click(grindersLink);
    expect(usePathname).toHaveBeenCalled();
  });
});
