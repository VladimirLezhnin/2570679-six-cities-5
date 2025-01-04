import { createAction } from '@reduxjs/toolkit';
import { City, Offer, OfferDetails, Review, UserData } from '../types';
import { AuthorizationStatus, SortingOption } from '../enums';

const Action = {
  CHANGE_CITY: 'CHANGE_CITY',
  CHANGE_OFFERS_SORTING: 'CHANGE_OFFERS_SORTING',
  SET_OFFERS_LOADING_STATUS: 'SET_OFFERS_LOADING_STATUS',
  SET_USER_DATA: 'SET_USER_DATA',
};

export const changeCity = createAction(Action.CHANGE_CITY, (value: City) => ({
  payload: value,
}));

export const changeOffersSortingOption = createAction(Action.CHANGE_OFFERS_SORTING, (value: SortingOption) => ({
  payload: value,
}));

export const setOffersLoadingStatus = createAction(Action.SET_OFFERS_LOADING_STATUS, (value: boolean) => ({
  payload: value,
}));
