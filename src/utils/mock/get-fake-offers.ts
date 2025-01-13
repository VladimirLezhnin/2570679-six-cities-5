import { Offer } from '../../types';
import { name, internet } from 'faker';
import { Cities } from '../../mocks/cities';

export function getFakeOffers(): Offer[] {
  return [
    {
      id: internet.mac(),
      title: 'Cozy Studio',
      type: name.jobType(),
      price: 12345,
      previewImage: internet.avatar(),
      city: Cities[0],
      location: Cities[0].location,
      isFavorite: true,
      isPremium: false,
      rating: 100
    },
    {
      id: '4',
      title: 'House',
      type: name.jobType(),
      price: 48438,
      previewImage: internet.avatar(),
      city: Cities[0],
      location: Cities[0].location,
      isFavorite: true,
      isPremium: false,
      rating: 200
    },
    {
      id: '5',
      title: 'Perfect place',
      type: name.jobType(),
      price: 94904,
      previewImage: internet.avatar(),
      city: Cities[0],
      location: Cities[0].location,
      isFavorite: true,
      isPremium: false,
      rating: 300
    }];
}
