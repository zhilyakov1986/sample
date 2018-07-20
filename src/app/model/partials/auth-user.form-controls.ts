import { AuthUserDynamicControls } from '../form-controls/auth-user.form-controls';
import { IAuthUser } from '../interfaces/auth-user';
import { IUserRole } from '../interfaces/user-role';
import { Validators } from '@angular/forms';
import { DynamicField, DynamicFieldType, DynamicFieldTypes } from '@mt-ng2/dynamic-form';

export class AuthUserDynamicControlsExtended extends AuthUserDynamicControls {

    constructor(private extAuthUser: IAuthUser, roles?: IUserRole[]) {
        super(extAuthUser, 'AuthUser', roles);
        // TODO: JJG This is a little hacky to get around the contructor object intellisense.
        // Since I am adding dynamic properties not on the model I need to do this to get around
        // the TS compiler complaining.
        if (!roles) {
            if (!this.extAuthUser || this.extAuthUser.Id === 0) {
                let sendEmail = new DynamicField(
                    'AuthUser',
                    'Send Password Reset Email',
                    '',
                    'SendResetEmail',
                    new DynamicFieldType(
                        DynamicFieldTypes.Checkbox,
                    ),
                );
                this.Form.SendResetEmail = sendEmail;
            }

            this.Form.ConfirmPassword = new DynamicField(
                'AuthUser',
                'Confirm Password',
                '',
                'ConfirmPassword',
                new DynamicFieldType(
                    DynamicFieldTypes.Password,
                ),
                null,
                [Validators.required],
                { 'required': true },
            );

            this.Form.CurrentPassword = new DynamicField(
                'AuthUser',
                'Current Password',
                '',
                'CurrentPassword',
                new DynamicFieldType(
                    DynamicFieldTypes.Password,
                ),
                null,
                [Validators.required],
                { 'required': true },
            );
        }

    }

}
