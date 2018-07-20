import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { UserRoleService } from '../user-role.service';

import { IUserRole } from '../../model/interfaces/user-role';
import { UserRoleDynamicConfig } from '../user-role.dynamic-config';
import { SearchParams } from '@mt-ng2/common-classes';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-user-role-basic-info',
    templateUrl: './user-role-basic-info.component.html',
})
export class UserRoleBasicInfoComponent implements OnInit {
    @Input() userRole: IUserRole;
    @Input() canEdit: boolean;
    roles: IUserRole[];
    isEditing: boolean;
    isHovered: boolean;
    config: any = {};
    userRoleForm: FormGroup;
    formFactory: UserRoleDynamicConfig<IUserRole>;
    doubleClickIsDisabled = false;

    constructor(
        private userRoleService: UserRoleService,
        private notificationsService: NotificationsService,
        private router: Router,
        private commonFunctionsService: CommonFunctionsService) { }

    ngOnInit(): void {
        this.isEditing = false;
        this.config = { formObject: [], viewOnly: [] };
        const search: SearchParams = {skip: 0, take: 0, query: '', extraParams: []};
        this.userRoleService.get(search)
            .subscribe((answer) => {
                this.roles = answer.body;
                this.setConfig();
            });
    }

    setConfig(): void {
        this.formFactory = new UserRoleDynamicConfig<IUserRole>(this.userRole);
        if (this.userRole.Id === 0) {
            this.isEditing = true;
            this.config = this.formFactory.getForCreate();
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
        if (this.userRole.Id === 0) {
            this.router.navigate(['/roles']);
        } else {
            this.isEditing = false;
        }
    }
    formSubmitted(form: FormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.userRole, form.value.UserRole);
            this.userRoleService.saveUserRole(this.userRole)
                .finally(() => this.enableDoubleClick())
                .subscribe((answer) => {
                    this.success();
                    this.userRoleService.emitChange(this.userRole);
                    if (this.userRole.Id === 0) {
                        this.router.navigate(['/roles/' + answer.Id]);
                    } else {
                        this.isEditing = false;
                        this.setConfig();
                    }
                });
        } else {
            this.commonFunctionsService.markAllFormFieldsAsTouched(form);
            this.error();
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
}
