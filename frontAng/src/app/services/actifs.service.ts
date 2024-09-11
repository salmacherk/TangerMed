import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actif } from '../models/Actif';
import { AuthService } from './auth.service';
import { Groupe } from '../models/Groupe';

@Injectable({
  providedIn: 'root'
})
export class ActifService {
  private apiUrl = 'http://localhost:3000/api/actifs'; 
  private documentApiUrl = 'http://localhost:3000/api/documents';

  constructor(private http: HttpClient,private authService: AuthService) {}

 
  getActifs(portfolios?: string[]): Observable<Actif[]> {
    const headers = this.authService.getAuthHeaders();
    let params = new HttpParams();
    if (portfolios && portfolios.length > 0) {
      params = params.set('portfolios', portfolios.join(','));
    }
    return this.http.get<Actif[]>(this.apiUrl, { headers, params });
  }

  uploadDocuments(actifId: number, portfolio: string, formData: FormData): Observable<any> {
   
    formData.append('actifId', actifId.toString());
    formData.append('portfolio', portfolio);

    const url = `${this.apiUrl}/${actifId}/documents`;
    return this.http.post(url, formData);
  }
  
  
}
