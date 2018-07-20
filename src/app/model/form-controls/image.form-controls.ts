import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IImage } from '../interfaces/image';

export class ImageDynamicControls {

    Form: IExpandableObject = {
        ImagePath: new DynamicField(
            this.formGroup,
            'Image Path',
            this.image && this.image.hasOwnProperty('ImagePath') && this.image.ImagePath !== null ? this.image.ImagePath.toString() : '',
            'ImagePath',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(100) ],
            { 'required': true, 'maxlength': 100 },
        ),
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.image && this.image.hasOwnProperty('Name') && this.image.Name !== null ? this.image.Name.toString() : '',
            'Name',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(50) ],
            { 'maxlength': 50 },
        ),
        ThumbnailPath: new DynamicField(
            this.formGroup,
            'Thumbnail Path',
            this.image && this.image.hasOwnProperty('ThumbnailPath') && this.image.ThumbnailPath !== null ? this.image.ThumbnailPath.toString() : '',
            'ThumbnailPath',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(100) ],
            { 'required': true, 'maxlength': 100 },
        ),
    };

    View: IExpandableObject = {
        ImagePath: new DynamicLabel(
            'Image Path',
            this.image && this.image.hasOwnProperty('ImagePath') && this.image.ImagePath !== null ? this.image.ImagePath.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Name: new DynamicLabel(
            'Name',
            this.image && this.image.hasOwnProperty('Name') && this.image.Name !== null ? this.image.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        ThumbnailPath: new DynamicLabel(
            'Thumbnail Path',
            this.image && this.image.hasOwnProperty('ThumbnailPath') && this.image.ThumbnailPath !== null ? this.image.ThumbnailPath.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private image?: IImage,
        private formGroup = 'Image',
    ) { }
}
