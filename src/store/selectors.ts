import { createSelector } from 'reselect';
import { Offer } from '../types';
import { RootState } from '..';
import { MAX_NEARBY_OFFERS_COUNT } from '../const';
import { SortingOptionName } from '../enums';


export const selectCity = (state: RootState) => state.city;
export const selectOffers = (state: RootState) => state.offers.offers;
export const selectOffersNearby = (state: RootState) => state.nearOffers.nearOffers;
export const selectOffersDataLoadingStatus = (state: RootState) => state.offers.isOffersDataLoading;
export const selectOfferDetails = (state: RootState) => state.offerDetails.offerDetails;
export const selectOfferId = (state: RootState) => state.offerDetails.offerDetails?.id;
export const selectOfferReviews = (state: RootState) => state.offerComments.offerComments;
export const selectReviewSendingStatus = (state: RootState) => state.offerComments.commentSendingStatus;
export const selectAuthorizationStatus = (state: RootState) => state.auth.authorizationStatus;
export const selectUserData = (state: RootState) => state.auth.userData;
export const selectFavoriteOffers = (state: RootState) => state.favoriteOffers.favoriteOffers;
export const selectActiveSortingOption = (state: RootState) => state.offers.offersSortingOption;

export const selectOffersByCity = createSelector(
  [selectOffers, selectCity],
  (offers, city) => {
    if (Array.isArray(offers)) {
      return offers.filter((offer: Offer) => offer.city.name === city.name);
    }

    return [];
  }
);

export const selectOffersInCitySortedByOption = createSelector(
  [selectOffersByCity, selectActiveSortingOption],
  (offers, option) => {
    if (Array.isArray(offers)) {
      switch (option) {
        case SortingOptionName.PriceLowHigh:
          return [...offers].sort((a, b) => a.price - b.price);
        case SortingOptionName.PriceHighLow:
          return [...offers].sort((a, b) => b.price - a.price);
        case SortingOptionName.TopRated:
          return [...offers].sort((a, b) => b.rating - a.rating);
        default:
          return offers;
      }
    }

    return [];
  }
);

export const selectLimitedOffersNearby = createSelector(
  [selectOffersNearby],
  (offersNearby) => offersNearby.slice(0, MAX_NEARBY_OFFERS_COUNT)
);

