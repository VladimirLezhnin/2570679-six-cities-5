import { v4 as uuidv4 } from 'uuid';
import './offers-loader.css';

type OffersLoaderProps = {
    count: number;
};

function OffersLoader({ count }: OffersLoaderProps) {
  const numbers = Array.from({ length: count }, () => uuidv4());

  return (
    <>
      {numbers.map((item) => (
        <div key={item} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text skeleton-title"></div>
          <div className="skeleton-text skeleton-description"></div>
          <div className="skeleton-text skeleton-price"></div>
        </div>
      ))}
    </>
  );
}

export default OffersLoader;
