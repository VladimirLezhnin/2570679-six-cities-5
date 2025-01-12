import { City } from '../../../types';
import { changeCity } from '../../../store/action';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { selectCity } from '../../../store/selectors';


type CityListProps = {
    cities: City[];
}

function CityList({cities}: CityListProps) {
  const dispatch = useAppDispatch();
  const currentCity = useAppSelector(selectCity);

  const handleCityClick = (city: City) => {
    dispatch(changeCity(city));
  };

  return (
    <section className="locations container">
      <ul className="locations__list tabs__list">
        {cities.map((city) => (
          <li key={city.name} className="locations__item">
            <a
              className={`locations__item-link tabs__item ${city.name === currentCity.name ? 'tabs__item--active' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleCityClick(city);
              }}
            >
              <span>{city.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CityList;
