type OfferGalleryProps = {
    imagesSources: string[];
};

function OfferGallery({ imagesSources }: OfferGalleryProps) {
  return (
    <div className="offer__gallery-container container">
      <div className="offer__gallery">
        {imagesSources.map((source) => (
          <div className="offer__image-wrapper" key={source}>
            <img className="offer__image" src={source} alt="Photo studio" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfferGallery;
