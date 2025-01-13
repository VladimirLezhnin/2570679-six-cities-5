import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './footer';
import { withHistory, withStore } from '../../utils/with-utils/with-utils';
import { getFakeStore } from '../../utils/mock/get-fake-store';

describe('Component: Footer', () => {
  it('should display a link to the main page with a logo', () => {
    const withHistoryComponent = withHistory(<Footer />, undefined);
    const { withStoreComponent } = withStore(withHistoryComponent, getFakeStore());

    render(withStoreComponent);

    const logoLink = screen.getByRole('link', { name: /6 cities logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');

    const logoImage = screen.getByAltText(/6 cities logo/i);
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', 'img/logo.svg');
  });
});
