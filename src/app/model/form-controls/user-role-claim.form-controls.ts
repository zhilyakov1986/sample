import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IUserRoleClaim } from '../interfaces/user-role-claim';
import { IUserRole } from '../interfaces/user-role';

export class UserRoleClaimDynamicControls {

    Form: IExpandableObject = {
        ClaimTypeId: new DynamicField(
            this.formGroup,
            'Claim Type',
            this.userroleclaim && this.userroleclaim.hasOwnProperty('ClaimTypeId') && this.userroleclaim.ClaimTypeId !== null ? this.userroleclaim.ClaimTypeId : null,
            'ClaimTypeId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.claimtypes,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        ClaimValueId: new DynamicField(
            this.formGroup,
            'Claim Value',
            this.userroleclaim && this.userroleclaim.hasOwnProperty('ClaimValueId') && this.userroleclaim.ClaimValueId !== null ? this.userroleclaim.ClaimValueId : null,
            'ClaimValueId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.claimvalues,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        RoleId: new DynamicField(
            this.formGroup,
            'Role',
            this.userroleclaim && this.userroleclaim.hasOwnProperty('RoleId') && this.userroleclaim.RoleId !== null ? this.userroleclaim.RoleId : null,
            'RoleId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.roles,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
    };

    View: IExpandableObject = {
        ClaimTypeId: new DynamicLabel(
            'Claim Type',
            this.getMetaItemValue(this.claimtypes, this.userroleclaim && this.userroleclaim.hasOwnProperty('ClaimTypeId') && this.userroleclaim.ClaimTypeId !== null ? this.userroleclaim.ClaimTypeId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        ClaimValueId: new DynamicLabel(
            'Claim Value',
            this.getMetaItemValue(this.claimvalues, this.userroleclaim && this.userroleclaim.hasOwnProperty('ClaimValueId') && this.userroleclaim.ClaimValueId !== null ? this.userroleclaim.ClaimValueId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        RoleId: new DynamicLabel(
            'Role',
            this.getMetaItemValue(this.roles, this.userroleclaim && this.userroleclaim.hasOwnProperty('RoleId') && this.userroleclaim.RoleId !== null ? this.userroleclaim.RoleId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
    };

    protected getMetaItemValue(source, id: number | number[]): string {
        if (!source) {
            return undefined;
        }
        if (id instanceof Array) {
            const items = source.filter((s) => (<number[]>id).some((id) => s.Id === id)).map((s) => s.Name);
            return items && items.join(', ') || undefined;
        }
        const item = source.find((s) => s.Id === id);
        return item && item.Name || undefined;
    }
    constructor(
        private userroleclaim?: IUserRoleClaim,
        private formGroup = 'UserRoleClaim',
        private claimtypes?: IUserRole[],
        private claimvalues?: IUserRole[],
        private roles?: IUserRole[],
    ) { }
}
