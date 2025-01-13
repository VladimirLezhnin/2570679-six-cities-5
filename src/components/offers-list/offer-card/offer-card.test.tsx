import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, Mock } from 'vitest';
import OfferCard from './offer-card';
import { withHistory, withStore } from '../../../utils/with-store/with-store';
import { getFakeStore } from '../../../utils/mock/get-fake-store';
import { AuthorizationStatus, AppRoute } from '../../../enums';
import { addOfferToFavorites, removeOfferFromFavorites } from '../../../api/api-actions';
import { getFakeUserData } from '../../../utils/mock/get-fake-user-data';
import { Offer } from '../../../types';
import { navigateTo } from '../../../utils/navigate/navigate-to';
import { getFakeOffers } from '../../../utils/mock/get-fake-offers';
import { vi } from 'vitest';


vi.mock('../../../api/api-actions', () => ({
  addOfferToFavorites: vi.fn(() => async (dispatch: any) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    dispatch({ type: 'ADD_OFFER_TO_FAVORITES', payload: undefined });
  }),
  removeOfferFromFavorites: vi.fn(() => async (dispatch: any) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    dispatch({ type: 'REMOVE_OFFER_FROM_FAVORITES', payload: undefined });
  }),
}));

vi.mock('../../../utils/navigate/navigate-to', () => ({
  navigateTo: vi.fn(),
}));

const mockedAddOfferToFavorites = addOfferToFavorites as unknown as Mock;
const mockedRemoveOfferFromFavorites = removeOfferFromFavorites as unknown as Mock;
const mockedNavigateTo = navigateTo as unknown as Mock;

describe('Component: OfferCard', () => {
  const mockOffer: Offer = getFakeOffers()[0];
  const mockOnMouseOver = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен отображать информацию о предложении корректно', () => {
    const { withStoreComponent } = withStore(
      withHistory(<OfferCard offer={mockOffer} onMouseOver={mockOnMouseOver} />, undefined),
      getFakeStore({
        auth: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: getFakeUserData(),
        },
        favoriteOffers: {
          favoriteOffers: [],
        },
      })
    );

    render(withStoreComponent);

    expect(screen.getByText(/Premium/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Place image/i)).toHaveAttribute('src', mockOffer.previewImage);
    expect(screen.getByText(`€${mockOffer.price}`)).toBeInTheDocument();
    expect(screen.getByText(mockOffer.title)).toBeInTheDocument();
  });

  it('должен вызывать onMouseOver при наведении мыши', () => {
    const { withStoreComponent } = withStore(
      withHistory(<OfferCard offer={mockOffer} onMouseOver={mockOnMouseOver} />, undefined),
      getFakeStore({
        auth: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: getFakeUserData(),
        },
        favoriteOffers: {
          favoriteOffers: [],
        },
      })
    );

    render(withStoreComponent);

    const card = screen.getByRole('article');

    fireEvent.mouseEnter(card);
    expect(mockOnMouseOver).toHaveBeenCalledWith(mockOffer.id);

    fireEvent.mouseLeave(card);
    expect(mockOnMouseOver).toHaveBeenCalledWith('');
  });

  it('должен вызывать addOfferToFavorites при клике на bookmark, если предложение не в избранном и авторизован', async () => {
    const { withStoreComponent, mockStore } = withStore(
      withHistory(<OfferCard offer={mockOffer} onMouseOver={mockOnMouseOver} />, undefined),
      getFakeStore({
        auth: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: getFakeUserData(),
        },
        favoriteOffers: {
          favoriteOffers: [],
        },
      })
    );

    render(withStoreComponent);

    const bookmarkButton = screen.getByRole('button', { name: /To bookmarks/i });

    fireEvent.click(bookmarkButton);

    expect(mockedAddOfferToFavorites).toHaveBeenCalledWith(mockOffer.id);

    await waitFor(() => {
      const actions = mockStore.getActions();
      expect(actions).toContainEqual({ type: 'ADD_OFFER_TO_FAVORITES', payload: undefined });
    });
  });

  it('должен вызывать removeOfferFromFavorites при клике на bookmark, если предложение в избранном и авторизован', async () => {
    const { withStoreComponent, mockStore } = withStore(
      withHistory(<OfferCard offer={mockOffer} onMouseOver={mockOnMouseOver} />, undefined),
      getFakeStore({
        auth: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: getFakeUserData(),
        },
        favoriteOffers: {
          favoriteOffers: [mockOffer],
        },
      })
    );

    render(withStoreComponent);
    const bookmarkButton = screen.getByRole('button', { name: /To bookmarks/i });
    fireEvent.click(bookmarkButton);

    expect(mockedRemoveOfferFromFavorites).toHaveBeenCalledWith(mockOffer.id);

    await waitFor(() => {
      const actions = mockStore.getActions();
      expect(actions).toContainEqual({ type: 'REMOVE_OFFER_FROM_FAVORITES', payload: undefined });
    });
  });

  it('должен вызывать navigateTo при клике на bookmark, если пользователь не авторизован', () => {
    const { withStoreComponent } = withStore(
      withHistory(<OfferCard offer={mockOffer} onMouseOver={mockOnMouseOver} />, undefined),
      getFakeStore({
        auth: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          userData: undefined,
        },
        favoriteOffers: {
          favoriteOffers: [],
        },
      })
    );

    render(withStoreComponent);

    const bookmarkButton = screen.getByRole('button', { name: /To bookmarks/i });
    fireEvent.click(bookmarkButton);
    expect(mockedNavigateTo).toHaveBeenCalledWith(AppRoute.Login);
  });
});
