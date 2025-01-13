import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer, { AuthState } from './auth-slice';
import { checkAuthAction, loginAction, logoutAction } from '../../api/api-actions';
import { AuthorizationStatus, AppRoute } from '../../enums';
import { UserData } from '../../types';
import { getFakeUserData } from '../../utils/mock/get-fake-user-data';

vi.mock('../../../utils/navigate/navigate-to', () => ({
  navigateTo: vi.fn(),
}));

import { navigateTo, setNavigateFunction } from '../../utils/navigate/navigate-to';

describe('authSlice', () => {
  const initialState: AuthState = {
    authorizationStatus: AuthorizationStatus.Unknown,
    userData: undefined,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle checkAuthAction.fulfilled', () => {
    const mockUserData: UserData = getFakeUserData();
    const action = { type: checkAuthAction.fulfilled.type, payload: mockUserData };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      authorizationStatus: AuthorizationStatus.Auth,
      userData: mockUserData,
    });
  });
  
  it('should handle logoutAction.fulfilled', () => {
    const populatedState: AuthState = {
      authorizationStatus: AuthorizationStatus.Auth,
      userData: getFakeUserData(),
    };
    const action = { type: logoutAction.fulfilled.type };
    const state = authReducer(populatedState, action);

    expect(state).toEqual({
      authorizationStatus: AuthorizationStatus.NoAuth,
      userData: undefined,
    });
  });
});
