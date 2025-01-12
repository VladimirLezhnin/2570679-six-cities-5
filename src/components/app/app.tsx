import FavoritesPage from '../../pages/favorites/favorites';
import MainPage from '../../pages/main-page/main-page';
import Login from '../../pages/login/login';
import OfferPage from '../../pages/offer/offer';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppRoute } from '../../enums';
import PrivateRoute from '../../hocs/private-route/private-route';
import NavigationProvider from '../navigation-provider/navigation-provider';


function App() {
  return (
    <BrowserRouter>
      <NavigationProvider />
      <Routes>
        <Route
          path={AppRoute.Root}
          element={<MainPage />}
        />
        <Route
          path={AppRoute.Login}
          element={<Login />}
        />
        <Route
          path={AppRoute.Favorites}
          element=
            {
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
        />
        <Route
          path={AppRoute.Offer}
          element={<OfferPage />}
        >
        </Route>
        <Route
          path="*"
          element={<Navigate to={AppRoute.NotFoundPage} replace />}
        />
        <Route
          path={AppRoute.NotFoundPage}
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
