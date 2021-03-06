import { createFeatureSelector, createSelector } from '@ngrx/store';
import { offersFeatureKey } from '../reducers/offers.reducer';
import { OffersState } from '../catalog.state';

export const selectOffersFeature =
    createFeatureSelector<OffersState>(offersFeatureKey);

export const selectOffers = createSelector(
    selectOffersFeature,
    (state: OffersState) => state.offers,
);

export const selectCategories = createSelector(
    selectOffersFeature,
    (state: OffersState) => state.categoryOffers.map(el => el.categories),
);

export const selectCategoryOffers = createSelector(
    selectOffersFeature,
    (state: OffersState) => state.categoryOffers,
);
