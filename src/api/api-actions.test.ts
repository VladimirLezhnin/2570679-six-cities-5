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
import { APIRoute, AuthorizationStatus, SortingOption } from '../enums';
import { RootState } from '../index';
import { getFakeOffers } from '../utils/mock/getFakeOffers';
import { getFakeUserData } from '../utils/mock/getFakeUserData';
import { getFakeOfferDetails } from '../utils/mock/getFakeOfferDetails';
import { getFakeReviews } from '../utils/mock/getFakeReviews';
import { AuthData, Offer, OfferDetails, Review, UserData } from '../types';
import { createAPI } from './api';

type AppThunkDispatch = ThunkDispatch<RootState, AxiosInstance, AnyAction>;
const extractActionsTypes = (actions: Action[]) => actions.map(action => action.type);

describe('Async actions', () => {
    const api: AxiosInstance = createAPI();
    const mockAxios = new MockAdapter(api);
    const middlewares = [thunk.withExtraArgument(api)];
    const mockStoreCreator = configureMockStore<RootState, AnyAction, AppThunkDispatch>(middlewares);

    let store = mockStoreCreator({
        offers: {
            offers: [],
            isOffersDataLoading: false,
            offersSortingOption: SortingOption.Popular,
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
        favoritesOffers: {
            favoriteOffers: [],
        }
    });

    beforeEach(() => {
        store = mockStoreCreator({
            offers: {
                offers: [],
                isOffersDataLoading: false,
                offersSortingOption: SortingOption.Popular,
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
            favoritesOffers: {
                favoriteOffers: [],
            }
        });
    });

    afterEach(() => {
        store.clearActions();
        mockAxios.reset();
        vi.resetAllMocks();
    });

    describe('checkAuthAction', () => {
        it('должен диспатчить "checkAuth/pending" и "checkAuth/fulfilled" при успешной проверке авторизации', async () => {
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

        it('должен диспатчить "checkAuth/pending" и "checkAuth/rejected" при ошибке проверки авторизации', async () => {
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
        it('должен диспатчить "login/pending" и "login/fulfilled" и сохранять токен при успешном логине', async () => {
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

        it('должен диспатчить "login/pending" и "login/rejected" при неудачном логине', async () => {
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
        it('должен диспатчить "logout/pending" и "logout/fulfilled" и удалять токен при успешном логауте', async () => {
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

        it('должен диспатчить "logout/pending" и "logout/rejected" при ошибке логаута', async () => {
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
        it('должен диспатчить "fetchOffers/pending" и "fetchOffers/fulfilled" при успешном запросе', async () => {
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

        it('должен диспатчить "fetchOffers/pending" и "fetchOffers/rejected" при ошибке запроса', async () => {
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
        it('должен диспатчить "fetchOfferDetails/pending" и "fetchOfferDetails/fulfilled" при успешном запросе деталей предложения', async () => {
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

        it('должен диспатчить "fetchOfferDetails/pending" и "fetchOfferDetails/rejected" при ошибке запроса деталей предложения', async () => {
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
        it('должен диспатчить "fetchNearOffers/pending" и "fetchNearOffers/fulfilled" при успешном запросе близких предложений', async () => {
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

        it('должен диспатчить "fetchNearOffers/pending" и "fetchNearOffers/rejected" при ошибке запроса близких предложений', async () => {
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
        it('должен диспатчить "sendComment/pending" и "sendComment/fulfilled" при успешной отправке комментария', async () => {
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

        it('должен диспатчить "sendComment/pending" и "sendComment/rejected" при ошибке отправки комментария', async () => {
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
        it('должен диспатчить "fetchOfferComments/pending" и "fetchOfferComments/fulfilled" при успешном запросе комментариев', async () => {
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

        it('должен диспатчить "fetchOfferComments/pending" и "fetchOfferComments/rejected" при ошибке запроса комментариев', async () => {
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
        it('должен диспатчить "fetchFavoriteOffers/pending" и "fetchFavoriteOffers/fulfilled" при успешном запросе избранных предложений', async () => {
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

        it('должен диспатчить "fetchFavoriteOffers/pending" и "fetchFavoriteOffers/rejected" при ошибке запроса избранных предложений', async () => {
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
        it('должен диспатчить "addOfferToFavorites/pending" и "addOfferToFavorites/fulfilled" при успешном добавлении в избранное', async () => {
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

        it('должен диспатчить "addOfferToFavorites/pending" и "addOfferToFavorites/rejected" при ошибке добавления в избранное', async () => {
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
        it('должен диспатчить "removeOfferFromFavorites/pending" и "removeOfferFromFavorites/fulfilled" при успешном удалении из избранного', async () => {
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

        it('должен диспатчить "removeOfferFromFavorites/pending" и "removeOfferFromFavorites/rejected" при ошибке удаления из избранного', async () => {
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
