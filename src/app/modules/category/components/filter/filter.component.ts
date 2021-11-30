import {
    Component,
    OnDestroy,
    ChangeDetectionStrategy,
    ElementRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { FilterItem, FiltersData } from '../../state/category.models';
import * as CategorySelectors from '../../state/selectors/category.selectors';
import * as CategoryActions from '../../state/actions/category.actions';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnDestroy {
    private readonly unsubscribe$ = new Subject();
    private filterItemFromTo: FilterItem;

    readonly filterProductItemsData$ = this.store
        .select(CategorySelectors.selectFilterProductsData)
        .pipe(
            filter(el => el !== undefined),
            map(el => el),
            takeUntil(this.unsubscribe$),
        );

    readonly filterItemsData$ = this.store
        .select(CategorySelectors.selectFilterData)
        .pipe(takeUntil(this.unsubscribe$));

    readonly isReadyToDisplay$ = this.filterProductItemsData$.pipe(
        map(el => !!el),
    );

    constructor(
        private readonly store: Store,
        private readonly elRef: ElementRef,
    ) {}

    onChecked(value: FiltersData, selected: boolean, id: string): void {
        const filterItem = {
            first_filter_key: value,
            id,
        };
        if (selected) {
            this.store.dispatch(CategoryActions.setFilterItem(filterItem));
        } else {
            this.store.dispatch(CategoryActions.deleteFilteItem(filterItem));
        }
    }

    onInput(id: string): void {
        const inputsElements =
            this.elRef.nativeElement.querySelectorAll('.input');

        const filterItem: FilterItem = {
            id,
            first_filter_key: null,
            second_filter_key: null,
        };

        inputsElements.forEach(input => {
            filterItem[input.getAttribute('key')] = input.value;
        });

        this.onFilterFromTo(filterItem);
    }

    onSelectFirst(id: string, value: FiltersData): void {
        this.filterItemFromTo = {
            id,
            ...this.filterItemFromTo,
            first_filter_key: value,
        };
        this.onFilterFromTo(this.filterItemFromTo);
    }

    onSelectSecond(id: string, value: FiltersData): void {
        this.filterItemFromTo = {
            id,
            ...this.filterItemFromTo,
            second_filter_key: value,
        };
        this.onFilterFromTo(this.filterItemFromTo);
    }

    onFilterFromTo(filterFromTo: FilterItem): void {
        this.store.dispatch(CategoryActions.setFilterItem(filterFromTo));
        this.removeFromTo();
    }

    removeFromTo(): void {
        this.filterItemsData$.subscribe(data => {
            const emptyElement = data.find(el => {
                if (
                    (el.first_filter_key === '' &&
                        el.second_filter_key === '') ||
                    (el.first_filter_key === '' &&
                        el.second_filter_key === undefined) ||
                    (el.first_filter_key === undefined &&
                        el.second_filter_key === '')
                ) {
                    return el;
                }
            });
            if (emptyElement) {
                this.store.dispatch(
                    CategoryActions.deleteFilteItem(emptyElement),
                );
            }
        });
    }

    setFilterValue(id: string, selectedItems: FilterItem[]): boolean {
        return (
            selectedItems.findIndex(el =>
                el.first_filter_key !== undefined
                    ? el.first_filter_key.id === id
                    : '',
            ) > -1
        );
    }

    resetInputValue(
        id: string,
        selectedItems: FilterItem[],
        filterKey: string,
    ): FiltersData {
        const resultItem = selectedItems.find(el => el.id === id);
        return selectedItems.length && resultItem ? resultItem[filterKey] : '';
    }

    resetSelectValue(
        filterKey: string,
        selectedItems: FilterItem[],
        name: string,
    ): FiltersData {
        const resultItem = selectedItems.find(el => el[filterKey] === name);
        return selectedItems.length && resultItem ? resultItem[filterKey] : '';
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
