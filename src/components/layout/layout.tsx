import Header from '../header/header';
import Footer from '../footer/footer';
import { PropsWithChildren } from 'react';
import { AppRoute } from '../../enums';
import { useLocation } from 'react-router-dom';


function isValueInEnum(value: string, enumObj: object): boolean {
  return Object.values(enumObj).includes(value);
}

function Layout({ children } : PropsWithChildren) {
  const location = useLocation();
  const isExistentAppRoute = isValueInEnum(location.pathname, AppRoute);
  const isNotFoundPage = location.pathname === AppRoute.NotFoundPage.toString();
  const isOfferPage = location.pathname.startsWith(AppRoute.Offer.split(':')[0]);

  return (
    <div className="layout">
      {(isExistentAppRoute || isOfferPage) && !isNotFoundPage && <Header/>}
      <main>{children}</main>
    </div>
  );
}

export default Layout;
