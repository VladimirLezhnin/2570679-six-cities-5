import {Navigate} from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../enums';
import { PropsWithChildren, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../..';
import { checkAuthAction } from '../../api/api-actions';

type PrivateRouteProps = PropsWithChildren;

function PrivateRoute({children}: PrivateRouteProps) {
  const dispatch = useDispatch<AppDispatch>();
  dispatch(checkAuthAction());
  const authorizationStatus = useSelector((state: RootState) => state.auth.authorizationStatus);
  useEffect(() => {
    dispatch(checkAuthAction());
  }, [dispatch, authorizationStatus]);

  return (
    authorizationStatus === AuthorizationStatus.Auth
      ? children
      : <Navigate to={AppRoute.Login} />
  );
}

export default PrivateRoute;
