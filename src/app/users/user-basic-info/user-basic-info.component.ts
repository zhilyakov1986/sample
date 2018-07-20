import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { UserService } from '../user.service';

import { IUser } from '../../model/interfaces/user';
import { UserDynamicConfig } from '../user.dynamic-config';
import { AuthEntityService } from '../../auth-entity/auth-entity.service'; // added
import { IUserRole } from '../../model/interfaces/user-role'; // added
import { IAuthUser } from '../../model/interfaces/auth-user'; // added
import { AuthUserDynamicConfig } from '../../auth-entity/auth-user/auth-user.dynamic-config';
import { ICreateUserPayload } from '../../model/interfaces/custom/create-user-payload';

@Component({
    selector: 'app-user-basic-info',
    templateUrl: './user-basic-info.component.html',
})
export class UserBasicInfoComponent implements OnInit {
    @Input() user: IUser;
    @Input() canEdit: boolean;
    authUser: IAuthUser;
    roles: IUserRole[];
    additionalConfigs: any[] = [];
    isEditing: boolean;
    isHovered: boolean;
    config: any = {};
    userForm: any;
    formFactory: UserDynamicConfig<IUser>;
    doubleClickIsDisabled = false;

    constructor(
        private userService: UserService,
        public notificationsService: NotificationsService,
        private authEntitiyService: AuthEntityService,
        public router: Router,
        private commonFunctionsService: CommonFunctionsService) { }

    ngOnInit(): void {
        this.isEditing = false;
        this.config = { formObject: [], viewOnly: [] };
        if (this.isNewUser()) {
            this.authEntitiyService.getAllRoles() // added
                .subscribe((answer) => {
                    this.roles = answer.body;
                    this.setConfig();
                });
        } else {
            this.setConfig();
        }
    }

    private isNewUser(): boolean {
        return this.user && this.user.Id && this.user.Id > 0 ? false : true;
    }

    getAdditionalConfigs(): AuthUserDynamicConfig<IAuthUser>[] {
        let pwConfigControls: string[] = [
            'SendResetEmail',
            'Password',
            'ConfirmPassword',
        ];
        const authUser = this.isNewUser() ? null : this.user.AuthUser;
        const pwConfig = new AuthUserDynamicConfig<IAuthUser>(authUser, null, pwConfigControls);
        const roleConfig = new AuthUserDynamicConfig<IAuthUser>(authUser, this.roles);
        return [pwConfig, roleConfig];
    }

    setConfig(): void {
        this.formFactory = new UserDynamicConfig<IUser>(this.user);
        this.additionalConfigs = this.getAdditionalConfigs();
        if (this.isNewUser()) {
            this.isEditing = true;
            this.config = this.formFactory.getForCreate(this.additionalConfigs);
        } else {
            this.config = this.formFactory.getForUpdate();
        }
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.isNewUser()) {
            this.router.navigate(['/users']);
        } else {
            this.isEditing = false;
        }
    }

    matchPassword(form: any): boolean {
        let password = form.value.User.Password;
        let confirmPassword = form.value.User.ConfirmPassword;
        if (password !== confirmPassword) {
            form.controls.ConfirmPassword.setErrors({ matchPassword: true });
            form.controls.Password.setErrors({ matchPassword: true });
            return false;
        }
        return true;
    }

    formSubmitted(form): void {
        if (this.matchPassword(form)) {
            if (form.valid) {
                this.formFactory.assignFormValues(this.user, form.value.User);
                if (this.isNewUser()) {
                    const data: ICreateUserPayload = {
                        Password: form.value.AuthUser.Password,
                        SendEmail: form.value.AuthUser.resetEmail || false,
                        User: this.user,
                        Username: form.value.AuthUser.Username,
                        UserRoleId: form.value.AuthUser.RoleId,
                    };
                    // handle new user save
                    this.userService.createUser(data)
                      .finally(() => this.doubleClickIsDisabled = false)
                      .subscribe((answer) => {
                        this.router.navigate(['/users/' + answer]);
                        this.userService.emitChange(this.user);
                        this.success();
                      });
                } else {
                    // handle existing user save
                    this.userService.updateVersion(this.user)
                        .finally(() => this.doubleClickIsDisabled = false)
                        .subscribe((answer) => {
                            answer ? (
                                (this.user.Version = answer),
                                (this.isEditing = false),
                                this.success(),
                                this.userService.emitChange(this.user),
                                this.setConfig())
                                : this.error();
                        });
                }
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
        this.notificationsService.success('Saved Successfully');
    }

    updateVersion(version): void {
        this.user.Version = version;
    }
}
