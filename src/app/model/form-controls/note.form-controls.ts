import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { INote } from '../interfaces/note';

export class NoteDynamicControls {

    Form: IExpandableObject = {
        NoteText: new DynamicField(
            this.formGroup,
            'Note Text',
            this.note && this.note.hasOwnProperty('NoteText') && this.note.NoteText !== null ? this.note.NoteText.toString() : '',
            'NoteText',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(5000) ],
            { 'maxlength': 5000 },
        ),
        Title: new DynamicField(
            this.formGroup,
            'Title',
            this.note && this.note.hasOwnProperty('Title') && this.note.Title !== null ? this.note.Title.toString() : '',
            'Title',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(100) ],
            { 'maxlength': 100 },
        ),
    };

    View: IExpandableObject = {
        NoteText: new DynamicLabel(
            'Note Text',
            this.note && this.note.hasOwnProperty('NoteText') && this.note.NoteText !== null ? this.note.NoteText.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Title: new DynamicLabel(
            'Title',
            this.note && this.note.hasOwnProperty('Title') && this.note.Title !== null ? this.note.Title.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private note?: INote,
        private formGroup = 'Note',
    ) { }
}
