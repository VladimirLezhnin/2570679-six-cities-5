import { useRef, useEffect } from 'react';
import { Icon, Marker, layerGroup } from 'leaflet';
import useMap from '../../hooks/use-map';
import { City, OfferLocation } from '../../types';
import 'leaflet/dist/leaflet.css';
import pinActive from '/img/pin-active.svg';
import pin from '/img/pin.svg';


type MapProps = {
  city: City;
  offersLocations: OfferLocation[];
  activeOfferLocation: OfferLocation | undefined;
  block: string;
};

const defaultCustomIcon = new Icon({
  iconUrl: pin,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const currentCustomIcon = new Icon({
  iconUrl: pinActive,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function Map({ city, offersLocations, activeOfferLocation, block }: MapProps): JSX.Element {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      map.setView(
        {
          lat: city.location.latitude,
          lng: city.location.longitude,
        },
        city.location.zoom
      );

      const markerLayer = layerGroup().addTo(map);

      offersLocations.forEach((offerLocation) => {
        const marker = new Marker({
          lat: offerLocation.point.lat,
          lng: offerLocation.point.lng,
        });

        marker
          .setIcon(
            activeOfferLocation !== undefined && offerLocation.offerId === activeOfferLocation.offerId
              ? currentCustomIcon
              : defaultCustomIcon
          )
          .addTo(markerLayer);
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, city, offersLocations, activeOfferLocation]);

  return (
    <section
      className={`${block}__map map`}
      ref={mapRef}
      style={{
        bottom: 0,
        left: 0,
        right: 0,
      }}
    ></section>
  );
}

export default Map;
