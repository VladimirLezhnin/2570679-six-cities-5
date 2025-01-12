import {configureMockStore } from '@jedmao/redux-mock-store';
import { RootState } from '..';
import {
  selectCity,
  selectOffers,
  selectOffersNearby,
  selectOffersDataLoadingStatus,
  selectOfferDetails,
  selectOfferId,
  selectOfferReviews,
  selectReviewSendingStatus,
  selectAuthorizationStatus,
  selectUserData,
  selectFavoriteOffers,
  selectActiveSortingOption,
  selectOffersByCity,
  selectOffersInCitySortedByOption,
  selectLimitedOffersNearby,
} from './selectors';
import { Cities } from '../mocks/cities';
import { getFakeOfferDetails } from '../utils/mock/get-fake-offer-details';
import { getFakeOffers } from '../utils/mock/get-fake-offers';
import { getFakeReviews } from '../utils/mock/get-fake-reviews';
import { getFakeUserData } from '../utils/mock/get-fake-user-data';
import { SortingOptionName } from '../enums';
import { MAX_NEARBY_OFFERS_COUNT } from '../const';
import { AuthorizationStatus } from '../enums';
import { AppThunkDispatch } from '../api/api-actions.test';
import { AnyAction } from '@reduxjs/toolkit';


const mockStore = configureMockStore<RootState, AnyAction, AppThunkDispatch>();

