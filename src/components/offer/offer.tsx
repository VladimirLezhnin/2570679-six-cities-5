import { Navigate, useParams } from 'react-router-dom';
import OfferGallery from '../offer-gallery/offer-gallery';
import OfferGoods from '../offer-goods/offer-goods';
import ReviewForm from '../review-form/review-form';
import capitalizeFirstLetter from '../../helpers/capitalize-first-letter';
import { AppRoute, AuthorizationStatus } from '../../enums';
import OffersList from '../offers-list/offers-list';
import ReviewsList from '../reviews-list/reviews-list';
import Map from '../map/map';
import { fetchNearOffers, fetchOfferComments, fetchOfferDetails } from '../../api/api-actions';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../..';
import NotFoundPage from '../not-found-page/not-found-page';


function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const detailsState = useSelector((state: RootState) => state.offerDetails);
  const nearOffersState = useSelector((state: RootState) => state.nearOffers);
  const offerCommentsState = useSelector((state: RootState) => state.offerComments);
  const authState = useSelector((state: RootState) => state.auth.authorizationStatus);

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferDetails(id));
      dispatch(fetchNearOffers(id));
      dispatch(fetchOfferComments(id));
    }
  }, [dispatch, id]);

  if (!id) {
    return <Navigate to={AppRoute.NotFoundPage} replace />;
  }

  if (!detailsState.offerDetails) {
    return <NotFoundPage />;
  }

  return (
    <div className="page">
      <main className="page__main page__main--offer">
        <section className="offer">
          {<OfferGallery imagesSources={detailsState.offerDetails.images} />}
          <div className="offer__container container">
            <div className="offer__wrapper">
              {
                detailsState.offerDetails.isPremium ?
                  <div className="offer__mark">
                    <span>Premium</span>
                  </div> : <div></div>
              }
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {detailsState.offerDetails.title}
                </h1>
                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${20 * detailsState.offerDetails.rating}%` }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{detailsState.offerDetails.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {capitalizeFirstLetter(detailsState.offerDetails.type)}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {detailsState.offerDetails.bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {detailsState.offerDetails.maxAdults} adults
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{detailsState.offerDetails.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              {<OfferGoods goods={detailsState.offerDetails.goods} />}
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img className="offer__avatar user__avatar" src={detailsState.offerDetails.host.avatarUrl} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">
                    {detailsState.offerDetails.host.name}
                  </span>
                  {
                    detailsState.offerDetails.host.isPro ?
                      <div className="offer__user-status">
                        <span>Pro</span>
                      </div> : <div></div>
                  }
                </div>
                <div className="offer__description">
                  <p className="offer__text">
                    {detailsState.offerDetails.description}
                  </p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                {<ReviewsList reviews={offerCommentsState.offerComments} />}
                {authState === AuthorizationStatus.Auth && <ReviewForm />}
              </section>
            </div>
          </div>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              {<OffersList offers={nearOffersState.nearOffers} setActiveOfferCardId={() => { }} />}
            </div>
          </section>
        </div>
        <Map city={detailsState.offerDetails.city}
          offersLocations={nearOffersState.nearOffers.map((offer) => ({
            point: {
              title: offer.title,
              lat: offer.location.latitude,
              lng: offer.location.longitude
            },
            offerId: offer.id
          }))}
          activeOfferLocation={undefined}
          block={'offer__map'}
        />
      </main>
    </div>
  );
}

export default OfferPage;
