import { render, screen, waitFor } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { useAppSelector } from '../../hooks/use-app-selector';
import {
  fetchNearOffers,
  fetchOfferComments,
  fetchOfferDetails,
} from '../../api/api-actions';
import OfferPage from './offer';
import { AuthorizationStatus, AppRoute } from '../../enums';
import {
  selectLimitedOffersNearby,
  selectOfferReviews,
  selectOfferDetails,
} from '../../store/selectors';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { getFakeReviews } from '../../utils/mock/get-fake-reviews';
import { Cities } from '../../mocks/cities';
import { getFakeUserData } from '../../utils/mock/get-fake-user-data';
import { RootState } from '../..';
import { getFakeStore } from '../../utils/mock/get-fake-store';
import { getFakeOffers } from '../../utils/mock/get-fake-offers';


vi.mock('../../hooks/use-app-dispatch');
vi.mock('../../hooks/use-app-selector');
vi.mock('../../api/api-actions');
vi.mock('../../store/selectors');
vi.mock('../../utils/navigate/navigate-to');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

describe('OfferPage', () => {
  const mockDispatch = vi.fn();
  const mockUseAppDispatch = useAppDispatch as Mock;
  const mockUseAppSelector = useAppSelector as Mock;
  const mockUseParams = useParams as Mock;

  const mockOfferDetails = {
    id: '1',
    isFavorite: false,
    images: ['image1.jpg', 'image2.jpg'],
    isPremium: true,
    title: 'Beautiful Apartment',
    rating: 4.5,
    type: 'apartment',
    maxAdults: 4,
    bedrooms: 2,
    price: 120,
    goods: ['Wi-Fi', 'Kitchen'],
    description: 'A nice place to stay.',
    city: Cities[0],
    host: {
      avatarUrl: 'avatar.jpg',
      name: 'John Doe',
      isPro: true,
    },
    location: Cities[0].location,
  };

  const mockNearOffers = getFakeOffers();

  const mockReviews = getFakeReviews();

  let mockState = getFakeStore({
    offerDetails: {
      offerDetails: mockOfferDetails,
      isLoading: false
    },
    nearOffers: {
      nearOffers: mockNearOffers
    },
    offerComments: {
      offerComments: mockReviews,
      commentSendingStatus: false
    },
    auth: {
      authorizationStatus: AuthorizationStatus.Auth,
      userData: getFakeUserData(),
    },
  });

  beforeEach(() => {
    mockDispatch.mockClear();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseAppSelector.mockImplementation((selector: (state: RootState) => unknown) => selector(mockState));
    (useAppSelector as Mock).mockImplementation((selector) => {
      switch (selector) {
        case selectOfferDetails:
          return mockOfferDetails;
        case selectLimitedOffersNearby:
          return mockNearOffers;
        case selectOfferReviews:
          return getFakeReviews();
      }
    });
    mockUseParams.mockReturnValue({ id: '1' });
    vi.clearAllMocks();
  });

  const renderComponent = (routeId: string = '1') => render(
    <MemoryRouter initialEntries={[`/offer/${routeId}`]}>
      <Routes>
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path={AppRoute.Login} element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );

  it('должен рендерить компонент OfferPage', async () => {
    renderComponent();

    expect(await screen.findByText('Beautiful Apartment')).toBeInTheDocument();

    const bookmarkButton = screen.getByTestId('to-bookmarks-button');
    expect(bookmarkButton).toBeInTheDocument();

    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
    expect(screen.getByText('2 Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Max 4 adults')).toBeInTheDocument();
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('A nice place to stay.')).toBeInTheDocument();
    expect(screen.getByText('Other places in the neighbourhood')).toBeInTheDocument();
  });

  it('должен dispatch действия при монтировании компонента', () => {
    renderComponent();

    expect(mockDispatch).toHaveBeenCalledWith(fetchOfferDetails('1'));
    expect(mockDispatch).toHaveBeenCalledWith(fetchNearOffers('1'));
    expect(mockDispatch).toHaveBeenCalledWith(fetchOfferComments('1'));
  });

  it('не должен отображать ReviewForm, если пользователь не аутентифицирован', () => {
    mockState = {
      ...mockState,
      auth: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        userData: mockState.auth.userData
      },
    };

    renderComponent();

    expect(screen.queryByText(/Your review/i)).not.toBeInTheDocument();
  });

  it('должен отображать список предложений поблизости', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Cozy Studio')).toBeInTheDocument();
    });
  });

  it('должен отображать карту с предложениями', async () => {
    renderComponent();

    await waitFor(() => {
      const map = screen.getByTestId('map');
      expect(map).toBeInTheDocument();
    });
  });
});
