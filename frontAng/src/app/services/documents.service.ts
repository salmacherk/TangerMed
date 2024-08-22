import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/Document';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private apiUrl = 'http://localhost:3000/api/documents';

  constructor(private http: HttpClient) {}

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl);
  }

  getDocumentsByActif(actifId: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}?actifId=${actifId}`);
  }

  getDocumentsByGroupe(groupeId: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}?groupeId=${groupeId}`);
  }

  getDocumentsByOuvrage(ouvrageId: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}?ouvrageId=${ouvrageId}`);
  }
  

  
  deleteDocument(documentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${documentId}`);
  }
  getDocumentsByBatiment(batimentId: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}?batimentId=${batimentId}`);
  }
  
  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${documentId}`, { responseType: 'blob' });
  }
 
  
}
