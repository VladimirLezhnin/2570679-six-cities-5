import * as tokenStorage from './token';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  checkAuthAction,
  loginAction,
  logoutAction,
  fetchOffers,
  fetchOfferDetails,
  fetchNearOffers,
  sendComment,
  fetchOfferComments,
  fetchFavoriteOffers,
  addOfferToFavorites,
  removeOfferFromFavorites,
} from './api-actions';
import { Action, AnyAction } from '@reduxjs/toolkit';
import { APIRoute, AuthorizationStatus, SortingOptionName } from '../enums';
import { RootState } from '../index';
import { getFakeReviews } from '../utils/mock/get-fake-reviews';
import { getFakeUserData } from '../utils/mock/get-fake-user-data';
import { getFakeOfferDetails } from '../utils/mock/get-fake-offer-details';
import { getFakeOffers } from '../utils/mock/get-fake-offers';
import { AuthData, Offer, OfferDetails, Review, UserData } from '../types';
import { createAPI } from './api';


export type AppThunkDispatch = ThunkDispatch<RootState, AxiosInstance, AnyAction>;
const extractActionsTypes = (actions: Action<string>[]) => actions.map((action: Action<string>) => action.type);

describe('Async actions', () => {
  const api: AxiosInstance = createAPI();
  const mockAxios = new MockAdapter(api);
  const middlewares = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<RootState, AnyAction, AppThunkDispatch>(middlewares);

  const storeInitialState = {
    offers: {
      offers: [],
      isOffersDataLoading: false,
      offersSortingOption: SortingOptionName.Popular,
    },
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 13,
      },
    },
    auth: {
      authorizationStatus: AuthorizationStatus.Unknown,
      userData: undefined,
    },
    offerDetails: {
      offerDetails: undefined,
    },
    nearOffers: {
      nearOffers: [],
    },
    offerComments: {
      offerComments: [],
    },
    favoriteOffers: {
      favoriteOffers: [],
    }
  };

  let store = mockStoreCreator(storeInitialState);

  beforeEach(() => {
    store = mockStoreCreator(storeInitialState);
  });

  afterEach(() => {
    store.clearActions();
    mockAxios.reset();
    vi.resetAllMocks();
  });

  describe('checkAuthAction', () => {
    it('should dispatch "checkAuth/pending" and "checkAuth/fulfilled" upon successful authorization check', async () => {
      const fakeUserData: UserData = getFakeUserData();
      mockAxios.onGet(APIRoute.Login).reply(200, fakeUserData);
      const mockSaveToken = vi.spyOn(tokenStorage, 'saveToken');

      await store.dispatch(checkAuthAction());

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        checkAuthAction.pending.type,
        checkAuthAction.fulfilled.type,
      ]);
      expect(actions[1].payload).toEqual(fakeUserData);
      expect(mockSaveToken).toHaveBeenCalledWith(fakeUserData.token);
    });

    it('should dispatch "checkAuth/pending" and "checkAuth/rejected" when authorization check fails', async () => {
      mockAxios.onGet(APIRoute.Login).reply(401);
      const mockSaveToken = vi.spyOn(tokenStorage, 'saveToken');

      await store.dispatch(checkAuthAction());

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        checkAuthAction.pending.type,
        checkAuthAction.rejected.type,
      ]);
      expect(mockSaveToken).not.toHaveBeenCalled();
    });
  });

  describe('loginAction', () => {
    it('should dispatch "login/pending" and "login/fulfilled" and save the token upon successful login', async () => {
      const fakeAuthData: AuthData = { email: 'john@example.com', password: 'password123' };
      const fakeUserData: UserData = getFakeUserData();
      mockAxios.onPost(APIRoute.Login, { email: fakeAuthData.email, password: fakeAuthData.password }).reply(200, fakeUserData);
      const mockSaveToken = vi.spyOn(tokenStorage, 'saveToken');

      await store.dispatch(loginAction(fakeAuthData));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        loginAction.pending.type,
        loginAction.fulfilled.type,
      ]);
      expect(actions[1].payload).toEqual(fakeUserData);
      expect(mockSaveToken).toHaveBeenCalledWith(fakeUserData.token);
    });

    it('should dispatch "login/pending" and "login/rejected" when login fails', async () => {
      const fakeAuthData: AuthData = { email: 'john@example.com', password: 'wrongpassword' };
      mockAxios.onPost(APIRoute.Login, { email: fakeAuthData.email, password: fakeAuthData.password }).reply(401);
      const mockSaveToken = vi.spyOn(tokenStorage, 'saveToken');

      await store.dispatch(loginAction(fakeAuthData));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        loginAction.pending.type,
        loginAction.rejected.type,
      ]);
      expect(mockSaveToken).not.toHaveBeenCalled();
    });
  });

  describe('logoutAction', () => {
    it('should dispatch "logout/pending" and "logout/fulfilled" and delete the token upon successful logout', async () => {
      mockAxios.onDelete(APIRoute.Logout).reply(204);
      const mockDropToken = vi.spyOn(tokenStorage, 'dropToken');
      await store.dispatch(logoutAction());

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        logoutAction.pending.type,
        logoutAction.fulfilled.type,
      ]);
      expect(mockDropToken).toHaveBeenCalledTimes(1);
    });

    it('should dispatch "logout/pending" and "logout/rejected" on logout error', async () => {
      mockAxios.onDelete(APIRoute.Logout).reply(500);
      const mockDropToken = vi.spyOn(tokenStorage, 'dropToken');

      await store.dispatch(logoutAction());

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        logoutAction.pending.type,
        logoutAction.rejected.type,
      ]);
      expect(mockDropToken).not.toHaveBeenCalled();
    });
  });

  describe('fetchOffers', () => {
    it('should dispatch "fetchOffers/pending" and "fetchOffers/fulfilled" on successful request', async () => {
      const fakeOffers: Offer[] = getFakeOffers();
      mockAxios.onGet(APIRoute.Offers).reply(200, fakeOffers);

      await store.dispatch(fetchOffers());

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        fetchOffers.pending.type,
        fetchOffers.fulfilled.type,
      ]);
      expect(actions[1].payload).toEqual(fakeOffers);
    });

    it('should dispatch "fetchOffers/pending" and "fetchOffers/rejected" when the request fails', async () => {
      mockAxios.onGet(APIRoute.Offers).reply(500);

      await store.dispatch(fetchOffers());

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        fetchOffers.pending.type,
        fetchOffers.rejected.type,
      ]);
    });
  });

  describe('fetchOfferDetails', () => {
    it('should dispatch "fetchOfferDetails/pending" and "fetchOfferDetails/fulfilled" when requesting offer details successfully', async () => {
      const offerId = '1';
      const fakeOfferDetails: OfferDetails = getFakeOfferDetails();
      mockAxios.onGet(APIRoute.Offer.replace(':offerId', offerId)).reply(200, fakeOfferDetails);

      await store.dispatch(fetchOfferDetails(offerId));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        fetchOfferDetails.pending.type,
        fetchOfferDetails.fulfilled.type,
      ]);
      expect(actions[1].payload).toEqual(fakeOfferDetails);
    });

    it('should dispatch "fetchOfferDetails/pending" and "fetchOfferDetails/rejected" when requesting offer details fails', async () => {
      const offerId = '1';
      mockAxios.onGet(APIRoute.Offer.replace(':offerId', offerId)).reply(404);
      await store.dispatch(fetchOfferDetails(offerId));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        fetchOfferDetails.pending.type,
        fetchOfferDetails.rejected.type,
      ]);
    });
  });

  describe('fetchNearOffers', () => {
    it('should dispatch "fetchNearOffers/pending" and "fetchNearOffers/fulfilled" upon successful request for close offers', async () => {
      const offerId = '1';
      const fakeNearOffers: Offer[] = getFakeOffers();
      mockAxios.onGet(APIRoute.OffersNearby.replace(':offerId', offerId)).reply(200, fakeNearOffers);

      await store.dispatch(fetchNearOffers(offerId));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        fetchNearOffers.pending.type,
        fetchNearOffers.fulfilled.type,
      ]);
      expect(actions[1].payload).toEqual(fakeNearOffers);
    });

    it('should dispatch "fetchNearOffers/pending" and "fetchNearOffers/rejected" when requesting near offers fails', async () => {
      const offerId = '1';
      mockAxios.onGet(APIRoute.OffersNearby.replace(':offerId', offerId)).reply(500);
      await store.dispatch(fetchNearOffers(offerId));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        fetchNearOffers.pending.type,
        fetchNearOffers.rejected.type,
      ]);
    });
  });

  describe('sendComment', () => {
    it('should dispatch "sendComment/pending" and "sendComment/fulfilled" when a comment is sent successfully', async () => {
      const offerId = '1';
      const commentData = { comment: 'Great place!', rating: 5 };
      const fakeReview: Review = getFakeReviews()[0];
      mockAxios.onPost(APIRoute.Comments.replace(':offerId', offerId)).reply(201, fakeReview);

      await store.dispatch(sendComment({ offerId, comment: commentData.comment, rating: commentData.rating }));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        sendComment.pending.type,
        sendComment.fulfilled.type,
      ]);
      expect(actions[1].payload).toEqual(fakeReview);
    });

    it('should dispatch "sendComment/pending" and "sendComment/rejected" when sending a comment fails', async () => {
      const offerId = '1';
      const commentData = { comment: 'Great place!', rating: 5 };
      mockAxios.onPost(APIRoute.Comments.replace(':offerId', offerId)).reply(400);

      await store.dispatch(sendComment({ offerId, comment: commentData.comment, rating: commentData.rating }));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        sendComment.pending.type,
        sendComment.rejected.type,
      ]);
    });
  });

  describe('fetchOfferComments', () => {
    it('should dispatch "fetchOfferComments/pending" and "fetchOfferComments/fulfilled" upon successful comment request', async () => {
      const offerId = '1';
      const fakeComments: Review[] = getFakeReviews();
      mockAxios.onGet(APIRoute.Comments.replace(':offerId', offerId)).reply(200, fakeComments);

      await store.dispatch(fetchOfferComments(offerId));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        fetchOfferComments.pending.type,
        fetchOfferComments.fulfilled.type,
      ]);
      expect(actions[1].payload).toEqual(fakeComments);
    });

    it('should dispatch "fetchOfferComments/pending" and "fetchOfferComments/rejected" when comment request fails', async () => {
      const offerId = '1';
      mockAxios.onGet(APIRoute.Comments.replace(':offerId', offerId)).reply(500);
      await store.dispatch(fetchOfferComments(offerId));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        fetchOfferComments.pending.type,
        fetchOfferComments.rejected.type,
      ]);
    });
  });

  describe('fetchFavoriteOffers', () => {
    it('should dispatch "fetchFavoriteOffers/pending" and "fetchFavoriteOffers/fulfilled" upon successful request for favorite offers', async () => {
      const fakeFavoriteOffers: Offer[] = getFakeOffers();
      mockAxios.onGet(APIRoute.Favorite).reply(200, fakeFavoriteOffers);

      await store.dispatch(fetchFavoriteOffers());

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        fetchFavoriteOffers.pending.type,
        fetchFavoriteOffers.fulfilled.type,
      ]);
      expect(actions[1].payload).toEqual(fakeFavoriteOffers);
    });

    it('should dispatch "fetchFavoriteOffers/pending" and "fetchFavoriteOffers/rejected" when requesting favorite offers fails', async () => {
      mockAxios.onGet(APIRoute.Favorite).reply(500);

      await store.dispatch(fetchFavoriteOffers());

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        fetchFavoriteOffers.pending.type,
        fetchFavoriteOffers.rejected.type,
      ]);
    });
  });

  describe('addOfferToFavorites', () => {
    it('should dispatch "addOfferToFavorites/pending" and "addOfferToFavorites/fulfilled" upon successful adding to favorites', async () => {
      const offerId = '1';
      const fakeOffer: Offer = getFakeOffers()[0];
      mockAxios
        .onPost(APIRoute.ChangeOfferStatus.replace(':offerId', offerId).replace(':status', '1'))
        .reply(200, fakeOffer);

      await store.dispatch(addOfferToFavorites(offerId));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        addOfferToFavorites.pending.type,
        addOfferToFavorites.fulfilled.type,
      ]);

      expect(actions[1].payload).toEqual(fakeOffer);
    });

    it('should dispatch "addOfferToFavorites/pending" and "addOfferToFavorites/rejected" when adding to favorites fails', async () => {
      const offerId = '1';
      mockAxios
        .onPost(APIRoute.ChangeOfferStatus.replace(':offerId', offerId).replace(':status', '1'))
        .reply(500);

      await store.dispatch(addOfferToFavorites(offerId));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        addOfferToFavorites.pending.type,
        addOfferToFavorites.rejected.type,
      ]);
    });
  });

  describe('removeOfferFromFavorites', () => {
    it('should dispatch "removeOfferFromFavorites/pending" and "removeOfferFromFavorites/fulfilled" upon successful removal from favorites', async () => {
      const offerId = '1';
      const fakeOffer: Offer = getFakeOffers()[0];
      mockAxios
        .onPost(APIRoute.ChangeOfferStatus.replace(':offerId', offerId).replace(':status', '0'))
        .reply(200, fakeOffer);

      await store.dispatch(removeOfferFromFavorites(offerId));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        removeOfferFromFavorites.pending.type,
        removeOfferFromFavorites.fulfilled.type,
      ]);
      expect(actions[1].payload).toEqual(fakeOffer);
    });

    it('should dispatch "removeOfferFromFavorites/pending" and "removeOfferFromFavorites/rejected" when deleting from favorites fails', async () => {
      const offerId = '1';
      mockAxios
        .onPost(APIRoute.ChangeOfferStatus.replace(':offerId', offerId).replace(':status', '0'))
        .reply(500);

      await store.dispatch(removeOfferFromFavorites(offerId));

      const actions = store.getActions();
      const actionTypes = extractActionsTypes(actions);

      expect(actionTypes).toEqual([
        removeOfferFromFavorites.pending.type,
        removeOfferFromFavorites.rejected.type,
      ]);
    });
  });
});
