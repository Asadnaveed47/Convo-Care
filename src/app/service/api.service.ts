import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { IndividualConfig, ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(
        private http: HttpClient,
        // private toastr: ToastrService
    ) { }

    public get(slug: string) {
        return this.http.get<any>(slug);
    }

    public getWithParams(slug: string, params: any): Observable<any> {
        return this.http.get<any>(slug, { params: params });
    }

    public post(slug: string, postData: any) {
        return this.http.post<any>(slug, postData);
    }

    public postWithOptions(slug: string, postData: any, options?: any) {
        return this.http.post<any>(slug, postData, { responseType: 'text' as 'json' });
    }

    public delete(slug: string) {
        return this.http.delete<any>(slug);
    }

    public patch(slug: string, postData: any) {
        return this.http.patch<any>(slug, postData);
    }

    public getExportXlsPdf(params: any): Observable<Blob> {
        const url = params;
        const myHeaders = new HttpHeaders();
        myHeaders.append('Access-Control-Allow-Origin', '*');
        return this.http.get(url, { responseType: 'blob', headers: myHeaders });
    }

    public convertIntoFile(data?: any, type?: any, fileName?: string) {
        const blob = new Blob([data], { type: type });
        const url = window.URL.createObjectURL(blob)
        let fileLink = document.createElement('a');

        fileLink.href = url;
        fileLink.download = fileName || 'default-filename';
        fileLink.click();
    }

    public getExportXlsx(params: any, payload: any): Observable<Blob> {
        const url = params;
        const myHeaders = new HttpHeaders();
        myHeaders.append('Access-Control-Allow-Origin', '*');
        return this.http.post(url, payload, { responseType: 'blob', headers: myHeaders });
    }

    public handleError(error: any) {
        if (error instanceof HttpErrorResponse) {
            const e: any = {
                status: error.status,
                error: error.statusText,
                message: error.error['message']
            }

            error = e;
        }
    }

    // successToster(message: string, title: string = '', options: Partial<IndividualConfig> =
    //     { timeOut: 3000, progressAnimation: 'decreasing', progressBar: true }
    // ) {
    //     this.toastr.success(message, title, options);
    // }

    // errorToster(message: string, title: string = '', options: Partial<IndividualConfig> =
    //     { timeOut: 3000, progressAnimation: 'decreasing', progressBar: true }
    // ) {
    //     this.toastr.error(message, title, {
    //         timeOut: 3000, progressBar: true, progressAnimation: 'decreasing',
    //     });
    // }

    // infoToster(message: string, title: string = '', options: Partial<IndividualConfig> =
    //     { timeOut: 3000, progressAnimation: 'decreasing', progressBar: true }
    // ) {
    //     this.toastr.info(message, title, {
    //         timeOut: 3000, progressBar: true, progressAnimation: 'decreasing',
    //     });
    // }

    // warningToster(message: string, title: string = '', options: Partial<IndividualConfig> =
    //     { timeOut: 3000, progressAnimation: 'decreasing', progressBar: true }
    // ) {
    //     this.toastr.warning(message, title, {
    //         timeOut: 3000, progressBar: true, progressAnimation: 'decreasing',
    //     });
    // }
}