import { ToastOptions } from 'ng2-toastr/src/toast-options';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomToastOptions extends ToastOptions {
  positionClass = 'toast-top-left';
}
