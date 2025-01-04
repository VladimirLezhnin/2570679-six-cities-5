import OffersList from '../offers-list/offers-list';
import Map from '../map/map';
import CityList from '../city-list/city-list';
import { Cities } from '../../mocks/cities';
import { useDispatch, useSelector } from 'react-redux';
import { selectOffersByCity } from '../../store/selectors';
import SortingOptions from '../sorting-options/sorting-options';
import { sortOffersByOption } from '../../helpers/sort-offers';
import { useEffect, useState } from 'react';
import { fetchOffers } from '../../api/api-actions';
import { AppDispatch, RootState } from '../..';
import SkeletonLoader from '../../offers-loader/offers-loader';
import MainPageEmpty from './main-page-empty';


function MainPage() {
  const dispatch = useDispatch<AppDispatch>();
  const sortingOption = useSelector((state: RootState) => state.offers.offersSortingOption);
  const offers = sortOffersByOption(useSelector(selectOffersByCity), sortingOption);
  const [activeOfferCardId, setActiveOfferCardId] = useState('');
  const activeOffer = offers.find((x) => x.id === activeOfferCardId);
  const city = useSelector((state: RootState) => state.city);
  const isOffersDataLoading = useSelector((state: RootState) => state.offers.isOffersDataLoading);

  useEffect(() => {
    if (!offers.length) {
      dispatch(fetchOffers());
    }
  }, [dispatch, offers.length]);

  return (
    <div className="page page--gray page--main">
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <CityList cities={Cities}/>
        </div>
        {offers.length !== 0
          ?
          <div className="cities">
            <div className="cities__places-container container">
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">{offers.length} places to stay in {city.name}</b>
                <SortingOptions/>
                <div className="cities__places-list places__list tabs__content">
                  {isOffersDataLoading
                    ? <SkeletonLoader count={10} />
                    : <OffersList offers={offers} setActiveOfferCardId={setActiveOfferCardId} />}
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
