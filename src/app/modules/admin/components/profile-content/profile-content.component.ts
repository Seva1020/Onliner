import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as LoadAdminActions from '../../state/actions/admin.actions';
import * as AdminSelect from '../../state/selectors/admin.selectors';
import { AdminState } from '../../state/admin.state';
import { Subject } from 'rxjs';
import { map, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-profile-content',
    templateUrl: './profile-content.component.html',
    styleUrls: ['./profile-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContentComponent implements OnInit, OnDestroy {
    private readonly unsubscribe$ = new Subject();
    form: FormGroup;

    readonly selectId$ = this.store
        .select(AdminSelect.selectId)
        .pipe(takeUntil(this.unsubscribe$));
    readonly avatarId$ = this.store
        .select(AdminSelect.selectAvatarId)
        .pipe(takeUntil(this.unsubscribe$));
    readonly getAvatar$ = this.store
        .select(AdminSelect.selectAvatar)
        .pipe(takeUntil(this.unsubscribe$));
    readonly isReadyToDisplay$ = this.selectId$.pipe(map(el => !!el));

    constructor(
        readonly store: Store<AdminState>,
        private readonly translate: TranslateService,
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            name: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
        });
        this.store.dispatch(LoadAdminActions.getAdminInfo());
    }

    updateProfile(): void {
        this.selectId$.pipe(take(1)).subscribe(id => {
            this.store.dispatch(
                LoadAdminActions.updateProfileInfo({
                    updatedData: { ...this.form.value, _id: id },
                }),
            );
        });
        this.form.reset();
    }

    getFile(file: Blob): void {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = event => {
                this.getAvatar$
                    .pipe(take(1), withLatestFrom(this.avatarId$))
                    .subscribe(([avatar, avatarId]) => {
                        avatar
                            ? this.store.dispatch(
                                  LoadAdminActions.updateProfileAvatar({
                                      updatedAvatar: {
                                          _id: avatarId,
                                          imgUrl: event.target.result as string,
                                      },
                                  }),
                              )
                            : this.store.dispatch(
                                  LoadAdminActions.addProfileAvatar({
                                      addAvatarData: {
                                          imgUrl: event.target.result as string,
                                          _id: avatarId,
                                      },
                                  }),
                              );
                    });
            };
        } catch (error) {
            window.alert(this.translate.instant('ALERT.MESSAGE'));
        }
    }

    onRemoveFile(): void {
        this.avatarId$.pipe(take(1)).subscribe(avatarId => {
            this.store.dispatch(
                LoadAdminActions.removeProfileAvatar({ avatarId }),
            );
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
