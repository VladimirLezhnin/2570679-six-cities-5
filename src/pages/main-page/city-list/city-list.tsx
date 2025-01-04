import { City } from '../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { changeCity } from '../../../store/action';
import { RootState } from '../../..';


type CityListProps = {
    cities: City[];
}

function CityList({cities}: CityListProps) {
  const dispatch = useDispatch();
  const currentCity = useSelector((state: RootState) => state.city?.name);

  const handleCityClick = (city: City) => {
    dispatch(changeCity(city));
  };

  return (
    <section className="locations container">
      <ul className="locations__list tabs__list">
        {cities.map((city) => (
          <li key={city.name} className="locations__item">
            <a
              className={`locations__item-link tabs__item ${city.name === currentCity ? 'tabs__item--active' : ''
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
