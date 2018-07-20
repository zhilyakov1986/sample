import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IClaimType } from '../../model/interfaces/claim-type';
import { IUserRole } from '../../model/interfaces/user-role';
import { UserRoleService } from '../user-role.service';
import { IClaimValue } from '../../model/interfaces/claim-value';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    selector: 'app-user-role-permission',
    templateUrl: './user-role-permission.component.html',
})
export class UserRolePermissionComponent implements OnInit {
    @Input('claimType') claimType: IClaimType;
    @Input('role') role: IUserRole;
    @Output('onSave') onSave: EventEmitter<any> = new EventEmitter<any>();

    isEditing: boolean;
    claimValues: IClaimValue[] = [];
    permissionSlip: FormGroup;

    constructor(
        private userRoleService: UserRoleService,
        private fb: FormBuilder,
        private commonFunctionsService: CommonFunctionsService,
        private notificationsService: NotificationsService) {}

    ngOnInit(): void {
        this.isEditing = false;
        this.getClaimValues();
        this.createForm();
    }

    getClaimValues(): void {
        this.userRoleService.getClaimValues()
            .subscribe((answer) => {
                this.claimValues = answer;
            });
    }

    createForm(): void {
        this.permissionSlip = this.fb.group({
            'ClaimValueId': new FormControl(),
        });
        if (this.role.UserRoleClaims.length) {
            if (this.role.UserRoleClaims.find((userRoleClaim) => userRoleClaim.ClaimTypeId === this.claimType.Id)) {
                const cvId = this.role.UserRoleClaims.find((userRoleClaim) => userRoleClaim.ClaimTypeId === this.claimType.Id).ClaimValueId;
                this.permissionSlip.controls.ClaimValueId.setValue(cvId.toString());
            } else {
                this.permissionSlip.controls.ClaimValueId.setValue('0');
            }
        } else {
            this.permissionSlip.controls.ClaimValueId.setValue('0');
        }
    }

    save(): void {
        if (this.permissionSlip.valid) {
            const userRoleClaim = {
                ClaimType: this.claimType,
                ClaimTypeId: this.claimType.Id,
                ClaimValue: this.claimValues.find((cv) => cv.Id === +this.permissionSlip.value.ClaimValueId),
                ClaimValueId: +this.permissionSlip.value.ClaimValueId,
            };
            this.onSave.emit(userRoleClaim);
            this.isEditing = false;
        } else {
            this.commonFunctionsService.markAllFormFieldsAsTouched(this.permissionSlip);
            this.notificationsService.error('Save Failed');
        }
    }

    cancel(): void {
        this.ngOnInit();
    }

    edit(): void {
        if (this.role.IsEditable) {
            this.isEditing = true;
        }
    }

    getPermission(): string {
        let permission = 'None';
        if (this.role.UserRoleClaims && this.role.UserRoleClaims.length > 0) {
            if (this.role.UserRoleClaims.find((urc) => urc.ClaimTypeId === this.claimType.Id)) {
                const claimValueId = (this.role.UserRoleClaims.find((urc) => urc.ClaimTypeId === this.claimType.Id)).ClaimValueId;
                permission = claimValueId && this.claimValues.find((cv) => cv.Id === claimValueId) ?
                    this.claimValues.find((cv) => cv.Id === claimValueId).Name : 'None';
            }
        }
        return permission;
    }

}
