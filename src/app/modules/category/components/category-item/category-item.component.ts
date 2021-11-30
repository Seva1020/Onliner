import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import * as CategoryConstants from '../../category.constants';
import * as CategoryActions from '../../state/actions/category.actions';
import { CategoryProductData } from '../../state/category.models';
import * as CategorySelectors from '../../state/selectors/category.selectors';

@Component({
    selector: 'app-category-item',
    templateUrl: './category-item.component.html',
    styleUrls: ['./category-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryItemComponent implements OnInit, OnDestroy {
    private readonly unsubscribe$ = new Subject();

    filterProducts = [
        {
            value: CategoryConstants.popularValue,
            viewValue: 'CATEGORY.POPULAR',
        },
        {
            value: CategoryConstants.cheapValue,
            viewValue: 'CATEGORY.CHEAP',
        },
        {
            value: CategoryConstants.expensiveValue,
            viewValue: 'CATEGORY.EXPENSIVE',
        },
        {
            value: CategoryConstants.releaseDateValue,
            viewValue: 'CATEGORY.NEW',
        },
        {
            value: CategoryConstants.reviewsValue,
            viewValue: 'CATEGORY.WITH_REVIEWS',
        },
    ];

    selected = CategoryConstants.popularValue;

    readonly categoryProducts$ = this.store
        .select(CategorySelectors.selectCategoryProducts)
        .pipe(
            filter(el => el !== undefined),
            takeUntil(this.unsubscribe$),
        );

    readonly filteredDataSource$ = new BehaviorSubject<
        Array<CategoryProductData>
    >(null);

    readonly filteredData$ = this.filteredDataSource$.asObservable();

    readonly isReadyToDisplay$ = this.categoryProducts$.pipe(map(el => !!el));

    constructor(
        private readonly store: Store,
        private readonly route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.takeQueryParams();
        this.fillCategoryByProducts();
    }

    takeQueryParams(): void {
        this.route.queryParams
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((params: Params) => {
                this.store.dispatch(
                    CategoryActions.getCategoryProductsById(params.id),
                );
            });
    }

    fillCategoryByProducts(): void {
        this.categoryProducts$.subscribe(data => {
            this.filteredDataSource$.next(
                this.sortByValue(
                    [...data],
                    CategoryConstants.popular,
                    this.selected,
                ),
            );
        });
    }

    filterByValue(value: string): void {
        this.selected = value;
        this.categoryProducts$
            .pipe(
                take(1),
                filter(data => data.length !== 0),
                map(data => this.filterData(data, value, this.selected)),
            )
            .subscribe(filteredData => {
                this.filteredDataSource$.next(filteredData);
            });
    }

    filterData(
        data: Array<CategoryProductData>,
        value: string,
        selected: string,
    ): Array<CategoryProductData> {
        let someVar = CategoryConstants.price;
        switch (value) {
            case CategoryConstants.cheapValue:
                someVar = CategoryConstants.price;
                break;
            case CategoryConstants.expensiveValue:
                someVar = CategoryConstants.price;
                break;
            case CategoryConstants.releaseDateValue:
                someVar = CategoryConstants.releaseDate;
                break;
            case CategoryConstants.popularValue:
                someVar = CategoryConstants.popular;
                break;
            case CategoryConstants.reviewsValue:
                someVar = CategoryConstants.reviews;
                break;
        }
        return this.sortByValue([...data], someVar, selected);
    }

    sortByValue(
        arr: Array<CategoryProductData>,
        value: string,
        selected: string,
    ): Array<CategoryProductData> {
        if (
            (value === CategoryConstants.price &&
                selected === CategoryConstants.cheapValue) ||
            value === CategoryConstants.popular
        ) {
            return arr.sort((a, b) => a[value] - b[value]);
        } else {
            return arr.sort((a, b) => b[value] - a[value]);
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.filteredDataSource$.complete();
    }
}
