import { SortingOptionName } from '../enums';
import { Offer } from '../types';

export function sortOffersByOption(offers: Offer[], option: SortingOptionName) {
  switch (option) {
    case SortingOptionName.PriceLowHigh:
      return [...offers].sort((a, b) => a.price - b.price);
    case SortingOptionName.PriceHighLow:
      return [...offers].sort((a, b) => b.price - a.price);
    case SortingOptionName.TopRated:
      return [...offers].sort((a, b) => b.rating - a.rating);
    default:
      return offers;
  }
}
