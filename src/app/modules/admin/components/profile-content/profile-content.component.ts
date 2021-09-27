import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import * as LoadAdminActions from '../../state/admin.actions';
import { AdminState } from '../../state/admin.state';
import * as AdminSelect from '../../state/admin.selectors';
import { map, take, takeUntil } from 'rxjs/operators';
import { Admin } from '../../state/admin.model';

@Component({
    selector: 'app-profile-content',
    templateUrl: './profile-content.component.html',
    styleUrls: ['./profile-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContentComponent implements OnInit, OnDestroy {
    private readonly unsubscribe$ = new Subject();
    panelOpenState: boolean;
    fileUrl: string;
    dataObj: Admin;
    // Вот тут я пытаюсь задать типа SafeUrl, но он ругается. Поэтому я сделал any.
    trustUrl: any;
    form: FormGroup;
    readonly getAvatar$ = this.store
    .select(AdminSelect.selectAvatar)
    .pipe(takeUntil(this.unsubscribe$));


    constructor(
        private store: Store<AdminState>,
        private sanitazer: DomSanitizer,
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

    updateProfile() {
        this.dataObj = {
            ...this.form.value,
            avatar: this.fileUrl,
        };
        this.store.dispatch(
            LoadAdminActions.updateProfileInfo({ updatedData: this.dataObj }),
        );
        this.form.reset();
    }

    getFile(event: { target: { files: Blob[] } }) {
        if (event.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event: { target: { result } }) => {
                this.fileUrl = event.target.result;
                this.trustUrl = this.sanitazer.bypassSecurityTrustUrl(
                    this.fileUrl,
                );
                this.store.dispatch(
                    LoadAdminActions.uploadProfileAvatar({
                        uploadAvatar:
                            this.trustUrl.changingThisBreaksApplicationSecurity,
                    }),
                );
            };
        }
    }

    onRemoveFile() {
        this.store.dispatch(LoadAdminActions.removeProfileAvatar());
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}