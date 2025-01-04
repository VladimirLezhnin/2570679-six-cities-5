import { AuthorizationStatus, SortingOption } from '../enums';
import { City, Offer, OfferDetails, Review, UserData } from '../types';

export type CityState = {
  city: City;
};

export type OffersState = {
  offers: Offer[];
  nearOffers: Offer[];
  offerDetails: OfferDetails | undefined;
  offerComments: Review[];
};

export type SortingState = {
  sortingOption: SortingOption;
};

export type AuthState = {
  authorizationStatus: AuthorizationStatus;
  userData: UserData | undefined;
};

export type LoadingState = {
  isOffersDataLoading: boolean;
};
