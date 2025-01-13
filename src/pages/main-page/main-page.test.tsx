import { render, screen, waitFor } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { useAppSelector } from '../../hooks/use-app-selector';
import { fetchOffers, fetchFavoriteOffers } from '../../api/api-actions';
import MainPage from './main-page';
import {
  selectOffersInCitySortedByOption,
  selectCity,
  selectOffersDataLoadingStatus,
} from '../../store/selectors';
import { MemoryRouter } from 'react-router-dom';


vi.mock('../../hooks/use-app-dispatch');
vi.mock('../../hooks/use-app-selector');
vi.mock('../../api/api-actions');
vi.mock('../../store/selectors');

describe('MainPage', () => {
  const mockDispatch = vi.fn();
  const mockCity = {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 13,
    },
  };
  const mockOffers = [
    {
      id: '1',
      title: 'Offer 1',
      location: { latitude: 0, longitude: 0, zoom: 8 },
      type: 'Hotel',
      city: mockCity,
      price: 100,
      previewImage: 'img',
      isFavorite: false,
      isPremium: false,
      rating: 3,
    },
    {
      id: '2',
      title: 'Offer 2',
      location: { latitude: 1, longitude: 1, zoom: 8 },
      type: 'Hotel',
      city: mockCity,
      price: 100,
      previewImage: 'img',
      isFavorite: false,
      isPremium: false,
      rating: 3,
    },
  ];

  beforeEach(() => {
    mockDispatch.mockClear();
    (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    (useAppSelector as Mock).mockImplementation((selector) => {
      switch (selector) {
        case selectOffersInCitySortedByOption:
          return mockOffers;
        case selectCity:
          return mockCity;
        case selectOffersDataLoadingStatus:
          return false;
        default:
          return undefined;
      }
    });
    (fetchOffers as unknown as Mock).mockImplementation(() => ({ type: 'FETCH_OFFERS' }));
    (fetchFavoriteOffers as unknown as Mock).mockImplementation(() => ({
      type: 'FETCH_FAVORITE_OFFERS',
    }));
  });

  it('должен рендерить компонент главной страницы', () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('должен отображать индикатор загрузки, если данные еще загружаются', () => {
    (useAppSelector as Mock).mockImplementation((selector) => {
      switch (selector) {
        case selectOffersInCitySortedByOption:
          return mockOffers;
        case selectCity:
          return mockCity;
        case selectOffersDataLoadingStatus:
          return true;
        default:
          return undefined;
      }
    });

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('offers-loader')).toBeInTheDocument();
  });

  it('должен отображать предложения, когда данные загружены', async () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Offer 1')).toBeInTheDocument();
      expect(screen.getByText('Offer 2')).toBeInTheDocument();
    });
  });

  it('должен отображать пустую страницу, если предложений нет', () => {
    (useAppSelector as Mock).mockImplementation((selector) => {
      switch (selector) {
        case selectOffersInCitySortedByOption:
          return [];
        case selectCity:
          return mockCity;
        case selectOffersDataLoadingStatus:
          return false;
        default:
          return undefined;
      }
    });

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(
      screen.getByText(
        `We could not find any property available at the moment in ${mockCity.name}`
      )
    ).toBeInTheDocument();
  });

  it('должен dispatch fetchFavoriteOffers при монтировании компонента', () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    expect(mockDispatch).toHaveBeenCalledWith(fetchFavoriteOffers());
  });

  it('должен рендерить карту с метками для предложений', async () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const map = screen.getByTestId('map');
      expect(map).toBeInTheDocument();
    });
  });
});
