import { RootState } from "../..";
import { AuthorizationStatus, SortingOptionName } from "../../enums";

const defaultState: RootState = {
    offers: {
        offers: [],
        isOffersDataLoading: false,
        offersSortingOption: SortingOptionName.Popular,
    },
    city: {
        name: 'Paris',
        location: {
            latitude: 48.85661,
            longitude: 2.351499,
            zoom: 13,
        },
    },
    auth: {
        authorizationStatus: AuthorizationStatus.Unknown,
        userData: undefined,
    },
    offerDetails: {
        isLoading: false,
        offerDetails: undefined,
    },
    nearOffers: {
        nearOffers: [],
    },
    offerComments: {
        commentSendingStatus: false,
        offerComments: [],
    },
    favoriteOffers: {
        favoriteOffers: [],
    }
}


export const getFakeStore = (initialState?: Partial<RootState>): RootState => ({
    ...defaultState,
    ...initialState ?? {}
});