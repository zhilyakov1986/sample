// import { ISubEntitiesComponentConfig, ISubEntityListConfig, IAdditionalSubEntityConfig, AdditionalSubEntityTypes, SubEntitiesComponentConfig } from '@mt-ng2/sub-entities-module';
// import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';
// import { IEntityListConfig, IEntityListColumn, EntityListDeleteColumn } from '@mt-ng2/entity-list-module';

// import { Observable } from 'rxjs/Observable';

// import { entityListModuleConfig } from '../../common/shared.module';
// import { CustomerShippingAddressDynamicControlsPartial } from '../partials/customer-shipping-address.form-controls';

// import { formatAddress } from '@mt-ng2/format-functions';
// import { ICustomerLocation } from '../interfaces/customer-location';
// import { CustomerLocationService } from '../../customer-locations/customerlocation.service';

// export class CustomerLocationsSubEntitiesConfig
// extends SubEntitiesComponentConfig<ICustomerLocation>
// implements ISubEntitiesComponentConfig<ICustomerLocation> {
//     constructor() {
//         super(
//             {
//                 Name: '',
//                 Id: 0,
//                 CustomerId: 0,
//                 SetupServiceAreaId: 0,
//                 AddressId: 0,
//                 Archived: false,
//             },
//             'CustomerLocation',
//             'CustomerLocations',
//             {
//                 EntityListConfig: new CustomerLocationsSubEntityListConfig(),
//                 FilterServices: [CustomerLocationService],
//             },
//             entityListModuleConfig.itemsPerPage,
//         );
//     }
// }
