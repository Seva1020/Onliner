import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    Output,
    EventEmitter,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { CatalogState } from '../../state/catalog.state';
import * as OffersActions from '../../state/actions/offers.actions';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import * as OffersSelectors from '../../state/selectors/offers.selectors';

@Component({
    selector: 'app-super-offers',
    templateUrl: './super-offers.component.html',
    styleUrls: ['./super-offers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperOffersComponent implements OnInit, OnDestroy {
    private readonly unsubscribe$ = new Subject();

    @Output() hidePromos: EventEmitter<boolean> = new EventEmitter();

    readonly offers$ = this.store
        .select(OffersSelectors.selectOffers)
        .pipe(takeUntil(this.unsubscribe$));

    readonly categoryOffers$ = this.store
        .select(OffersSelectors.selectCategoryOffers)
        .pipe(takeUntil(this.unsubscribe$));

    readonly categoriesData$ = this.store
        .select(OffersSelectors.selectCategories)
        .pipe(takeUntil(this.unsubscribe$));

    readonly isReadyToDisplay$ = combineLatest([
        this.offers$,
        this.categoryOffers$,
    ]).pipe(map(el => el.every(el => el.length !== 0)));

    isOpenTabContent = false;
    toggleTabContentClass = true;

    indexCategory = 0;

    constructor(private readonly store: Store<CatalogState>) {}

    ngOnInit(): void {
        this.store.dispatch(OffersActions.getOffers());
        this.store.dispatch(OffersActions.getCategoryOffers());
        this.selectCategory(this.indexCategory);
    }

    selectCategory(index: number): void {
        this.indexCategory = index;
        this.toggleTabContentClass = !this.toggleTabContentClass;
        this.isOpenTabContent = !this.isOpenTabContent;
        this.hidePromos.emit(!this.toggleTabContentClass);
    }

    selectTab(): void {
        this.toggleTabContentClass = !this.toggleTabContentClass;
        this.isOpenTabContent = this.isOpenTabContent;
        this.hidePromos.emit(!this.toggleTabContentClass);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
