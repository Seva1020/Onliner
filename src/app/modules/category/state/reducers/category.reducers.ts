import { createReducer, on } from '@ngrx/store';
import * as CategoryActions from '../actions/category.actions';
import { CategoryProductsState } from '../category.state';

export const categoryFeatureKey = 'category';

export const initialState: CategoryProductsState = {
    products: null,
    filters: [],
};

export const reducer = createReducer(
    initialState,

    on(CategoryActions.getCategoryProductsByIdSuccess, (state, action) => {
        return {
            ...state,
            products: action.categoryProducts,
        };
    }),
    on(CategoryActions.setFilterItem, (state, action) => {
        const filterItems = state.filters.filter(
            filterItem => filterItem.id !== action.filterItem.id,
        );
        return {
            ...state,
            filters: [
                ...filterItems,
                {
                    first_filter_key: action.filterItem.first_filter_key,
                    second_filter_key: action.filterItem.second_filter_key,
                    id: action.filterItem.id,
                },
            ],
        };
    }),
    on(CategoryActions.deleteFilteItem, (state, action) => {
        const filteredItems = state.filters.filter(
            filterItem => filterItem.id !== action.filterItem.id,
        );
        return {
            ...state,
            filters: filteredItems,
        };
    }),
);
