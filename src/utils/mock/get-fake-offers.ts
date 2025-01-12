import { Offer } from '../../types';
import { name, internet } from 'faker';
import { Cities } from '../../mocks/cities';

export function getFakeOffers(): Offer[] {
  return [
    {
      id: internet.mac(),
      title: name.title(),
      type: name.jobType(),
      price: 12345,
      previewImage: internet.avatar(),
      city: Cities[0],
      location: Cities[0].location,
      isFavorite: true,
      isPremium: true,
      rating: 100
    }];
}
