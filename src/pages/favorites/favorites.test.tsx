// src/pages/favorites/favorites.test.tsx

import { Mock, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import FavoritesPage from './favorites';
import { withHistory, withStore } from '../../utils/with-store/with-store';
import { getFakeStore } from '../../utils/mock/get-fake-store';
import { AuthorizationStatus } from '../../enums';
import { getFakeOffers } from '../../utils/mock/get-fake-offers';
import { Offer } from '../../types';


vi.mock('../../components/header/header', () => ({
  default: () => <div data-testid="header">Mocked Header</div>,
}));

vi.mock('../../components/footer/footer', () => ({
  default: () => <div data-testid="footer">Mocked Footer</div>,
}));

vi.mock('../../components/offers-list/offers-list', () => ({
  default: vi.fn(({ offers }) => (
    <div data-testid="offers-list">
      {offers.map((offer: Offer) => (
        <div key={offer.id} data-testid="offer-item">
          {offer.title}
        </div>
      ))}
    </div>
  )),
}));

vi.mock('../../hooks/use-app-selector', () => ({
  useAppSelector: vi.fn(),
}));

import { useAppSelector } from '../../hooks/use-app-selector';
import OffersList from '../../components/offers-list/offers-list';

describe('Component: FavoritesPage', () => {
  const mockOffers: Offer[] = getFakeOffers();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен рендерить FavoritesEmpty, когда список избранных предложений пуст', () => {
    (useAppSelector as unknown as Mock).mockReturnValue([]);

    const { withStoreComponent } = withStore(
      withHistory(<FavoritesPage />),
      getFakeStore({
        auth: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: undefined,
        },
        favoriteOffers: {
          favoriteOffers: [],
        },
      })
    );

    render(withStoreComponent);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    expect(
      screen.getByText('Save properties to narrow down search or plan your future trips.')
    ).toBeInTheDocument();
  });

  it('должен рендерить список избранных предложений, сгруппированных по городам', () => {
    (useAppSelector as unknown as Mock).mockReturnValue(mockOffers);

    const { withStoreComponent } = withStore(
      withHistory(<FavoritesPage />),
      getFakeStore({
        auth: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: undefined,
        },
        favoriteOffers: {
          favoriteOffers: mockOffers,
        },
      })
    );

    render(withStoreComponent);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Saved listing')).toBeInTheDocument();

    const OffersListMock = OffersList as unknown as Mock;
    const offersByCity = mockOffers.reduce((acc, offer) => {
      acc[offer.city.name] = acc[offer.city.name] || [];
      acc[offer.city.name].push(offer);
      return acc;
    }, {} as Record<string, Offer[]>);

    expect(OffersListMock).toHaveBeenCalledTimes(Object.keys(offersByCity).length);

    const offerItems = screen.getAllByTestId('offer-item');
    expect(offerItems).toHaveLength(mockOffers.length);

    mockOffers.forEach((offer) => {
      expect(screen.getByText(offer.title)).toBeInTheDocument();
    });
  });
});
