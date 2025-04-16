import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeadManagementService {
  private apiUrl = 'http://localhost:3000/leads'; // JSON Server URL

  constructor(private http: HttpClient) {}

  // Get all leads
  getLeads(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new lead
  addLead(lead: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, lead);
  }

  // Update an existing lead
  updateLead(id: number, lead: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, lead);
  }

  // Delete a lead
  deleteLead(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
