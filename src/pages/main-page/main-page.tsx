import OffersList from '../../components/offers-list/offers-list';
import Map from '../../components/map/map';
import CityList from './city-list/city-list';
import { Cities } from '../../mocks/cities';
import { selectCity, selectOffersDataLoadingStatus, selectOffersInCitySortedByOption } from '../../store/selectors';
import SortingOptions from './sorting-options/sorting-options';
import { useCallback, useEffect, useState } from 'react';
import { fetchOffers } from '../../api/api-actions';
import OffersLoader from '../../components/loaders/offers-loader/offers-loader';
import MainPageEmpty from './main-page-empty';
import Header from '../../components/header/header';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { useAppSelector } from '../../hooks/use-app-selector';


function MainPage() {
  const dispatch = useAppDispatch();
  const offers = useAppSelector(selectOffersInCitySortedByOption);
  const isOffersDataLoading = useAppSelector(selectOffersDataLoadingStatus);
  const [activeOfferCardId, setActiveOfferCardId] = useState('');
  const onMouseOverOffer = useCallback(setActiveOfferCardId, [setActiveOfferCardId]);
  const activeOffer = offers.find((x) => x.id === activeOfferCardId);
  const city = useAppSelector(selectCity);

  useEffect(() => {
    if (!offers.length) {
      dispatch(fetchOffers());
    }
  }, [dispatch, offers.length]);

  return (
    <div className="page page--gray page--main">
      <Header />
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <CityList cities={Cities}/>
        </div>
        {(offers.length !== 0 && !isOffersDataLoading) || isOffersDataLoading
          ?
          <div className="cities">
            <div className="cities__places-container container">
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">{offers.length} places to stay in {city.name}</b>
                <SortingOptions />
                <div className="cities__places-list places__list tabs__content">
                  {isOffersDataLoading
                    ? <OffersLoader count={10} />
                    : <OffersList offers={offers} onMouseOverOffer={onMouseOverOffer} />}
                </div>
              </section>
              <div className="cities__right-section">
                <Map city={city}
                  offersLocations={offers.map((offer) => (
                    {
                      point: {
                        title: offer.title,
                        lat: offer.location.latitude,
                        lng: offer.location.longitude
                      },
                      offerId: offer.id
                    }))}
                  activeOfferLocation={activeOffer === undefined ? undefined : {
                    point: {
                      title: activeOffer.title,
                      lat: activeOffer.location.latitude,
                      lng: activeOffer.location.longitude
                    },
                    offerId: activeOffer.id
                  }}
                  block='cities'
                />
              </div>
            </div>
          </div>
          : <MainPageEmpty cityName={city.name}/>}
      </main>
    </div>
  );
}

export default MainPage;
