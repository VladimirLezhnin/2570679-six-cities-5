import { vi } from 'vitest';

vi.mock('../offer-card/offer-card', () => ({
    default: vi.fn(({ offer }) => (
    <div data-testid="offer-card">{offer.title}</div>
  )),
}));

import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import OffersList from './offers-list';
import { withHistory, withStore } from '../../utils/with-store/with-store';
import { getFakeStore } from '../../utils/mock/get-fake-store';
import { AuthorizationStatus } from '../../enums';
import { Offer } from '../../types';
import { getFakeOffers } from '../../utils/mock/get-fake-offers';

describe('Component: OffersList', () => {
  const mockOffers: Offer[] = getFakeOffers();
  const mockOnMouseOverOffer = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен рендерить правильное количество OfferCard', () => {
    const { withStoreComponent } = withStore(
      withHistory(<OffersList offers={mockOffers} onMouseOverOffer={mockOnMouseOverOffer} />, undefined),
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

    const offerCards = screen.getAllByTestId('offer-card');
    expect(offerCards).toHaveLength(mockOffers.length);
    mockOffers.forEach((offer, index) => {
      expect(offerCards[index]).toHaveTextContent(offer.title);
    });
  });
});
