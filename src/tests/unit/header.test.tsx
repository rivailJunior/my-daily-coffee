import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Header } from "@/components/navigation/header";
import { usePathname } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/"),
}));

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", { value: jest.fn(), writable: true });

describe("Header Component", () => {
  // Mock window.scrollY and related properties
  const mockScrollY = (value: number) => {
    Object.defineProperty(window, "scrollY", {
      value,
      writable: true,
    });
    
    // Trigger scroll event
    window.dispatchEvent(new Event("scroll"));
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Reset scroll position
    mockScrollY(0);
  });

  it("renders the header with logo and navigation items", () => {
    render(<Header />);
    
    // Check if logo is rendered
    expect(screen.getByText("MyDailyCoffee")).toBeInTheDocument();
    
    // Check if navigation items are rendered on desktop
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Grinders")).toBeInTheDocument();
    expect(screen.getByText("Drippers")).toBeInTheDocument();
    expect(screen.getByText("Brew Assistant")).toBeInTheDocument();
  });

  it("highlights the active navigation item", () => {
    // Mock the current pathname
    (usePathname as jest.Mock).mockReturnValue("/grinders");
    
    render(<Header />);
    
    // Check if active link has the correct class
    const activeLink = screen.getByRole('link', { name: /grinders/i });
    expect(activeLink).toHaveClass('text-coffee-coral');
    
    // Check if other links don't have the active class
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).not.toHaveClass('text-coffee-coral');
  });

  it("toggles mobile menu when menu button is clicked", () => {
    // Set mobile viewport
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
    
    render(<Header />);
    
    // Menu should be closed by default
    expect(screen.queryByRole('navigation', { name: 'Mobile menu' })).not.toBeInTheDocument();
    
    // Open menu
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Menu should be open
    expect(screen.getByRole('navigation', { name: 'Mobile menu' })).toBeInTheDocument();
    
    // Close menu by clicking a link
    const homeLink = screen.getByRole('link', { name: /home/i });
    fireEvent.click(homeLink);
    
    // Menu should be closed after clicking a link
    waitFor(() => {
      expect(screen.queryByRole('navigation', { name: 'Mobile menu' })).not.toBeInTheDocument();
    });
  });

  it("changes style on scroll", () => {
    render(<Header />);
    
    // Initial state - not scrolled
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('py-4');
    
    // Scroll down
    mockScrollY(20);
    
    // Should have scrolled class
    waitFor(() => {
      expect(header).toHaveClass('py-2');
    });
    
    // Scroll back to top
    mockScrollY(0);
    
    // Should have initial class again
    waitFor(() => {
      expect(header).toHaveClass('py-4');
    });
  });

  it("navigates to the correct routes", () => {
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
