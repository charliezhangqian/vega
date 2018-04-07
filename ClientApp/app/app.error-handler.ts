import { ToastyService } from 'ng2-toasty';
import { ErrorHandler, Injectable, NgZone } from "@angular/core";

@Injectable()
export class AppErrorhandler implements ErrorHandler {
    constructor(
        private toastyService: ToastyService,
        private ngZone: NgZone
    ) {

    }
    handleError(error: any): void {
        if (typeof (window) !== 'undefined') {
            this.ngZone.run(() => {
                this.toastyService.error({
                    title: 'Error',
                    msg: 'An unexpected error happened.',
                    theme: 'bootstrap',
                    showClose: true,
                    timeout: 5000
                });
            });
        }
    }
}