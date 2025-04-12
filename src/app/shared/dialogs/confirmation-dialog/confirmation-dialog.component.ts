import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationDialogData {
    title: string;
    message: string;
    confirmText?: string;
    confirmColor?: 'primary' | 'accent' | 'warn';
}

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) { }
}