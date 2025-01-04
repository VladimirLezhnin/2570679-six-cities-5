import { createSlice } from '@reduxjs/toolkit';
import { setUserDataAction } from './action';
import { UserData } from '../types';

interface UserDataState {
  userData: UserData | undefined;
};

const initialState: UserDataState = {
  userData: undefined,
};

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setUserDataAction, (state, action) => {
      state.userData = action.payload;
    });
  },
});

export default userDataSlice.reducer;
