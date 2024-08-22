import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Groupe } from '../models/Groupe';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class GroupeService {
  private apiUrl = 'http://localhost:3000/api/groupes';
  private documentApiUrl = 'http://localhost:3000/api/documents';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getGroupes(portfolios?: string): Observable<Groupe[]> {
    const headers = this.authService.getAuthHeaders();
    let params = new HttpParams();
    if (portfolios) {
      params = params.set('portfolios', portfolios);
    }
    return this.http.get<Groupe[]>(this.apiUrl, { headers, params });
  }
   
  uploadDocuments(groupeId: number, portfolio: string, formData: FormData): Observable<any> {
    formData.append('groupeId', groupeId.toString());
    formData.append('portfolio', portfolio);
   
    const url = `${this.apiUrl}/${groupeId}/documents`;
    const headers = this.authService.getAuthHeaders(); 
    return this.http.post(url, formData, { headers });
  }
  
}
