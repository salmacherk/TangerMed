import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Batiment } from '../models/Batiment';
import { AuthService } from './auth.service';
import { Groupe } from '../models/Groupe';

@Injectable({
  providedIn: 'root',
})
export class BatimentService {
  private apiUrl = 'http://localhost:3000/api/batiments';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getBatiments(sites?: string[]): Observable<Batiment[]> {
    let params = {};
    if (sites && sites.length > 0) {
        params = { sites: sites.join(',') };
    }
    const headers = this.authService.getAuthHeaders(); 
    
    return this.http.get<Batiment[]>(this.apiUrl, { params,headers });
}

uploadDocuments(batimentId: number, formData: FormData, groupeId?: number): Observable<any> {
 
  formData.append('batimentId', batimentId.toString());

  
  if (groupeId !== undefined) {
    formData.append('groupeId', groupeId.toString());
  }

  const url = `${this.apiUrl}/${batimentId}/documents`;
  const headers = this.authService.getAuthHeaders(); 
  return this.http.post(url, formData, { headers });
}
  getSites(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/sites`);
  }
  getGroupesByBatimentId(batimentId: number): Observable<Groupe[]> {
    return this.http.get<Groupe[]>(`${this.apiUrl}/${batimentId}/groupes`);
  }
  getBatimentById(batimentId: number): Observable<Batiment> {
    const url = `${this.apiUrl}/${batimentId}`;
    return this.http.get<Batiment>(url);
  }
  
}

