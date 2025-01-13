type OfferGalleryProps = {
  imageSources: string[];
};

function OfferGallery({ imageSources: imageSources }: OfferGalleryProps) {
  return (
    <div className="offer__gallery-container container" aria-label="Offer gallery">
      <div className="offer__gallery" data-testid="gallery">
        {imageSources.map((source) => (
          <div className="offer__image-wrapper" key={source} data-testid="image-wrapper">
            <img className="offer__image" src={source} alt="Photo studio" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfferGallery;
