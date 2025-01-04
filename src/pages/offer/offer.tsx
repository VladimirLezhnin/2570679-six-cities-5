import { useParams } from 'react-router-dom';
import OfferGallery from './offer-gallery/offer-gallery';
import OfferGoods from './offer-goods/offer-goods';
import ReviewForm from './review-form/review-form';
import { capitalizeFirstLetter } from '../../helpers/capitalize-first-letter';
import { AppRoute, AuthorizationStatus } from '../../enums';
import OffersList from '../../components/offers-list/offers-list';
import ReviewsList from './reviews-list/reviews-list';
import Map from '../../components/map/map';
import { addOfferToFavorites, fetchNearOffers, fetchOfferComments, fetchOfferDetails, removeOfferFromFavorites } from '../../api/api-actions';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../..';
import Header from '../../components/header/header';
import SpinnerLoader from '../../components/loaders/spinner-loader/spinner';
import { roundNumberWithTieBreak } from '../../helpers/round-number-with-tiebreak';
import { pluralizeWord } from '../../helpers/pluralize-word';
import { navigateTo } from '../../utils/navigate/navigate-to';
import { setOfferDetails } from '../../store/action';


function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferDetails(id));
      dispatch(fetchNearOffers(id));
      dispatch(fetchOfferComments(id));
    }
  }, [dispatch, id]);

  const details = useSelector((state: RootState) => state.offerDetails.offerDetails);
  const nearOffers = useSelector((state: RootState) => state.nearOffers.nearOffers.slice(0, 3));
  const offerCommentsState = useSelector((state: RootState) => state.offerComments);
  const authorizationStatus = useSelector((state: RootState) => state.auth.authorizationStatus);

  if (!details || !id) {
    return <SpinnerLoader />;
  }

  const { isFavorite, images, isPremium, title, rating, type, maxAdults, bedrooms, price, goods, description, city, host, location } = details;

  const handleBookmarkClick = () => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigateTo(AppRoute.Login);
    } else {
      if (isFavorite) {
        dispatch(removeOfferFromFavorites(id));
      } else {
        dispatch(addOfferToFavorites(id));
      }

      const updatedOfferDetails = { ...details, isFavorite: !isFavorite };
      dispatch(setOfferDetails(updatedOfferDetails));
    }
  };

  window.scrollTo(0, 0);
  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          {<OfferGallery imagesSources={images} />}
          <div className="offer__container container">
            <div className="offer__wrapper">
              {
                isPremium ?
                  <div className="offer__mark">
                    <span>Premium</span>
                  </div> : <div></div>
              }
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {title}
                </h1>
                <button
                  className={`offer__bookmark-button button${authorizationStatus === AuthorizationStatus.Auth && isFavorite
                    ? ' offer__bookmark-button--active'
                    : ''}`}
                  type="button"
                  onClick={handleBookmarkClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${20 * roundNumberWithTieBreak(rating)}%` }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {capitalizeFirstLetter(type)}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {bedrooms} {pluralizeWord('Bedroom', bedrooms)}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {maxAdults} {pluralizeWord('adult', maxAdults)}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              {<OfferGoods goods={goods} />}
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img className="offer__avatar user__avatar" src={host.avatarUrl} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">
                    {host.name}
                  </span>
                  {
                    host.isPro ?
                      <div className="offer__user-status">
                        <span>Pro</span>
                      </div> : <div></div>
                  }
                </div>
                <div className="offer__description">
                  <p className="offer__text">
                    {description}
                  </p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                {<ReviewsList reviews={offerCommentsState.offerComments} />}
                {authorizationStatus === AuthorizationStatus.Auth && <ReviewForm />}
              </section>
            </div>
          </div>
        </section>
        <section className="offer__map map">
          <Map city={city}
            offersLocations={nearOffers.map((offer) => ({
              point: {
                title: offer.title,
                lat: offer.location.latitude,
                lng: offer.location.longitude
              },
              offerId: offer.id
            }))}
            activeOfferLocation={{
              point: {
                title: title,
                lat: location.latitude,
                lng: location.longitude
              },
              offerId: id
            }}
            block={'offer'}
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              {<OffersList offers={nearOffers} onMouseOverOffer={() => { }} />}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
