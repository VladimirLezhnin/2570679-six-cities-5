import { combineReducers } from 'redux';
import cityReducer from './slices/city-slice';
import offersReducer from './slices/offers-slice';
import authorizationReducer from './slices/auth-slice';
import offerDetailsReducer from './slices/offer-details-slice';
import nearOffersReducer from './slices/near-offers-slice';
import offerReviewsReducer from './slices/offer-comments-slice';
import favoriteOffersReducer from './slices/favorites-slice';

const rootReducer = combineReducers({
  city: cityReducer,
  offers: offersReducer,
  auth: authorizationReducer,
  offerDetails: offerDetailsReducer,
  nearOffers: nearOffersReducer,
  offerComments: offerReviewsReducer,
  favoriteOffers: favoriteOffersReducer
});

export default rootReducer;
