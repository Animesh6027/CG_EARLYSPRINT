import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
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

  invite(payload: { startupId: number; invitedUserId: number; role: string; }): Observable<any> {
    return this.http.post(`${this.baseUrl}/teams/invite`, payload, { headers: this.getHeaders() });
  }

  getUserInvitations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/teams/invitations/user`, { headers: this.getHeaders() });
  }

  join(invitationId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/teams/join`, { invitationId }, { headers: this.getHeaders() });
  }

  reject(invitationId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/teams/invitations/${invitationId}/reject`, {}, { headers: this.getHeaders() });
  }

  getActiveTeams(): Observable<any> {
    return this.http.get(`${this.baseUrl}/teams/member/active`, { headers: this.getHeaders() });
  }

  getMemberHistory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/teams/member/history`, { headers: this.getHeaders() });
  }

  getTeamMembers(startupId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/teams/startup/${startupId}`, { headers: this.getHeaders() });
  }

  markInterest(startupId: number, desiredRole: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/teams/interests/startup/${startupId}`,
      { desiredRole },
      { headers: this.getHeaders() }
    );
  }

  getMyInterests(): Observable<any> {
    return this.http.get(`${this.baseUrl}/teams/interests/mine`, { headers: this.getHeaders() });
  }

  getFounderInterests(): Observable<any> {
    return this.http.get(`${this.baseUrl}/teams/interests/founder`, { headers: this.getHeaders() });
  }

  acceptInterest(interestId: number, role: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/teams/interests/${interestId}/accept`, { role }, { headers: this.getHeaders() });
  }

  rejectInterest(interestId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/teams/interests/${interestId}/reject`, {}, { headers: this.getHeaders() });
  }
}
