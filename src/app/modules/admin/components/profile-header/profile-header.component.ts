import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as AdminSelectors from '../../state/selectors/admin.selectors';
import { map, takeUntil } from 'rxjs/operators';
import { AdminState } from '../../state/admin.state';

@Component({
    selector: 'app-profile-header',
    templateUrl: './profile-header.component.html',
    styleUrls: ['./profile-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHeaderComponent implements OnInit, OnDestroy {
    private readonly unsubscribe$ = new Subject();
    readonly name$ = this.store
        .select(AdminSelectors.selectName)
        .pipe(takeUntil(this.unsubscribe$));
    readonly getAvatar$ = this.store
        .select(AdminSelectors.selectAvatar)
        .pipe(takeUntil(this.unsubscribe$));

    readonly isReadyToDisplay$ = this.name$.pipe(map(el => !!el));

    constructor(readonly store: Store<AdminState>) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
