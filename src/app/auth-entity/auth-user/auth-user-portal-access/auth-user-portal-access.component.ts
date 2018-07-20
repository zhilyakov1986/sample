import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IAuthUser } from '../../../model/interfaces/auth-user';
import { IUserRole } from '../../../model/interfaces/user-role';
import { AuthEntityService } from '../../auth-entity.service';
import { CustomerService } from '../../../customers/customer.service';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { ActivatedRoute } from '@angular/router';
import { AuthUserDynamicConfig } from '../auth-user.dynamic-config';

@Component({
    selector: 'app-auth-user-portal-access',
    templateUrl: './auth-user-portal-access.html',
})

export class AuthUserPortalAccessComponent implements OnInit {
    @Input('AuthUser') authUser: IAuthUser;
    @Input('canEdit') canEdit: boolean;
    @Output('updateVersion') updateVersion: EventEmitter<string> = new EventEmitter<string>();
    isEditing: boolean;
    roles: IUserRole[];
    config: any = {};
    userId: number;
    formFactory: AuthUserDynamicConfig<IAuthUser>;
    doubleClickIsDisabled = false;
    configControls: string[] = [
        'Username',
        'RoleId',
    ];

    constructor(
        public route: ActivatedRoute,
        private customerService: CustomerService,
        private authEntitiyService: AuthEntityService,
        public notificationsService: NotificationsService,
        private commonFunctionsService: CommonFunctionsService) { }

    ngOnInit(): void {
        this.isEditing = false;
        this.config = { formObject: [], viewOnly: [] };
        this.authEntitiyService.getAllRoles()
            .subscribe((answer) => {
                this.roles = answer.body;
                this.setConfig();
            });
        this.userId = +this.route.snapshot.params.userId;
    }

    setConfig(): void {
        this.formFactory = new AuthUserDynamicConfig<IAuthUser>(this.authUser, this.roles, this.configControls);
        this.config = this.formFactory.getForUpdate();
    }

    formSubmitted(form: any): void {
        if (form.valid) {
            this.authEntitiyService.updatePortalAccess(this.userId, form.value.AuthUser.Username, form.value.AuthUser.RoleId)
                .finally(() => this.doubleClickIsDisabled = false)
                .subscribe((answer) => {
                    this.success();
                    this.authUser.RoleId = form.value.AuthUser.RoleId;
                    this.authUser.Username = form.value.AuthUser.Username;
                    this.setConfig();
                    this.isEditing = false;
                    this.updateVersion.emit(answer);
                });
        } else {
            this.commonFunctionsService.markAllFormFieldsAsTouched(form);
            this.error();
            setTimeout(() => {
                this.doubleClickIsDisabled = false;
            });
        }
    }

    changeAccess(): void {
        this.authUser.HasAccess = !this.authUser.HasAccess;
        this.authEntitiyService.changeAccess(this.authUser.Id, this.authUser.HasAccess)
            .subscribe((answer) => {
                this.isEditing = false;
                this.success();
            });
    }
    edit(): void {
        this.isEditing = true;
    }

    cancel(): void {
        this.isEditing = false;
    }

    error(): void {
        this.notificationsService.error('Save Failed');
    }

    success(): void {
        this.notificationsService.success('Saved Successfully');
    }
}
