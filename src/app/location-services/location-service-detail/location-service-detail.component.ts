import {
    Component,
    OnInit,
    Input,
} from '@angular/core';

import { ILocationService } from '../../model/interfaces/location-service';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { LocationServiceService } from '../locationservice.service';
import { ICustomerLocation } from '../../model/interfaces/customer-location';
import { CustomerLocationService } from '../../customer-locations/customerlocation.service';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { GoodService } from '../../goods/good.service';
import { IGood } from '../../model/interfaces/good';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IContract } from '../../model/interfaces/contract';
import { UserRoleEnum } from '../../common/user-roles-enum';
import { ContractService } from '../../contracts/contract.service';
import { UnitTypeService } from '../../manage/unit-type.service';

interface IDictionary {
    [key: string]: number;
}

@Component({
    selector: 'app-location-service-detail',
    styles: [
        `
            ul {
                list-style-type: none;
            }
        `,
    ],
    templateUrl: './location-service-detail.component.html',
})
export class LocationServiceDetailComponent implements OnInit {
    @Input() contract: IContract;

    locationServices: ILocationService;
    descriptionForm: FormGroup;
    customerLocations: ICustomerLocation[];
    currentCustomerLocation: ICustomerLocation;
    listOfIds: number[] = [];
    locationSelected = false;
    availableServices: IGood[];
    currentService: IGood;
    serviceSelected = false;
    showTotal = false;
    setLocation: string;
    locationAddressId: number;
    taxable: boolean;
    lineItemTaxRate = 0;
    lineItemTax = 0;
    locationStateTax = 0;
    totalLineItem = 0;
    totalAll = 0;
    quantity = 1;
    currentServicePrice: number;
    currentServiceCost: number;
    unit: string;
    currentUserRole: any;
    listOfServicesForLocation: ILocationService[] = [];
    services: IGood[];

    get TotalPrice(): number {
        let tempTotal = 0;
        if (this.listOfServicesForLocation.length !== 0) {
            this.listOfServicesForLocation.forEach(
                (lsfl) =>
                    (tempTotal +=
                        lsfl.Price * lsfl.Quantity +
                        (lsfl.Good.Taxable
                            ? this.locationStateTax * lsfl.Price * lsfl.Quantity
                            : 0)),
            );
        }
        return tempTotal;
    }

    get TotalLineItem(): number {
        return this.quantity * (this.currentServicePrice + this.CalculatedTax);
    }

    getLineItemTaxRate(): void {
        this.locationServicesService
            .getStateTaxRateByAddressId(this.locationAddressId)
            .subscribe((success) => {
                this.locationStateTax = success;
            });
    }

    get CalculatedTax(): number {
        let tax = 0;
        if (this.taxable) {
            tax =
                this.locationStateTax *
                this.currentServicePrice *
                this.quantity;

            return tax;
        }
        return tax;
    }

    get AvailableServices(): IGood[] {
        const selectedServices = this.listOfServicesForLocation.map(
            (item) => item.Good,
        );
        const selectedIds = selectedServices.map((item) => item.Id);

        // filters of all available services from already active ones
        let availableServices = this.services.filter(
            (item) => !selectedIds.includes(item.Id),
        );
        return availableServices;
    }

    constructor(
        private fb: FormBuilder,
        private goodService: GoodService,
        private customerLocationService: CustomerLocationService,
        private notificationsService: NotificationsService,
        private locationServicesService: LocationServiceService,
        private unitTypeService: UnitTypeService,
        private contractService: ContractService,
    ) {}
    ngOnInit(): void {
        this.getLocationsForCustomer();
        this.setCurrentService();
        this.createForm();
        this.getUserRole();
    }

    setCurrentService(): void {
        this.currentService = this.goodService.getEmptyGood();
    }

    // service areas for the contract must match customer service areas
    filerLocationForMatching(): void {
        for (let i = 0; i < this.contract.ServiceAreas.length; i++) {
            this.listOfIds.push(this.contract.ServiceAreas[i].Id);
        }
        const result = this.customerLocations.filter((cl) =>
            this.listOfIds.includes(cl.ServiceAreaId),
        );
        this.customerLocations = result;
    }

    getLocationsForCustomer(): void {
        this.customerLocationService
            .getLocationByCustomer(this.contract.CustomerId)
            .subscribe(
                (answer) => {
                    this.customerLocations = answer;
                    this.filerLocationForMatching();
                },
                () => this.notificationsService.error('Failed to get locations for customer'),
            );
    }

