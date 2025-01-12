import { Navigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../enums';
import { PropsWithChildren, useEffect } from 'react';
import { checkAuthAction } from '../../api/api-actions';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { useAppSelector } from '../../hooks/use-app-selector';
import { selectAuthorizationStatus } from '../../store/selectors';

type PrivateRouteProps = PropsWithChildren;

function PrivateRoute({ children }: PrivateRouteProps) {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  useEffect(() => {
    dispatch(checkAuthAction());
  }, [dispatch]);

  return (
    authorizationStatus === AuthorizationStatus.Auth
      ? children
      : <Navigate to={AppRoute.Login} />
  );
}


export default PrivateRoute;
