import { createAction } from '@ngrx/store';
import * as ActionConstants from 'src/app/store/store-action.constants';
import { CategoryProducts, FilterItem } from '../category.models';

export const getCategoryProductsById = createAction(
    ActionConstants.GET_CATEGORY_PRODUCTS,
    (categoryId: string) => ({ categoryId }),
);

export const getCategoryProductsByIdSuccess = createAction(
    ActionConstants.GET_CATEGORY_PRODUCTS_SUCCESS,
    (categoryProducts: CategoryProducts) => ({ categoryProducts }),
);

export const setFilterItem = createAction(
    ActionConstants.SET_FILTER_ITEM,
    (filterItem: FilterItem) => ({ filterItem }),
);

export const deleteFilteItem = createAction(
    ActionConstants.DELETE_FILTER_ITEM,
    (filterItem: FilterItem) => ({ filterItem }),
);