describe('Redux Selectors', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState: RootState;

  beforeEach(() => {
    initialState = {
      city: Cities[0],
      offers: {
        offers: getFakeOffers(),
        isOffersDataLoading: false,
        offersSortingOption: SortingOptionName.Popular,
      },
      nearOffers: {
        nearOffers: getFakeOffers(),
      },
      offerDetails: {
        offerDetails: getFakeOfferDetails(),
        isLoading: false,
      },
      offerComments: {
        offerComments: getFakeReviews(),
        commentSendingStatus: false,
      },
      auth: {
        authorizationStatus: AuthorizationStatus.Auth,
        userData: getFakeUserData(),
      },
      favoriteOffers: {
        favoriteOffers: getFakeOffers(),
      },
    };

    store = mockStore(initialState);
  });

  it('selectCity should return the current city', () => {
    const state = store.getState();
    const selectedCity = selectCity(state as RootState);
    expect(selectedCity).toEqual(initialState.city);
  });

  it('selectOffers should return all offers', () => {
    const state = store.getState();
    const offers = selectOffers(state as RootState);
    expect(offers).toEqual(initialState.offers.offers);
  });

  it('selectOffersNearby should return nearby offers', () => {
    const state = store.getState();
    const nearOffers = selectOffersNearby(state as RootState);
    expect(nearOffers).toEqual(initialState.nearOffers.nearOffers);
  });

  it('selectOffersDataLoadingStatus should return the loading status', () => {
    const state = store.getState();
    const isLoading = selectOffersDataLoadingStatus(state as RootState);
    expect(isLoading).toBe(initialState.offers.isOffersDataLoading);
  });

  it('selectOfferDetails should return offer details', () => {
    const state = store.getState();
    const offerDetails = selectOfferDetails(state as RootState);
    expect(offerDetails).toEqual(initialState.offerDetails.offerDetails);
  });

  it('selectOfferId should return the offer ID', () => {
    const state = store.getState();
    const offerId = selectOfferId(state as RootState);
    expect(initialState.offerDetails.offerDetails).not.toBe(undefined);
    expect(offerId).toBe(initialState.offerDetails.offerDetails?.id);
  });

  it('selectOfferReviews should return offer reviews', () => {
    const state = store.getState();
    const reviews = selectOfferReviews(state as RootState);
    expect(reviews).toEqual(initialState.offerComments.offerComments);
  });

  it('selectReviewSendingStatus should return the review sending status', () => {
    const state = store.getState();
    const status = selectReviewSendingStatus(state as RootState);
    expect(status).toBe(initialState.offerComments.commentSendingStatus);
  });

  it('selectAuthorizationStatus should return the authorization status', () => {
    const state = store.getState();
    const authStatus = selectAuthorizationStatus(state as RootState);
    expect(authStatus).toBe(initialState.auth.authorizationStatus);
  });

  it('selectUserData should return the user data', () => {
    const state = store.getState();
    const userData = selectUserData(state as RootState);
    expect(userData).toEqual(initialState.auth.userData);
  });

  it('selectFavoriteOffers should return favorite offers', () => {
    const state = store.getState();
    const favoriteOffers = selectFavoriteOffers(state as RootState);
    expect(favoriteOffers).toEqual(initialState.favoriteOffers.favoriteOffers);
  });

  it('selectActiveSortingOption should return the active sorting option', () => {
    const state = store.getState();
    const sortingOption = selectActiveSortingOption(state as RootState);
    expect(sortingOption).toBe(initialState.offers.offersSortingOption);
  });

  describe('Memoized Selectors', () => {
    describe('selectOffersByCity', () => {
      it('should filter offers by the current city', () => {
        const state = store.getState();
        const filteredOffers = selectOffersByCity(state as RootState);

        const expectedOffers = initialState.offers.offers.filter(
          (offer) => offer.city.name === initialState.city.name
        );

        expect(filteredOffers).toEqual(expectedOffers);
      });

      it('should return an empty array if there are no offers for the current city', () => {
        const updatedState = {
          ...initialState,
          city: Cities[5],
          offers: {
            ...initialState.offers,
            offers: [],
          },
        };

        store = mockStore(updatedState);
        const filteredOffers = selectOffersByCity(store.getState() as RootState);

        expect(filteredOffers).toEqual([]);
      });
    });

    describe('selectOffersInCitySortedByOption', () => {
      it('should sort offers by price (low to high)', () => {
        const updatedState = {
          ...initialState,
          offers: {
            ...initialState.offers,
            offersSortingOption: SortingOptionName.PriceLowHigh,
          },
        };

        store = mockStore(updatedState);
        const sortedOffers = selectOffersInCitySortedByOption(store.getState() as RootState);

        const expectedOffers = initialState.offers.offers
          .filter((offer) => offer.city.name === initialState.city.name)
          .sort((a, b) => a.price - b.price);

        expect(sortedOffers).toEqual(expectedOffers);
      });

      it('should sort offers by price (high to low)', () => {
        const updatedState = {
          ...initialState,
          offers: {
            ...initialState.offers,
            offersSortingOption: SortingOptionName.PriceHighLow,
          },
        };

        store = mockStore(updatedState);
        const sortedOffers = selectOffersInCitySortedByOption(store.getState() as RootState);

        const expectedOffers = initialState.offers.offers
          .filter((offer) => offer.city.name === initialState.city.name)
          .sort((a, b) => b.price - a.price);

        expect(sortedOffers).toEqual(expectedOffers);
      });

      it('should sort offers by top rated', () => {
        const updatedState = {
          ...initialState,
          offers: {
            ...initialState.offers,
            offersSortingOption: SortingOptionName.TopRated,
          },
        };

        store = mockStore(updatedState);
        const sortedOffers = selectOffersInCitySortedByOption(store.getState() as RootState);

        const expectedOffers = initialState.offers.offers
          .filter((offer) => offer.city.name === initialState.city.name)
          .sort((a, b) => b.rating - a.rating);

        expect(sortedOffers).toEqual(expectedOffers);
      });

      it('should return unsorted offers when sorting option is default', () => {
        const updatedState = {
          ...initialState,
          offers: {
            ...initialState.offers,
            offersSortingOption: SortingOptionName.Popular,
          },
        };

        store = mockStore(updatedState);
        const sortedOffers = selectOffersInCitySortedByOption(store.getState() as RootState);

        const expectedOffers = initialState.offers.offers.filter(
          (offer) => offer.city.name === initialState.city.name
        );

        expect(sortedOffers).toEqual(expectedOffers);
      });
    });

    describe('selectLimitedOffersNearby', () => {
      it('should return only a limited number of nearby offers', () => {
        const state = store.getState();
        const limitedOffers = selectLimitedOffersNearby(state as RootState);

        const expectedOffers = initialState.nearOffers.nearOffers.slice(
          0,
          MAX_NEARBY_OFFERS_COUNT
        );

        expect(limitedOffers).toEqual(expectedOffers);
      });

      it('should return all nearby offers if their count is less than MAX_NEARBY_OFFERS_COUNT', () => {
        const updatedState = {
          ...initialState,
          nearOffers: {
            nearOffers: initialState.nearOffers.nearOffers.slice(0, MAX_NEARBY_OFFERS_COUNT),
          },
        };

        store = mockStore(updatedState);
        const limitedOffers = selectLimitedOffersNearby(store.getState() as RootState);

        expect(limitedOffers).toEqual(updatedState.nearOffers.nearOffers);
      });

      it('should return an empty array if there are no nearby offers', () => {
        const updatedState = {
          ...initialState,
          nearOffers: {
            nearOffers: [],
          },
        };

        store = mockStore(updatedState);
        const limitedOffers = selectLimitedOffersNearby(store.getState() as RootState);

        expect(limitedOffers).toEqual([]);
      });
    });
  });
});
