import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';
import { AuthUserDynamicControls } from '../../model/form-controls/auth-user.form-controls';
import { AuthUserDynamicControlsExtended } from '../../model/partials/auth-user.form-controls';

import { IAuthUser } from '../../model/interfaces/auth-user';
import { IUserRole } from '../../model/interfaces/user-role';

export class AuthUserDynamicConfig<T extends IAuthUser> extends DynamicConfig<T> implements IDynamicConfig<T> {

    constructor(
        private authUser: T,
        private roles: IUserRole[],
        private configControls?: string[]) {
        super();

        const dynamicControls = new AuthUserDynamicControlsExtended(this.authUser, this.roles);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [
                'Username',
                'RoleId',
            ];
        }

        this.setControls(this.configControls, dynamicControls);
    }

    getForUpdate(): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(),
            viewOnly: this.DynamicLabels,
        };
    }

    getForCreate(): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(),
        };
    }
}
