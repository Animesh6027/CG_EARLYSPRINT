import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl || '';
  private authToken = '';
  private authUserId: number | null = null;
  private authRole = '';

  constructor(private http: HttpClient) {}

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  setAuthContext(userId: number | null, role: string): void {
    this.authUserId = userId ?? null;
    this.authRole = role ?? '';
  }

  clearAuthContext(): void {
    this.authUserId = null;
    this.authRole = '';
  }

  private normalizeRole(role: string): string {
    if (!role) {
      return '';
    }
    return role.startsWith('ROLE_') ? role : `ROLE_${role}`;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.authToken) {
      headers = headers.set('Authorization', `Bearer ${this.authToken}`);
    }
    if (this.authUserId !== null && this.authUserId !== undefined) {
      headers = headers.set('X-User-Id', String(this.authUserId));
    }
    const normalizedRole = this.normalizeRole(this.authRole);
    if (normalizedRole) {
      headers = headers.set('X-User-Role', normalizedRole);
    }
    return headers;
  }

  register(name: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, { name, email, password, role });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password }, { withCredentials: true });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgot-password`, { email });
  }

  resetPassword(email: string, pin: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/reset-password`, { email, pin, newPassword });
  }

  getStartups(): Observable<any> {
    return this.http.get(`${this.baseUrl}/startup`, { headers: this.getHeaders() });
  }

  getAllStartups(): Observable<any> {
    return this.http.get(`${this.baseUrl}/startup`, { headers: this.getHeaders() });
  }

  searchStartups(params: { industry?: string; minFunding?: number; maxFunding?: number; }): Observable<any> {
    const query = new URLSearchParams();
    if (params.industry) {
      query.set('industry', params.industry);
    }
    if (params.minFunding !== undefined && params.minFunding !== null) {
      query.set('minFunding', String(params.minFunding));
    }
    if (params.maxFunding !== undefined && params.maxFunding !== null) {
      query.set('maxFunding', String(params.maxFunding));
    }
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return this.http.get(`${this.baseUrl}/startup/search${suffix}`, { headers: this.getHeaders() });
  }

  getStartupDetails(startupId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/startup/details/${startupId}`, { headers: this.getHeaders() });
  }

  getUsersByRole(role: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/role/${role}`, { headers: this.getHeaders() });
  }

  createStartup(startup: {
    name: string;
    description: string;
    industry: string;
    problemStatement: string;
    solution: string;
    fundingGoal: number;
    stage: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/startup`, startup, {
      headers: this.getHeaders(),
      observe: 'response'
    });
  }

  createInvestment(payload: { startupId: number; amount: number; }): Observable<any> {
    return this.http.post(`${this.baseUrl}/investments`, payload, { headers: this.getHeaders() });
  }

  getInvestmentsByStartup(startupId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/investments/startup/${startupId}`, { headers: this.getHeaders() });
  }

  createPaymentOrder(investmentId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/payments/create-order`, { investmentId }, { headers: this.getHeaders() });
  }

  confirmPayment(payload: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; }): Observable<any> {
    return this.http.post(`${this.baseUrl}/payments/confirm`, payload, { headers: this.getHeaders() });
  }

  getInvestmentsByInvestor(): Observable<any> {
    return this.http.get(`${this.baseUrl}/investments/investor`, { headers: this.getHeaders() });
  }

  updateInvestmentStatus(investmentId: number, status: 'APPROVED' | 'REJECTED'): Observable<any> {
    return this.http.put(`${this.baseUrl}/investments/${investmentId}/status`, { status }, { headers: this.getHeaders() });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  updateUser(id: number, payload: { skills?: string; experience?: string; bio?: string; portfolioLinks?: string; }): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, payload, { headers: this.getHeaders() });
  }

  getPublicStartups(): Observable<any> {
    return this.http.get(`${this.baseUrl}/startup`);
  }

  getPublicUsersByRole(role: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/role/${role}`);
  }

  getNotificationsByUser(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/notifications/${userId}`, { headers: this.getHeaders() });
  }

  markNotificationAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifications/${notificationId}/read`, {}, { headers: this.getHeaders() });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, { headers: this.getHeaders(), withCredentials: true });
  }
}
