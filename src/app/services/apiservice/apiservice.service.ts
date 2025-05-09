import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  constructor(private http: HttpClient) { }

  get(url: string) {
    return this.http.get<any>(url);
  }

  getById(url: string, id: number | string): Observable<any> {
    return this.http.get<any>(`${url}/${id}`);
  }

  create(url: string, postData: any) {
    return this.http.post<any>(url, postData);
  }

  edit(url: string, editData: any) {
    return this.http.patch<any>(url, editData);
  }

  delete(url: string) {
    return this.http.delete<any>(url);
  }
}
