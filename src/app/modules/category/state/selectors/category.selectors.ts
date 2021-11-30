import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryProductsState } from '../category.state';
import { categoryFeatureKey } from '../reducers/category.reducers';

export const selectCategoryProductsFeature =
    createFeatureSelector<CategoryProductsState>(categoryFeatureKey);

export const selectCategoryProducts = createSelector(
    selectCategoryProductsFeature,
    (state: CategoryProductsState) => state.products?.data,
);

export const selectCategoryTitle = createSelector(
    selectCategoryProductsFeature,
    (state: CategoryProductsState) => state.products?.categoryTitle,
);

export const selectFilterProductsData = createSelector(
    selectCategoryProductsFeature,
    (state: CategoryProductsState) => state.products?.filter,
);

export const selectFilterData = createSelector(
    selectCategoryProductsFeature,
    (state: CategoryProductsState) => state.filters,
);
