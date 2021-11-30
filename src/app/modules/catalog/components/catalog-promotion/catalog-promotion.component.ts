import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { CatalogState } from '../../state/catalog.state';
import * as promotionsSelect from '../../state/selectors/promotions.selectors';
import * as PromotionActions from '../../state/actions/promotions.actions';
import { map, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-catalog-promotion',
    templateUrl: './catalog-promotion.component.html',
    styleUrls: ['./catalog-promotion.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPromotionComponent implements OnInit, OnDestroy {
    private readonly unsubscribe$ = new Subject();

    readonly promotions$ = this.store
        .select(promotionsSelect.selectPromotions)
        .pipe(takeUntil(this.unsubscribe$));

    readonly isReadyToDisplay$ = this.promotions$.pipe(map(el => !!el));

    constructor(private readonly store: Store<CatalogState>) {}

    ngOnInit(): void {
        this.store.dispatch(PromotionActions.getPromotionsData());
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
