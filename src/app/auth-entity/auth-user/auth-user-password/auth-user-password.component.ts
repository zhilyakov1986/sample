import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { AuthEntityService } from '../../auth-entity.service';
import { IAuthUser } from '../../../model/interfaces/auth-user';
import { AuthUserDynamicConfig } from '../auth-user.dynamic-config';

@Component({
    selector: 'app-auth-user-password',
    templateUrl: './auth-user-password.component.html',
})
export class AuthUserPasswordComponent implements OnInit {

    @Input('AuthUser') authUser: IAuthUser;
    @Input('canEdit') canEdit: boolean;
    @Output('updateVersion') updateVersion: EventEmitter<string> = new EventEmitter<string>();
    config: any = {};
    formFactory: AuthUserDynamicConfig<IAuthUser>;
    doubleClickIsDisabled = false;
    isEditing: boolean;

    configControls: string[] = [
        'CurrentPassword',
        'Password',
        'ConfirmPassword',
    ];

    constructor(
        private notificationsService: NotificationsService,
        private commonFunctionsService: CommonFunctionsService,
        private authEntityService: AuthEntityService,
    ) { }

    ngOnInit(): void {
        this.isEditing = false;
        this.config = { formObject: [], viewOnly: [] };
        this.setConfig();
    }

    setConfig(): void {
        this.formFactory = new AuthUserDynamicConfig<IAuthUser>(this.authUser, null, this.configControls);
        this.config = this.formFactory.getForUpdate();
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancel(): void {
        this.isEditing = false;
    }

    matchPassword(form: any): boolean {
        let password = form.value.AuthUser.Password;
        let confirmPassword = form.value.AuthUser.ConfirmPassword;
        if (password !== confirmPassword) {
            form.controls.ConfirmPassword.setErrors({ matchPassword: true });
            form.controls.Password.setErrors({ matchPassword: true });
            return false;
        }
        return true;
    }

    formSubmitted(form: any): void {
        if (this.matchPassword(form)) {
            if (form.valid) {
                this.authEntityService.savePassword(this.authUser.Id, form.value.AuthUser.Password, form.value.AuthUser.CurrentPassword, form.value.AuthUser.ConfirmPassword)
                    .finally(() => this.doubleClickIsDisabled = false)
                    .subscribe((answer) => {
                        this.success();
                        this.isEditing = false;
                        this.updateVersion.emit(answer);
                    },
                    (error) => {
                        if (error.status === 418) {
                            this.notificationsService.error('Password is not correct');
                        }
                    });
            } else {
                this.commonFunctionsService.markAllFormFieldsAsTouched(form);
                this.error();
                this.enableDoubleClick();
            }
        } else {
            this.error('Passwords do not match');
            this.enableDoubleClick();
        }
    }

    enableDoubleClick(): void {
        setTimeout(() => {
            this.doubleClickIsDisabled = false;
        });
    }

    error(msg?: string): void {
        if (!msg) {
            this.notificationsService.error('Save Failed');
        } else {
            this.notificationsService.error(msg);
        }
    }

    success(): void {
        this.notificationsService.success('Password Updated Successfully');
    }

}
