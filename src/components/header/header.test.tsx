import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './header';
import { withHistory, withStore } from '../../utils/with-utils/with-utils';
import { getFakeStore } from '../../utils/mock/get-fake-store';
import { AuthorizationStatus } from '../../enums';
import { logoutAction } from '../../api/api-actions';
import { getFakeUserData } from '../../utils/mock/get-fake-user-data';
import { getFakeOffers } from '../../utils/mock/get-fake-offers';
import { AppDispatch } from '../..';


vi.mock('../../api/api-actions', () => ({
  logoutAction: vi.fn(() => async (dispatch: AppDispatch) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    dispatch({ type: 'LOGOUT' });
  }),
}));

describe('Component: Header', () => {
  it('should display links to unauthorized user', () => {
    const withHistoryComponent = withHistory(<Header />, undefined);
    const store = getFakeStore();
    store.auth.authorizationStatus = AuthorizationStatus.NoAuth;
    const { withStoreComponent } = withStore(withHistoryComponent, store);

    render(withStoreComponent);

    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign out/i)).not.toBeInTheDocument();
  });

  it('should display user information to the authorized user', () => {
    const mockEmail = 'user@example.com';
    const withHistoryComponent = withHistory(<Header />, undefined);
    const { withStoreComponent } = withStore(withHistoryComponent, getFakeStore({
      auth: {
        authorizationStatus: AuthorizationStatus.Auth,
        userData: getFakeUserData(),
      },
      favoriteOffers: {
        favoriteOffers: getFakeOffers(),
      }
    }));

    render(withStoreComponent);

    expect(screen.getByText(mockEmail)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
  });

  it('should call logoutAction when clicking on "Sign out"', async () => {
    const { withStoreComponent, mockStore } = withStore(<Header />, getFakeStore({
      auth: {
        authorizationStatus: AuthorizationStatus.Auth,
        userData: getFakeUserData(),
      },
      favoriteOffers: {
        favoriteOffers: getFakeOffers(),
      }
    }));

    const withHistoryComponent = withHistory(withStoreComponent, undefined);

    render(withHistoryComponent);

    const signOutButton = screen.getByText(/Sign out/i);
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(logoutAction).toHaveBeenCalled();

      const actions = mockStore.getActions();
      expect(actions).toContainEqual({ type: 'LOGOUT' });
    });
  });
});
