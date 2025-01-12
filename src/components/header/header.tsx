import { Link } from 'react-router-dom';
import { AuthorizationStatus } from '../../enums';
import { logoutAction } from '../../api/api-actions';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { useAppSelector } from '../../hooks/use-app-selector';
import { selectAuthorizationStatus, selectFavoriteOffers, selectUserData } from '../../store/selectors';


function Header() {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const userData = useAppSelector(selectUserData);
  const favorites = useAppSelector(selectFavoriteOffers);

  const handleSignoutButtonClick = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(logoutAction());
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link className="header__logo-link" to={'/'}>
              <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
            </Link>
          </div>
          <nav className="header__nav">
            {authorizationStatus === AuthorizationStatus.Auth
              ?
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <Link className="header__nav-link header__nav-link--profile" to={'/favorites'}>
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">{userData?.email}</span>
                    <span className="header__favorite-count">{favorites.length}</span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link to="#" className="header__nav-link" onClick={handleSignoutButtonClick}>
                    <span className="header__signout">Sign out</span>
                  </Link>
                </li>
              </ul>
              :
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <Link className="header__nav-link header__nav-link--profile" to={'/'}>
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                  </Link>
                  <Link className="header__nav-link" to='/login'>
                    <span className="header__login">Sign in</span>
                  </Link>
                </li>
              </ul>}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
