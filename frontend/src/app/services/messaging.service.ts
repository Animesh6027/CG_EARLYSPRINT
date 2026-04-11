import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private baseUrl = environment.apiBaseUrl || '';

  constructor(private http: HttpClient) {}

  private normalizeRole(role: string): string {
    if (!role) {
      return '';
    }
    return role.startsWith('ROLE_') ? role : `ROLE_${role}`;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('authUserId');
    const role = localStorage.getItem('authRole') ?? '';

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    if (userId) {
      headers = headers.set('X-User-Id', userId);
    }
    const normalizedRole = this.normalizeRole(role);
    if (normalizedRole) {
      headers = headers.set('X-User-Role', normalizedRole);
    }
    return headers;
  }

  sendMessage(payload: { senderId: number; receiverId: number; startupId: number; content: string; }): Observable<any> {
    return this.http.post(`${this.baseUrl}/messages`, payload, { headers: this.getHeaders() });
  }

  getConversation(user1: number, user2: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/messages/conversation/${user1}/${user2}`, { headers: this.getHeaders() });
  }

  getConversationPartners(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/messages/partners/${userId}`, { headers: this.getHeaders() });
  }
}
