import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Staffapiresponse } from '../../models/staff/staffapiresponse';
import { Staff } from '../../models/staff/staff';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = 'http://localhost:8000/api/v1/businesses/5/staff';

  constructor(private http: HttpClient) {}

  getAllStaff(): Observable<Staffapiresponse> {
    return this.http.get<Staffapiresponse>(this.apiUrl);
  }

  getStaffById(id: number): Observable<Staff> {
    return this.http.get<Staff>(`${this.apiUrl}/${id}`);
  }

  createStaff(staff: Staff): Observable<Staff> {
    return this.http.post<Staff>(this.apiUrl, staff);
  }

  updateStaff(id: number, staff: Staff): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/${id}`, staff);
  }

  deleteStaff(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}