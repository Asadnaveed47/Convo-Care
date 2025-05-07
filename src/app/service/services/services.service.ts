import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Services } from '../../models/services/services';
import { Servicesapiresponse } from '../../models/services/servicesapiresponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private apiUrl = 'http://localhost:8000/api/v1/businesses/5/services';

  constructor(private http: HttpClient) { }

  getAllServices(): Observable<Servicesapiresponse> {
    return this.http.get<Servicesapiresponse>(this.apiUrl);
  }

  getServiceById(id: number): Observable<Services> {
    return this.http.get<Services>(`${this.apiUrl}/${id}`);
  }

  createService(service: Services): Observable<Services> {
    return this.http.post<Services>(this.apiUrl, service);
  }

  updateService(id: number, service: Services): Observable<Services> {
    return this.http.put<Services>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
