import { createSlice } from '@reduxjs/toolkit';
import { checkAuthAction, loginAction, logoutAction,  } from '../api/api-actions';
import { AuthorizationStatus } from '../enums';
import { UserData } from '../types';

interface AuthState {
  userData: UserData | undefined;
  authorizationStatus: AuthorizationStatus;
};

const initialState: AuthState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  userData: undefined
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.authorizationStatus = AuthorizationStatus.Auth;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.authorizationStatus = AuthorizationStatus.Auth;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.userData = undefined;
        state.authorizationStatus = AuthorizationStatus.NoAuth
      });
  },
});

export default authSlice.reducer;
