import { createAction } from '@reduxjs/toolkit';
import { City, OfferDetails } from '../types';
import { SortingOption } from '../enums';

const Action = {
  CHANGE_CITY: 'CHANGE_CITY',
  CHANGE_OFFERS_SORTING: 'CHANGE_OFFERS_SORTING',
  SET_OFFERS_LOADING_STATUS: 'SET_OFFERS_LOADING_STATUS',
  SET_OFFER_DETAILS: 'SET_OFFER_DETAILS'
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

export const setOfferDetails = createAction(Action.SET_OFFER_DETAILS, (value: OfferDetails) => ({
  payload: value,
}));
