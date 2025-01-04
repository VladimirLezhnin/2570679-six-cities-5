
export type AuthData = {
    email: string;
    password: string;
};

export type UserData = {
    name: string;
    avatarUrl: string;
    isPro: boolean;
    email: string;
    token: string;
};

export type Location = {
    latitude: number;
    longitude: number;
    zoom: number;
};

export type City = {
    name: string;
    location: Location;
};

export type Point = {
    title: string;
    lat: number;
    lng: number;
};

export type OfferLocation = {
    point: Point;
    offerId: string;
};

export type Offer = {
    id: string;
    title: string;
    type: string;
    price: number;
    previewImage: string;
    city: City;
    location: Location;
    isFavorite: boolean;
    isPremium: boolean;
    rating: number;
};

export type Host = {
    isPro: boolean;
    name: string;
    avatarUrl: string;
};

export type OfferDetails = {
    id: string;
    title: string;
    description: string;
    type: string;
    price: number;
    images: string[];
    city: City;
    location: Location;
    goods: string[];
    host: Host;
    isPremium: boolean;
    isFavorite: boolean;
    rating: number;
    bedrooms: number;
    maxAdults: number;
};

export type Review = {
    id: string;
    comment: string;
    date: string;
    rating: number;
    user: ReviewAuthor;
};

export type ReviewAuthor = {
    name: string;
    avatarUrl: string;
    isPro: boolean;
};
