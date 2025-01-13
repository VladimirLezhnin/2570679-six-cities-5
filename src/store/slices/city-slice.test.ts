import cityReducer, { CityState } from './city-slice';
import { changeCity } from '../action';
import { City } from '../../types';
import { Cities } from '../../mocks/cities';

describe('citySlice', () => {
  const initialState: CityState = {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 13,
    },
  };

  it('should return the initial state', () => {
    expect(cityReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle changeCity', () => {
    const newCity: City = Cities[1];
    const action = { type: changeCity.type, payload: newCity };
    const state = cityReducer(initialState, action);

    expect(state).toEqual({
      name: newCity.name,
      location: newCity.location,
    });
  });
});
