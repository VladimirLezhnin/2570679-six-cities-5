import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthData, Offer, OfferDetails, Review, UserData } from '../types.js';
import { saveToken, dropToken } from '../api/token.js';
import { APIRoute, AppRoute } from '../enums.js';
import { AppDispatch, RootState } from '../index.js';
import { navigateTo } from '../utils/navigate/navigate-to.js';


export const checkAuthAction = createAsyncThunk<UserData, undefined, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<UserData>(APIRoute.Login);
    saveToken(data.token);
    return data;
  },
);

export const loginAction = createAsyncThunk<UserData, AuthData, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'user/login',
  async ({ email, password }, { extra: api }) => {
    const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
    saveToken(data.token);
    return data;
  },
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'user/logout',
  async (_arg, { extra: api }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
  },
);

export const fetchOffers = createAsyncThunk<Offer[], undefined, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'data/fetchOffers',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Offers);
    return data;
  },
);

export const fetchOfferDetails = createAsyncThunk<OfferDetails | undefined, string, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'data/fetchOfferDetails',
  async (offerId, { extra: api }) => {
    try {
      const { data } = await api.get<OfferDetails>(APIRoute.Offer.replace(':offerId', offerId));
      return data;
    } catch {
      navigateTo(AppRoute.NotFoundPage);
      return undefined;
    }
  }
);

export const fetchNearOffers = createAsyncThunk<Offer[], string, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'data/fetchNearOffers',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.OffersNearby.replace(':offerId', offerId));
    return data;
  }
);

export const sendComment = createAsyncThunk<Review, { offerId: string; comment: string; rating: number }, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'data/sendComment',
  async ({ offerId, comment, rating }, { extra: api }) => {
    const { data } = await api.post<Review>(APIRoute.Comments.replace(':offerId', offerId), { comment, rating });
    return data;
  }
);

export const fetchOfferComments = createAsyncThunk<Review[], string, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'data/fetchOfferComments',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Review[]>(APIRoute.Comments.replace(':offerId', offerId));
    return data;
  }
);

export const fetchFavoriteOffers = createAsyncThunk<Offer[], undefined, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'data/fetchFavoriteOffers',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Favorite);
    return data;
  }
);

export const addOfferToFavorites = createAsyncThunk<Offer, string, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'data/addOfferToFavorites',
  async (offerId, { extra: api }) => {
    const { data } = await api.post<Offer>(APIRoute.ChangeOfferStatus.replace(':offerId', offerId).replace(':status', '1'));
    return data;
  }
);

export const removeOfferFromFavorites = createAsyncThunk<Offer, string, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'data/removeOfferFromFavorites',
  async (offerId, { extra: api }) => {
    const { data } = await api.post<Offer>(APIRoute.ChangeOfferStatus.replace(':offerId', offerId).replace(':status', '0'));
    return data;
  }
);
