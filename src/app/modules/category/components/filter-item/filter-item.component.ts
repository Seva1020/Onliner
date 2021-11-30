import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterItem } from '../../state/category.models';
import * as CategorySelectors from '../../state/selectors/category.selectors';
import * as CategoryActions from '../../state/actions/category.actions';

@Component({
    selector: 'app-filter-item',
    templateUrl: './filter-item.component.html',
    styleUrls: ['./filter-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterItemComponent implements OnDestroy {
    private readonly unsubscribe$ = new Subject();
    readonly filterItemsData$ = this.store
        .select(CategorySelectors.selectFilterData)
        .pipe(takeUntil(this.unsubscribe$));

    constructor(private readonly store: Store) {}

    removeOne(item: FilterItem): void {
        this.store.dispatch(CategoryActions.deleteFilteItem(item));
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
