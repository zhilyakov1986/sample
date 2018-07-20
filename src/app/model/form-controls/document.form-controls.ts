import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IDocument } from '../interfaces/document';

export class DocumentDynamicControls {

    Form: IExpandableObject = {
        DateUpload: new DynamicField(
            this.formGroup,
            'Date Upload',
            this.document && this.document.DateUpload || null,
            'DateUpload',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                InputTypes.Datepicker,
                null,
            ),
            null,
            [  ],
            {  },
        ),
        FilePath: new DynamicField(
            this.formGroup,
            'File Path',
            this.document && this.document.hasOwnProperty('FilePath') && this.document.FilePath !== null ? this.document.FilePath.toString() : '',
            'FilePath',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(200) ],
            { 'required': true, 'maxlength': 200 },
        ),
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.document && this.document.hasOwnProperty('Name') && this.document.Name !== null ? this.document.Name.toString() : '',
            'Name',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(200) ],
            { 'required': true, 'maxlength': 200 },
        ),
        UploadedBy: new DynamicField(
            this.formGroup,
            'Uploaded By',
            this.document && this.document.UploadedBy || null,
            'UploadedBy',
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
            null,
            [  ],
            {  },
        ),
    };

    View: IExpandableObject = {
        DateUpload: new DynamicLabel(
            'Date Upload',
            this.document && this.document.DateUpload || null,
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                InputTypes.Datepicker,
                null,
            ),
        ),
        FilePath: new DynamicLabel(
            'File Path',
            this.document && this.document.hasOwnProperty('FilePath') && this.document.FilePath !== null ? this.document.FilePath.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Name: new DynamicLabel(
            'Name',
            this.document && this.document.hasOwnProperty('Name') && this.document.Name !== null ? this.document.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        UploadedBy: new DynamicLabel(
            'Uploaded By',
            this.document && this.document.UploadedBy || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
        ),
    };

    constructor(
        private document?: IDocument,
        private formGroup = 'Document',
    ) { }
}