    searchLocations = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(
                (term) =>
                    term.length < 2
                        ? []
                        : this.customerLocations
                              .filter(
                                  (v) =>
                                      v.Name.toLowerCase().indexOf(
                                          term.toLowerCase(),
                                      ) > -1,
                              )
                              .slice(0, 10),
            ),
        )

    searchServices = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(
                (term) =>
                    term.length < 2
                        ? []
                        : this.AvailableServices.filter(
                              (v) =>
                                  v.Name.toLowerCase().indexOf(
                                      term.toLowerCase(),
                                  ) > -1,
                          ).slice(0, 10),
            ),
        )

    formatter = (x: { name: string }) => x.name;

    selectedLocation(event: any): void {
        event.preventDefault();
        this.setLocation = event.item.Name;
        this.locationSelected = true;
        this.locationAddressId = event.item.AddressId;
        this.currentCustomerLocation = event.item;
        this.getLineItemTaxRate();
        this.getLocationServicesForLocation(event.item.Id);
        this.getAvailableServices();
        this.showTotal = true;
    }

    getLocationServicesForLocation(locationId: number): void {
        this.locationServicesService
            .getLocationServicesForLocation(locationId)
            .subscribe((success) => {
                this.listOfServicesForLocation = success;
            });
    }

    // gets all available services for matching service Division,
    // and not Archived including already active
    getAvailableServices(): void {
        this.goodService.getAll().subscribe((success) => {
            this.availableServices = success.filter(
                (as) =>
                    as.ServiceDivisionId === this.contract.ServiceDivisionId &&
                    !as.Archived,
            );
            this.services = [...this.availableServices];
        });
    }

    getFullVersionOfLocationService(locationServiceId: number): void {
        this.locationServicesService
            .getCustomServiceLocation(locationServiceId)
            .subscribe((success) => {
                this.locationServices = success;
                this.listOfServicesForLocation.push(this.locationServices);
            });
    }

    // and to the local list of serviceLocations
    addServiceToList(): void {
        this.getFullVersionOfLocationService(this.locationServices.Id);
        const selectedServiceId = this.locationServices.GoodId;

        // filter out selected service from the list of available services
        this.AvailableServices.filter((item) => item.Id !== selectedServiceId);
        this.descriptionForm.reset();
    }

    // if the item get deleted from the list, it is also deleted from db
    // deleted service should reappear in available services
    deleteItemFromList(locationService: ILocationService): void {
        const indexOfLocationService: number = this.listOfServicesForLocation.indexOf(
            locationService,
        );
        if (indexOfLocationService !== -1) {
            this.deleteFromDB(locationService.Id);
            this.listOfServicesForLocation.splice(indexOfLocationService, 1);
            // push the deleted service back to the list of available services
            this.availableServices.push(locationService.Good);
        }
    }
    assignFormValues(): void {
        this.locationServices = this.locationServicesService.getEmptyLocationService();
        this.locationServices.LongDescription = this.descriptionForm.value.longDescription;
        this.locationServices.ShortDescription = this.descriptionForm.value.shortDescription;
        this.locationServices.Price = this.descriptionForm.value.priceField;
        this.locationServices.Quantity = this.descriptionForm.value.quantity;
        this.locationServices.ContractId = this.contract.Id;
        this.locationServices.GoodId = this.currentService.Id;
        this.locationServices.CustomerLocationId = this.currentCustomerLocation.Id;
        this.locationServices.Archived = false;
    }

    saveToDB(locationServices: ILocationService): ILocationService {
        this.locationServicesService
            .create(locationServices)
            .subscribe((success) => {
                this.locationServices.Id = success;
                this.addServiceToList();
                this.serviceSelected = false;
            });
        return this.locationServices;
    }

    // when we select the service and do all necessary changes to it and press add to list button
    checkPricePermissions(): void {
        if (
            (this.currentServicePrice >= this.currentServiceCost &&
                this.currentUserRole === UserRoleEnum.Administrator) ||
            this.currentUserRole === UserRoleEnum.Director
        ) {
            this.assignFormValues();
            this.locationServices = this.saveToDB(this.locationServices);
        } else {
            this.notificationsService.error(
                `Price is too, low, needs to be at least ${
                    this.currentServiceCost
                }$ and you must be an Administrator or Director`,
            );
        }
    }

    deleteFromDB(locationServiceId: number): void {
        this.locationServicesService
            .deleteLocationServiceById(locationServiceId)
            .subscribe(() => {
                    this.notificationsService.success('Service no longer Active');
                });
    }

    clearLocation(): void {
        this.locationSelected = !this.locationSelected;
    }
    getTheUnitName(unitId: number): void {
        this.unitTypeService
            .getById(unitId)
            .subscribe((success) => (this.unit = success.Name));
    }

    selectedService(event: any, input: any): void {
        event.preventDefault();
        input.value = '';
        this.currentService = event.item;
        this.serviceSelected = true;
        this.quantity = 1;
        this.taxable = this.currentService.Taxable;
        this.currentServicePrice = this.currentService.Price;
        this.currentServiceCost = this.currentService.Cost;
        this.getTheUnitName(this.currentService.UnitTypeId);
        this.createForm();
    }

    createForm(): void {
        this.descriptionForm = this.fb.group({
            ifTaxableField: {
                disabled: true,
                value: this.taxable,
            },
            longDescription: this.currentService.ServiceLongDescription,
            priceField: [this.currentServicePrice, Validators.min(100)],
            quantity: this.quantity,
            shortDescription: this.currentService.ServiceShortDescription,
        });

        // updates form values upon price change
        this.descriptionForm
            .get('priceField')
            .valueChanges.subscribe((value) => {
                this.currentServicePrice = value;
                this.totalLineItem =
                    this.quantity *
                    (this.currentServicePrice + this.lineItemTax);
                this.lineItemTax =
                    this.lineItemTaxRate *
                    this.currentServicePrice *
                    this.quantity;
            });
        // updates form value upon quantity change
        this.descriptionForm.get('quantity').valueChanges.subscribe((value) => {
            this.quantity = value;
            this.totalLineItem =
                this.quantity * (this.currentServicePrice + this.lineItemTax);

            this.lineItemTax =
                this.lineItemTaxRate * this.currentServicePrice * this.quantity;
        });
    }

    getUserRole(): void {
        this.contractService.getUserRole(this.contract.UserId).subscribe(
            (success) => {
                this.currentUserRole = success;
            },
            () => this.notificationsService.error('Failed to get User Role'),
        );
    }

    error(): void {
        this.notificationsService.error('Save Failed');
    }

    success(): void {
        this.notificationsService.success('Saved Successfully');
    }
}
