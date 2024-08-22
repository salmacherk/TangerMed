import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ouvrage } from '../models/Ouvrage';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class OuvrageService {
  private apiUrl = 'http://localhost:3000/api/ouvrages';
  private documentApiUrl = 'http://localhost:3000/api/documents';

  constructor(private http: HttpClient, private authService: AuthService) {}

 
  getOuvrages(portfolios?: string): Observable<Ouvrage[]> {
    const headers = this.authService.getAuthHeaders(); 
    let params = new HttpParams();
    if (portfolios) {
      params = params.set('portfolios', portfolios);
    }
    return this.http.get<Ouvrage[]>(this.apiUrl, { headers, params });
  }


  uploadDocuments(ouvrageId: number, portfolio: string, formData: FormData): Observable<any> {
    const headers = this.authService.getAuthHeaders(); 
    formData.append('ouvrageId', ouvrageId.toString());
    formData.append('portfolio', portfolio);

    const url = `${this.apiUrl}/${ouvrageId}/documents`;
    return this.http.post(url, formData, { headers });
  }
}
