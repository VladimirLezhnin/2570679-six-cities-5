import './skeleton.css';

type SkeletonLoaderProps = {
    count: number;
};

function SkeletonOffersLoader({ count }: SkeletonLoaderProps) {
  const skeletonItems = Array.from({ length: count }, (_, index) => index);

  return (
    <>
      {skeletonItems.map((item) => (
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

export default SkeletonOffersLoader;
