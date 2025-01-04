import { Review } from "../../types";

export function getFakeReviews() : Review[] {
    const fakeReviews: Review[] = [
        {
            id: 'b67ddfd5-b953-4a30-8c8d-bd083cd6b62a',
            user: {
              avatarUrl: 'https://url-to-image/image.png',
              isPro: false,
              name: 'Oliver Conner',
            },
            rating: 4,
            comment: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.',
            date: '2025-01-04T02:07:25.791Z'
          },
    ];

    return fakeReviews;
};