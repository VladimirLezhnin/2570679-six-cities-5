import React, { useEffect, useState } from 'react';
import { loginAction } from '../../api/api-actions';
import { Link } from 'react-router-dom';
import Header from '../../components/header/header';
import { AppRoute, AuthorizationStatus } from '../../enums';
import { navigateTo } from '../../utils/navigate/navigate-to';
import { changeCity } from '../../store/action';
import { Cities } from '../../mocks/cities';
import { getRandomIntegerInRange } from '../../helpers/get-random-integer-in-range';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { useAppSelector } from '../../hooks/use-app-selector';
import { selectAuthorizationStatus } from '../../store/selectors';


function Login() {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city] = useState(Cities[getRandomIntegerInRange(0, Cities.length - 1)]);

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      navigateTo(AppRoute.Root);
    }
  }, [authorizationStatus]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(loginAction({ email, password }));
  };

  const handleCityButtonClick = () => {
    dispatch(changeCity(city));
  };

  return (
    <div className="page page--gray page--login">
      <Header />
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" onSubmit={handleSubmit} aria-label="form">
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden" htmlFor="email">E-mail</label>
                <input
                  className="login__input form__input"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden" htmlFor="password">Password</label>
                <input
                  className="login__input form__input"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  pattern="^(?=.*[A-Za-z])(?=.*\d).+$"
                  title="Password must contain at least one letter and one number."
                />
              </div>
              <button className="login__submit form__submit button" type="submit">
                Sign in
              </button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <Link className="locations__item-link"
                to="/"
                onClick={handleCityButtonClick}
              >
                <span>{city.name}</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;
