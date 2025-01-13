import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './app';
import { withHistory, withStore } from '../../utils/with-utils/with-utils';
import { AppRoute, AuthorizationStatus, SortingOptionName } from '../../enums';
import { getFakeStore } from '../../utils/mock/get-fake-store';
import { getFakeOffers } from '../../utils/mock/get-fake-offers';
import { Cities } from '../../mocks/cities';

describe('Component: App', () => {
  let mockHistory: ReturnType<typeof createMemoryHistory>;

  beforeEach(() => {
    mockHistory = createMemoryHistory();
  });

  it('should render MainPage using route "/"', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const store = getFakeStore({
      offers: {
        offers: getFakeOffers(),
        isOffersDataLoading: false,
        offersSortingOption: SortingOptionName.Popular,
      },
      city: Cities[0]
    });
    const { withStoreComponent } = withStore(withHistoryComponent, store);

    mockHistory.push(AppRoute.Root);
    render(withStoreComponent);

    expect(screen.getByRole('link', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/Sort by/i)).toBeInTheDocument();
    expect(screen.getByText(/places to stay in/i)).toBeInTheDocument();
  });

  it('should render Login on the "/login" route', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, getFakeStore());

    mockHistory.push(AppRoute.Login);
    render(withStoreComponent);

    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('should render an empty FavoritesPage for the logged in user via the "/favorites" route', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const store = getFakeStore();
    store.auth.authorizationStatus = AuthorizationStatus.Auth;
    const { withStoreComponent } = withStore(withHistoryComponent, store);

    mockHistory.push(AppRoute.Favorites);
    render(withStoreComponent);

    expect(screen.getByText(/Nothing yet saved./i)).toBeInTheDocument();
    expect(screen.getByText(/Save properties to narrow down search or plan your future trips./i)).toBeInTheDocument();
  });

  it('should redirect to NotFoundPage for non-existent route', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, getFakeStore());

    mockHistory.push('/unknown-route');
    render(withStoreComponent);

    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/Oops! Page not found/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Go back to homepage/i })).toBeInTheDocument();
  });
});
