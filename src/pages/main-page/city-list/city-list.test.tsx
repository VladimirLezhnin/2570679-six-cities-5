import { render, screen, fireEvent } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import CityList from './city-list';
import { changeCity } from '../../../store/action';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { City } from '../../../types';
import { Cities } from '../../../mocks/cities';

vi.mock('../../../hooks/use-app-dispatch');
vi.mock('../../../hooks/use-app-selector');

describe('CityList', () => {
  const mockDispatch = vi.fn();
  const mockCities: City[] = Cities;
  const mockCurrentCity = { name: 'Paris' };

  beforeEach(() => {
    (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    (useAppSelector as Mock).mockReturnValue(mockCurrentCity);
  });

  it('should render a list of cities', () => {
    render(<CityList cities={mockCities} />);

    mockCities.forEach((city) => {
      expect(screen.getByText(city.name)).toBeInTheDocument();
    });
  });

  it('should call dispatch when clicking on a city', () => {
    render(<CityList cities={mockCities} />);

    const parisLink = screen.getByText('Paris');
    fireEvent.click(parisLink);

    expect(mockDispatch).toHaveBeenCalledWith(changeCity(
      {
        name: 'Paris',
        location: {
          latitude: 48.85661,
          longitude: 2.351499,
          zoom: 13,
        },
      }));
  });

  it('should highlight the active city', () => {
    render(<CityList cities={mockCities} />);

    const parisLink = screen.getByText('Paris').parentNode;
    expect(parisLink).toHaveClass('locations__item-link tabs__item tabs__item--active');
  });
});
