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
                console.log(error);
                this.toastyService.error({
                    title: 'Error',
                    msg: error.text(),
                    theme: 'bootstrap',
                    showClose: true,
                    timeout: 5000
                });
            });
        }
    }
}