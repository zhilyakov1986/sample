import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { NgxMaskModule } from 'ngx-mask';
import { FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module';

import { DynamicFormModule } from '@mt-ng2/dynamic-form';
import { MtAlertsModule } from '@mt-ng2/alerts-module';
import { MtNoteControlModule } from '@mt-ng2/note-control';
import { EntityComponentsNotesModule } from '@mt-ng2/entity-components-notes';
import { EntityComponentsAddressesModule } from '@mt-ng2/entity-components-addresses';
import { MtContactControlModule } from '@mt-ng2/contact-control';
import { EntityComponentsContactsModule } from '@mt-ng2/entity-components-contacts';
import { MtDocumentControlModule } from '@mt-ng2/document-control';
import { EntityComponentsDocumentsModule } from '@mt-ng2/entity-components-documents';
import { EntityComponentsPhonesModule } from '@mt-ng2/entity-components-phones';
import { MtSearchFilterSelectModule } from '@mt-ng2/search-filter-select-control';
import { MtSearchFilterDaterangeModule } from '@mt-ng2/search-filter-daterange-control';
import { MtPreventDoubleClickButtonModule } from '@mt-ng2/disable-double-click';
import { MtPhotoControlModule } from '@mt-ng2/photo-control';
import { EntityListModule, IEntityListModuleConfig } from '@mt-ng2/entity-list-module';
export const entityListModuleConfig: IEntityListModuleConfig = {
  itemsPerPage: 10,
};

import { ImageCropperComponent } from 'ng2-img-cropper';
import { CommonService } from './services/common.service';
import { AuthEntityModule } from '../auth-entity/auth-entity.module';
import { AuthEntityService } from '../auth-entity/auth-entity.service';
import { MtManagedListControlModule } from '@mt-ng2/managed-list-control';
import { MtSearchBarControlModule } from '@mt-ng2/searchbar-control';

import {DndModule} from 'ng2-dnd';

@NgModule({
  exports: [
    AuthEntityModule,
    CommonModule,
    NgbModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    BrowserAnimationsModule,
    DynamicFormModule,
    MtPhotoControlModule,
    NgxMaskModule,
    MtNoteControlModule,
    EntityComponentsNotesModule,
    MtContactControlModule,
    EntityComponentsAddressesModule,
    EntityComponentsContactsModule,
    MtManagedListControlModule,
    MtDocumentControlModule,
    EntityComponentsDocumentsModule,
    EntityComponentsPhonesModule,
    MtSearchFilterSelectModule,
    MtSearchFilterDaterangeModule,
    MtPreventDoubleClickButtonModule,
    EntityListModule,
    MtAlertsModule,
    MtSearchBarControlModule,
  ],
  imports: [
    AuthEntityModule,
    CommonModule,
    NgbModule,
    RouterModule,
    FormsModule,
    BrowserAnimationsModule,
    DynamicFormModule.forRoot(CommonService),
    NgxMaskModule,
    FileUploadModule,
    MtNoteControlModule.forRoot(),
    EntityComponentsNotesModule.forRoot(),
    MtContactControlModule.forRoot(CommonService),
    MtManagedListControlModule,
    MtPhotoControlModule.forRoot(),
    EntityComponentsAddressesModule.forRoot(),
    EntityComponentsContactsModule.forRoot(),
    MtAlertsModule.forRoot(),
    MtDocumentControlModule.forRoot(),
    EntityComponentsDocumentsModule.forRoot(),
    EntityComponentsPhonesModule.forRoot(),
    MtSearchFilterSelectModule.forRoot(),
    MtSearchFilterDaterangeModule.forRoot(),
    MtPreventDoubleClickButtonModule.forRoot(),
    EntityListModule.forRoot(entityListModuleConfig),
    MtSearchBarControlModule.forRoot(),
  ],
})
export class SharedModule {
  static forRoot(): any {
    return {
      ngModule: SharedModule,
      providers: [CommonService, AuthEntityService],
    };
  }
}
