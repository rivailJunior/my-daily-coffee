import { render, screen } from '@testing-library/react';
import { Footer } from '../footer';
import '@testing-library/jest-dom';

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders the footer with the correct title', () => {
    const title = screen.getByText('My Daily Coffee');
    expect(title).toBeInTheDocument();
    expect(title.closest('a')).toHaveAttribute('href', 'https://flowbite.com/');
  });

  it('renders all navigation sections', () => {
    const resourcesHeading = screen.getByText('Resources');
    const followUsHeading = screen.getByText('Follow us');
    const legalHeading = screen.getByText('Legal');

    expect(resourcesHeading).toBeInTheDocument();
    expect(followUsHeading).toBeInTheDocument();
    expect(legalHeading).toBeInTheDocument();
  });

  it('contains all resource links with correct hrefs', () => {
    const homeLink = screen.getByRole('link', { name: /home/i });
    const recipesLink = screen.getByRole('link', { name: /recipes/i });
    const grindersLink = screen.getByRole('link', { name: /grinders/i });
    const brewingMethodsLink = screen.getByRole('link', {
      name: /manual brewing methods/i,
    });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(recipesLink).toHaveAttribute('href', '/brewing-assistant/recipes');
    expect(grindersLink).toHaveAttribute('href', '/grinders');
    expect(brewingMethodsLink).toHaveAttribute(
      'href',
      '/manual-brewing-methods'
    );
  });

  it('contains all legal links', () => {
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    const termsLink = screen.getByRole('link', { name: /terms & conditions/i });

    expect(privacyLink).toHaveAttribute('href', '#');
    expect(termsLink).toHaveAttribute('href', '#');
  });

  it('displays the current year in the copyright', () => {
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(`© ${currentYear}`, {
      exact: false,
    });
    expect(copyrightText).toBeInTheDocument();
  });
});
