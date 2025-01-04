import OfferCard from './offer-card/offer-card';
import { Offer } from '../../types';

type OffersListProps = {
    offers: Offer[];
    setActiveOfferCardId: React.Dispatch<React.SetStateAction<string>>;
};

function OffersList({offers, setActiveOfferCardId}: OffersListProps) {
  return (
    <>
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          setActiveOfferCardId={setActiveOfferCardId}
        />
      ))}
    </>
  );
}

export default OffersList;
