import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BrowserXhr } from '@angular/http';

@Injectable()
export class ProgressService {
    private uploadProgress: any;

    startTracking() {
        this.uploadProgress = new Subject();
        return this.uploadProgress;
    }
    notify(progress: any) {
        this.uploadProgress.next(progress);
    }
    endTracking() {
        this.uploadProgress.complete();
    }
}

@Injectable()
export class BrowserXhrWithProgress extends BrowserXhr {

    constructor(private progressService: ProgressService) { super(); }

    build(): XMLHttpRequest {
        var xhr: XMLHttpRequest = super.build();

        xhr.upload.onprogress = (event) => {
            this.progressService.notify(this.createProgress(event));
        };

        xhr.upload.onloadend = () => {
            this.progressService.endTracking();
        };

        return xhr;
    }

    private createProgress(event: ProgressEvent) {
        return {
            total: event.total,
            percentage: Math.round(event.loaded / event.total * 100)
        };
    }
}