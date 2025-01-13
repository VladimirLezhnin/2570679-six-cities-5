import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Map from './map';
import { City, OfferLocation } from '../../types';

describe('Component: Map', () => {
  const mockCity: City = {
    name: 'Paris',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 12,
    },
  };

  const mockOffersLocations: OfferLocation[] = [
    {
      offerId: '1',
      point: { lat: 48.8566, lng: 2.3522, title: 'point 1' },
    },
    {
      offerId: '2',
      point: { lat: 48.857, lng: 2.353, title: 'point 2' },
    },
  ];

  const mockActiveOfferLocation: OfferLocation = {
    offerId: '2',
    point: { lat: 48.857, lng: 2.353, title: 'point 2' },
  };

  it('should render the map with the correct block', () => {
    const block = 'cities';
    render(
      <Map
        city={mockCity}
        offersLocations={mockOffersLocations}
        activeOfferLocation={mockActiveOfferLocation}
        block={block}
      />
    );

    const mapElement = screen.getByTestId('map');
    expect(mapElement).toBeInTheDocument();
    expect(mapElement).toHaveClass(`${block}__map`);
  });

  it('should render the map even without an active proposal', () => {
    render(
      <Map
        city={mockCity}
        offersLocations={mockOffersLocations}
        activeOfferLocation={undefined}
        block="cities"
      />
    );

    const mapElement = screen.getByTestId('map');
    expect(mapElement).toBeInTheDocument();
  });

  it('should work correctly with an empty list of offers', () => {
    render(
      <Map
        city={mockCity}
        offersLocations={[]}
        activeOfferLocation={undefined}
        block="cities"
      />
    );

    const mapElement = screen.getByTestId('map');
    expect(mapElement).toBeInTheDocument();
  });
});
