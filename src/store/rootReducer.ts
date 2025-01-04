import { combineReducers } from 'redux';
import cityReducer from './slices/citySlice';
import offersReducer from './slices/offersSlice';
import authReducer from './slices/authSlice';
import offerDetailsReducer from './slices/offerDetailsSlice';
import nearOffersReducer from './slices/nearOffersSlice';
import offerCommentsReducer from './slices/offerCommentsSlice';
import favoritesOffersReducer from './slices/favoritesSlice';

const rootReducer = combineReducers({
  city: cityReducer,
  offers: offersReducer,
  auth: authReducer,
  offerDetails: offerDetailsReducer,
  nearOffers: nearOffersReducer,
  offerComments: offerCommentsReducer,
  favoritesOffers: favoritesOffersReducer
});

export default rootReducer;
