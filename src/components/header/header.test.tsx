import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './header';
import { withHistory, withStore } from '../../utils/with-store/with-store';
import { getFakeStore } from '../../utils/mock/get-fake-store';
import { AuthorizationStatus } from '../../enums';
import { logoutAction } from '../../api/api-actions';
import { getFakeUserData } from '../../utils/mock/get-fake-user-data';
import { getFakeOffers } from '../../utils/mock/get-fake-offers';


vi.mock('../../api/api-actions', () => ({
  logoutAction: vi.fn(() => async (dispatch: any) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    dispatch({ type: 'LOGOUT' });
  }),
}));

describe('Component: Header', () => {
  it('должен отображать ссылки для неавторизованного пользователя', () => {
    const withHistoryComponent = withHistory(<Header />, undefined);
    const store = getFakeStore();
    store.auth.authorizationStatus = AuthorizationStatus.NoAuth;
    const { withStoreComponent } = withStore(withHistoryComponent, store);

    render(withStoreComponent);

    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign out/i)).not.toBeInTheDocument();
  });

  it('должен отображать информацию пользователя для авторизованного пользователя', () => {
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
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
  });

  it('должен вызывать logoutAction при клике на "Sign out"', async () => {
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
