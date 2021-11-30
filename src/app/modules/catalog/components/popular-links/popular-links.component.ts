import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { CatalogState } from '../../state/catalog.state';
import * as LinksSelectors from '../../state/selectors/links.selectors';
import * as LinksActions from '../../state/actions/links.actions';
import { map, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-popular-links',
    templateUrl: './popular-links.component.html',
    styleUrls: ['./popular-links.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopularLinksComponent implements OnInit, OnDestroy {
    private readonly unsubscribe$ = new Subject();

    readonly links$ = this.store
        .select(LinksSelectors.selectLinks)
        .pipe(takeUntil(this.unsubscribe$));

    readonly isReadyToDisplay$ = this.links$.pipe(map(el => !!el));

    constructor(private readonly store: Store<CatalogState>) {}

    ngOnInit(): void {
        this.store.dispatch(LinksActions.getLinks());
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
