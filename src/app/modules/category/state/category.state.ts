import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as categoryModels from './category.models';
import * as fromCategoryProducts from './reducers/category.reducers';

export interface CategoryProductsState {
    products: categoryModels.CategoryProducts;
    filters: categoryModels.FilterItem[];
}

export interface CategoryState {
    [fromCategoryProducts.categoryFeatureKey]: CategoryProductsState;
}

export const reducers: ActionReducerMap<CategoryState> = {
    [fromCategoryProducts.categoryFeatureKey]: fromCategoryProducts.reducer,
};

export const metaReducers: Array<MetaReducer> = [];
