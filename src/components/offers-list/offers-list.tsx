import OfferCard from './offer-card/offer-card';
import { Offer } from '../../types';

type OffersListProps = {
    offers: Offer[];
    onMouseOverOffer: React.Dispatch<React.SetStateAction<string>>;
};

function OffersList({offers, onMouseOverOffer: onMouseOverOffer}: OffersListProps) {
  return (
    <>
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onMouseOver={onMouseOverOffer}
        />
      ))}
    </>
  );
}

export default OffersList;
