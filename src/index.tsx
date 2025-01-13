import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createAPI } from './api/api';
import { checkAuthAction, fetchFavoriteOffers } from './api/api-actions';
import rootReducer from './store/root-reducer';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import HistoryRouter from './hocs/history-route/history-route';
import browserHistory from './history';


export const api = createAPI();
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

store.dispatch(checkAuthAction());
store.dispatch(fetchFavoriteOffers());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HistoryRouter history={browserHistory}>
        <ToastContainer
          position="bottom-left"
          closeOnClick
          pauseOnHover
        />
        <App />
      </HistoryRouter>
    </Provider>
  </React.StrictMode>
);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
