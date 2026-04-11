import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { TeamService } from './services/team.service';
import { MessagingService } from './services/messaging.service';

declare var Razorpay: any;

interface Startup {
  id: number;
  name: string;
  description: string;
  industry: string;
  problemStatement?: string;
  solution?: string;
  fundingGoal: number;
  stage: string;
  founderId: number;
  founderName?: string;
  tags?: string[];
  createdAt?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  skills: string;
  experience: string;
  bio: string;
  portfolioLinks: string;
}

interface TeamInvitation {
  id: number;
  startupId: number;
  founderId: number;
  invitedUserId: number;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TeamMember {
  id: number;
  startupId: number;
  userId: number;
  role: string;
  isActive: boolean;
  joinedAt: string;
  leftAt: string;
}

interface MessageItem {
  id: number;
  senderId: number;
  receiverId: number;
  startupId: number;
  content: string;
  createdAt: string;
}

interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface Investment {
  id: number;
  startupId: number;
  investorId: number;
  amount: number;
  status: string;
  createdAt: string;
}

interface CofounderInterest {
  id: number;
  startupId: number;
  founderId: number;
  cofounderId: number;
  status: string;
  desiredRole: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NotificationItem {
  id: number;
  userId: number;
  type: string;
  message: string;
  read: boolean;
  createdAt?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FounderLink';
  subtitle = 'Secure access for founders, investors and cofounders.';

  showRegister = false;
  showForgot = false;
  forgotPinSent = false;

  showLoginPassword = false;
  showRegisterPassword = false;
  showResetPassword = false;

  loginEmail = '';
  loginPassword = '';

  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerRole = 'FOUNDER';

  forgotEmail = '';
  forgotPin = '';
  forgotNewPassword = '';

  token = '';
  isAuthenticated = false;
  authEmail = '';
  userName = '';
  userId: number | null = null;
  role = '';
  startups: Startup[] = [];
  publicStartups: Startup[] = [];
  publicInvestors: User[] = [];
  publicFounders: User[] = [];
  cofounderInvitations: TeamInvitation[] = [];
  cofounderInvitationsLoading = false;
  cofounderInvitationsError = '';
  invitationDetailsOpen: Record<number, boolean> = {};
  cofounderActiveTeams: TeamMember[] = [];
  cofounderActiveTeamsLoading = false;
  cofounderActiveTeamsError = '';
  cofounderHistory: TeamMember[] = [];
  cofounderHistoryLoading = false;
  cofounderHistoryError = '';
  cofounderOpportunities: Startup[] = [];
  cofounderOpportunitiesLoading = false;
  cofounderOpportunitiesError = '';
  cofounderMyInterests: CofounderInterest[] = [];
  cofounderMyInterestsLoading = false;
  cofounderMyInterestsError = '';
  founderInterestRequests: CofounderInterest[] = [];
  founderInterestRequestsLoading = false;
  founderInterestRequestsError = '';
  founderInterestRoleById: Record<number, string> = {};
  teamMembersByStartup: Record<number, TeamMember[]> = {};
  teamMembersLoading: Record<number, boolean> = {};
  cofounders: User[] = [];
  cofoundersLoading = false;
  cofoundersError = '';
  cofounderFilterDomain = '';
  cofounderFilterMinYears: number | null = null;
  showInviteModal = false;
  inviteLoading = false;
  inviteError = '';
  inviteSuccess = '';
  selectedStartupId: number | null = null;
  invitedUserId: number | null = null;
  invitedRole = 'CTO';
  roleOptions = [
    { label: 'CTO', value: 'CTO' },
    { label: 'CPO', value: 'CPO' },
    { label: 'Marketing Head', value: 'MARKETING_HEAD' },
    { label: 'Engineering Lead', value: 'ENGINEERING_LEAD' }
  ];
  investors: User[] = [];
  founders: User[] = [];
  message = '';
  error = '';
  loading = false;
  createLoading = false;
  startupsLoading = false;
  showCreateForm = false;
  createFormError = '';
  createFormSuccess = '';
  showInvestModal = false;
  investLoading = false;
  investError = '';
  investSuccess = '';
  selectedStartup: Startup | null = null;
  investAmount = 1000;
  investmentsByStartup: Record<number, Investment[]> = {};
  investmentsLoading: Record<number, boolean> = {};
  investorNameMap: Record<number, string> = {};
  founderNameMap: Record<number, string> = {};
  userNameMap: Record<number, string> = {};
  userProfileMap: Record<number, User> = {};
  investorInvestments: Investment[] = [];
  investorInvestmentsLoading = false;
  paymentLoading = false;
  paymentError = '';
  paymentSuccess = '';
  private razorpayKeyId = 'rzp_test_SVMhmfHxoIcbac';
  toasts: ToastMessage[] = [];
  showInvestmentHistoryModal = false;
  selectedInvestmentHistoryStartupId: number | null = null;
  showTeamModal = false;
  selectedTeamStartupId: number | null = null;
  startupNameMap: Record<number, string> = {};
  startupDetailsMap: Record<number, Startup> = {};
  showMessageModal = false;
  messagePartnerId: number | null = null;
  messageStartupId: number | null = null;
  messageThread: MessageItem[] = [];
  messageText = '';
  messageLoading = false;
  messageSending = false;
  messageError = '';
  messagePartners: number[] = [];
  messagePartnersLoading = false;
  messageSearch = '';
  notifications: NotificationItem[] = [];
  notificationsLoading = false;
  notificationsError = '';
  showNotificationsPanel = false;
  notificationMarkingId: number | null = null;
  notificationsMarkAllLoading = false;
  private notificationReadAtMap: Record<number, number> = {};
  private notificationCleanupTimer: any = null;
  showProfileModal = false;
  profileSkills = '';
  profileExperience = '';
  profileExperienceDomain = '';
  profileExperienceYears: number | null = null;
  profileLoading = false;
  profileSaving = false;
  profileError = '';
  profileSuccess = '';
  profileEditMode = false;
  startupModel = {
    name: '',
    description: '',
    industry: '',
    problemStatement: '',
    solution: '',
    fundingGoal: 0,
    stage: 'IDEA'
  };

  constructor(
    private api: ApiService,
    private teamService: TeamService,
    private messagingService: MessagingService
  ) {}
  
  founderPage = 1;
  founderPageSize = 4;
  cofounderPage = 1;
  cofounderPageSize = 6;
  
  get pagedMyStartups(): Startup[] {
    // Sort by createdAt (if available) or id (fallback), newest first
    return [...this.myStartups]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
        return bTime - aTime;
      })
      .slice((this.founderPage - 1) * this.founderPageSize, this.founderPage * this.founderPageSize);
  }
  
  get founderTotalPages(): number {
    return Math.ceil(this.myStartups.length / this.founderPageSize) || 1;
  }
  
  nextFounderPage() {
    if (this.founderPage < this.founderTotalPages) {
      this.founderPage++;
    }
  }
  
  prevFounderPage() {
    if (this.founderPage > 1) {
      this.founderPage--;
    }
  }

  get pagedCofounders(): User[] {
    const start = (this.cofounderPage - 1) * this.cofounderPageSize;
    return this.cofounders.slice(start, start + this.cofounderPageSize);
  }

  get cofounderTotalPages(): number {
    return Math.max(1, Math.ceil(this.cofounders.length / this.cofounderPageSize));
  }

  get cofounderRangeLabel(): string {
    if (!this.cofounders.length) {
      return 'Showing 0 of 0';
    }
    const start = (this.cofounderPage - 1) * this.cofounderPageSize + 1;
    const end = Math.min(this.cofounderPage * this.cofounderPageSize, this.cofounders.length);
    return `Showing ${start}-${end} of ${this.cofounders.length}`;
  }

  get filteredCofounders(): User[] {
    const filterDomain = this.cofounderFilterDomain.trim().toLowerCase();
    const minYearsRaw = Number(this.cofounderFilterMinYears);
    const minYears = Number.isFinite(minYearsRaw) && minYearsRaw >= 0 ? Math.floor(minYearsRaw) : null;

    return this.cofounders.filter(cofounder => {
      const expertise = this.parseExperience(cofounder?.experience);
      const domainMatches = !filterDomain || expertise.domain.toLowerCase().includes(filterDomain);
      const yearsMatches = minYears === null || ((expertise.years ?? -1) >= minYears);
      return domainMatches && yearsMatches;
    });
  }

  prevCofounderPage(): void {
    if (this.cofounderPage > 1) {
      this.cofounderPage -= 1;
    }
  }

  nextCofounderPage(): void {
    if (this.cofounderPage < this.cofounderTotalPages) {
      this.cofounderPage += 1;
    }
  }

  applyCofounderFilters(): void {
    this.cofounderPage = 1;
    if (this.invitedUserId && !this.filteredCofounders.some(c => Number(c.id) === Number(this.invitedUserId))) {
      this.invitedUserId = null;
    }
  }

  clearCofounderFilters(): void {
    this.cofounderFilterDomain = '';
    this.cofounderFilterMinYears = null;
    this.applyCofounderFilters();
  }

  ngOnInit(): void {
    this.startNotificationCleanupTimer();
    const savedToken = localStorage.getItem('authToken');
    const savedEmail = localStorage.getItem('authEmail');
    const savedUserName = localStorage.getItem('authUserName');
    const savedRole = localStorage.getItem('authRole');
    const savedUserId = localStorage.getItem('authUserId');

    if (savedToken) {
      this.token = savedToken;
      this.authEmail = savedEmail ?? '';
      this.userName = savedUserName ?? '';
      this.role = savedRole ?? '';
      this.userId = savedUserId ? Number(savedUserId) : null;
      this.isAuthenticated = true;
      this.api.setAuthToken(this.token);
      this.api.setAuthContext(this.userId, this.role);
      if (!this.userName && this.userId) {
        this.api.getUserById(this.userId).subscribe({
          next: result => {
            const payload = result?.data ?? result ?? {};
            const name = payload.name ?? payload.fullName ?? payload.username ?? '';
            if (name) {
              this.userName = name;
              localStorage.setItem('authUserName', name);
            }
          },
          error: () => {}
        });
      }
    }

    this.loadPublicData();
    if (this.isAuthenticated) {
      this.loadRoleData();
    }
  }

  ngOnDestroy(): void {
    if (this.notificationCleanupTimer) {
      clearInterval(this.notificationCleanupTimer);
      this.notificationCleanupTimer = null;
    }
  }

  get normalizedRole(): string {
    return (this.role || '').toUpperCase();
  }

  get isFounder(): boolean {
    return this.normalizedRole === 'FOUNDER';
  }

  get isInvestor(): boolean {
    return this.normalizedRole === 'INVESTOR';
  }

  get isCofounder(): boolean {
    return this.normalizedRole === 'COFOUNDER';
  }

  get roleLabel(): string {
    return this.normalizedRole || 'GUEST';
  }

  get userDisplayName(): string {
    return this.userName || this.authEmail || 'Account';
  }

  get myStartups(): Startup[] {
    if (!this.startups?.length) {
      return [];
    }
    if (!this.userId) {
      return this.startups;
    }
    return this.startups.filter(startup => startup.founderId === this.userId);
  }

  get founderStartupCount(): number {
    return this.isFounder ? this.myStartups.length : this.startups.length;
  }

  get founderInvestorCount(): number {
    if (!this.isFounder) {
      return 0;
    }
    const investorIds = new Set<number>();
    this.myStartups.forEach(startup => {
      const investments = this.investmentsByStartup[startup.id] ?? [];
      investments
        .filter(inv => inv.status === 'APPROVED')
        .forEach(inv => investorIds.add(inv.investorId));
    });
    return investorIds.size;
  }

  get founderInvestmentCount(): number {
    if (!this.isFounder) {
      return 0;
    }
    let total = 0;
    this.myStartups.forEach(startup => {
      const investments = this.investmentsByStartup[startup.id] ?? [];
      total += investments.filter(inv => inv.status === 'COMPLETED').length;
    });
    return total;
  }

  get founderTotalInvestedAmount(): number {
    if (!this.isFounder) {
      return 0;
    }
    let total = 0;
    this.myStartups.forEach(startup => {
      const investments = this.investmentsByStartup[startup.id] ?? [];
      investments.forEach(inv => {
        if (inv.status === 'COMPLETED') {
          total += Number(inv.amount) || 0;
        }
      });
    });
    return total;
  }

  get investorStartupCount(): number {
    if (!this.isInvestor) {
      return 0;
    }
    const ids = new Set<number>();
    this.investorInvestments.forEach(inv => {
      if (inv.startupId) {
        ids.add(inv.startupId);
      }
    });
    return ids.size;
  }

  get investorTotalInvestedAmount(): number {
    if (!this.isInvestor) {
      return 0;
    }
    return this.investorInvestments.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  }

  get cofounderStartupCount(): number {
    if (!this.isCofounder) {
      return 0;
    }
    return this.cofounderActiveTeams.length;
  }

  getAcceptedCofounderInvitationsCount(): number {
    return (this.cofounderInvitations || []).filter(inv =>
      this.upper(inv.status) === 'ACCEPTED'
    ).length;
  }

  getFounderTeamMembers(): User[] {
    const members: User[] = [];
    Object.values(this.teamMembersByStartup).forEach(list => {
      (list || []).forEach(member => {
        const userId = member.userId;
        if (!userId) {
          return;
        }
        if (!this.userNameMap[userId]) {
          this.loadUserName(userId);
        }
        const name = this.userNameMap[userId] || `User #${userId}`;
        members.push({
          id: userId,
          name,
          email: '',
          role: 'COFOUNDER',
          skills: '',
          experience: '',
          bio: '',
          portfolioLinks: ''
        });
      });
    });
    const unique = new Map<number, User>();
    members.forEach(member => {
      if (!unique.has(member.id)) {
        unique.set(member.id, member);
      }
    });
    return Array.from(unique.values());
  }

  getFounderTeamCount(): number {
    return this.getFounderTeamMembers().length;
  }

  getBadges(startup: Startup): string[] {
    if (startup.tags && startup.tags.length) {
      return startup.tags;
    }
    const badges = [startup.industry, startup.stage].filter(Boolean);
    return badges.length ? badges : ['Startup'];
  }

  getStartupInvestedAmount(startupId: number): number {
    const investments = this.investmentsByStartup[startupId] ?? [];
    return investments
      .filter(inv => inv.status === 'APPROVED' || inv.status === 'COMPLETED')
      .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  }

  getFundingProgress(startup: Startup): number {
    const goal = Number(startup.fundingGoal) || 0;
    if (!goal) {
      return 0;
    }
    const invested = this.getStartupInvestedAmount(startup.id);
    return Math.min(100, Math.round((invested / goal) * 100));
  }

  getFundingProgressWidth(startup: Startup): number {
    const goal = Number(startup.fundingGoal) || 0;
    if (!goal) {
      return 0;
    }
    const invested = this.getStartupInvestedAmount(startup.id);
    if (invested <= 0) {
      return 0;
    }
    const raw = (invested / goal) * 100;
    return Math.min(100, Math.max(1, raw));
  }

  getFundingProgressLabel(startup: Startup): string {
    const goal = Number(startup.fundingGoal) || 0;
    if (!goal) {
      return '0%';
    }
    const invested = this.getStartupInvestedAmount(startup.id);
    if (invested <= 0) {
      return '0%';
    }
    const raw = (invested / goal) * 100;
    if (raw >= 1) {
      return `${Math.round(raw)}%`;
    }
    return `${raw.toFixed(2)}%`;
  }

  upper(value: any): string {
    return String(value ?? '').toUpperCase().trim();
  }

  getSortedInvestmentsForStartup(startupId: number): Investment[] {
    const investments = this.investmentsByStartup[startupId] ?? [];
    return [...investments].sort((a, b) => this.getInvestmentTime(b) - this.getInvestmentTime(a));
  }

  getRecentInvestmentsForStartup(startupId: number, limit = 4): Investment[] {
    return this.getSortedInvestmentsForStartup(startupId).slice(0, limit);
  }

  openInvestmentHistory(startupId: number): void {
    this.selectedInvestmentHistoryStartupId = startupId;
    this.showInvestmentHistoryModal = true;
  }

  closeInvestmentHistory(): void {
    this.showInvestmentHistoryModal = false;
    this.selectedInvestmentHistoryStartupId = null;
  }

  getInvestmentStatusClass(status: string): string {
    const normalized = this.upper(status);
    if (normalized === 'COMPLETED') {
      return 'text-emerald-600';
    }
    if (normalized === 'FAILED' || normalized === 'PAYMENT_FAILED') {
      return 'text-rose-600';
    }
    if (normalized === 'APPROVED') {
      return 'text-indigo-600';
    }
    if (normalized === 'REJECTED') {
      return 'text-slate-500';
    }
    return 'text-amber-600';
  }

  private getInvestmentTime(investment: Investment): number {
    const raw = (investment as any)?.createdAt ?? (investment as any)?.created_at ?? (investment as any)?.createdOn ?? (investment as any)?.updatedAt ?? '';
    const time = raw ? new Date(raw).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
  }

  getFounderName(startup: Startup): string {
    if (startup.founderName) {
      return startup.founderName;
    }
    if (startup.founderId && this.founderNameMap[startup.founderId]) {
      return this.founderNameMap[startup.founderId];
    }
    if (startup.founderId) {
      return `Founder #${startup.founderId}`;
    }
    return 'Founder';
  }

  private normalizeAuthResponse(result: any): any {
    const payload = result?.data ?? result ?? {};
    const user = payload.user ?? payload.userData ?? payload.profile;
    if (user && typeof user === 'object') {
      return { ...payload, ...user };
    }
    return payload;
  }

  showLogin(): void {
    this.showRegister = false;
    this.showForgot = false;
    this.forgotPinSent = false;
    this.clearStatus();
  }

  toggleRegister(): void {
    this.showRegister = !this.showRegister;
    this.showForgot = false;
    this.forgotPinSent = false;
    this.clearStatus();
  }

  toggleForgot(): void {
    this.showForgot = !this.showForgot;
    this.showRegister = false;
    this.forgotPinSent = false;
    this.clearStatus();
  }

  togglePassword(field: 'login' | 'register' | 'reset'): void {
    if (field === 'login') {
      this.showLoginPassword = !this.showLoginPassword;
    } else if (field === 'register') {
      this.showRegisterPassword = !this.showRegisterPassword;
    } else {
      this.showResetPassword = !this.showResetPassword;
    }
  }

  login(): void {
    this.clearStatus();
    if (!this.loginEmail || !this.loginPassword) {
      this.error = 'Please enter both email and password.';
      return;
    }
    this.loading = true;
    this.api.login(this.loginEmail, this.loginPassword).subscribe({
      next: result => {
        this.loading = false;
        const auth = this.normalizeAuthResponse(result);
        this.token = auth.token ?? auth.accessToken ?? '';
        this.userId = auth.userId ?? auth.user_id ?? null;
        this.role = auth.role ?? auth.userRole ?? auth.user_role ?? '';
        this.authEmail = auth.email ?? auth.userEmail ?? auth.user_email ?? '';
        this.userName = auth.name ?? auth.fullName ?? auth.displayName ?? auth.userName ?? auth.username ?? this.registerName ?? '';
        this.isAuthenticated = !!this.token;
        if (this.isAuthenticated) {
          localStorage.setItem('authToken', this.token);
          localStorage.setItem('authEmail', this.authEmail);
          localStorage.setItem('authUserName', this.userName);
          localStorage.setItem('authRole', this.role);
          localStorage.setItem('authUserId', String(this.userId ?? ''));
        }
        this.api.setAuthToken(this.token);
        this.api.setAuthContext(this.userId, this.role);
        if (!this.userName && this.userId) {
          this.api.getUserById(this.userId).subscribe({
            next: profile => {
              const payload = profile?.data ?? profile ?? {};
              const name = payload.name ?? payload.fullName ?? payload.username ?? '';
              if (name) {
                this.userName = name;
                localStorage.setItem('authUserName', name);
              }
            },
            error: () => {}
          });
        }
        this.message = this.userName ? `Welcome back, ${this.userName}` : (this.authEmail ? `Welcome back, ${this.authEmail}` : 'Welcome back!');
        this.loadStartups();
        this.loadRoleData();
      },
      error: err => {
        this.loading = false;
        this.isAuthenticated = false;
        this.error = err?.error?.message || 'Unable to login. Check backend and credentials.';
      }
    });
  }

  register(): void {
    this.clearStatus();
    if (!this.registerName || !this.registerEmail || !this.registerPassword) {
      this.error = 'Please complete all registration fields.';
      return;
    }
    if (this.registerPassword.length < 8) {
      this.error = 'Password must be at least 8 characters long.';
      return;
    }
    this.loading = true;
    this.api.register(this.registerName, this.registerEmail, this.registerPassword, this.registerRole).subscribe({
      next: result => {
        this.loading = false;
        this.message = result?.message || 'Registration successful. Please login.';
        this.showRegister = false;
        this.loginEmail = this.registerEmail;
        this.loginPassword = '';
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to register. Check form values.';
      }
    });
  }

  forgotPassword(): void {
    this.clearStatus();
    if (!this.forgotEmail) {
      this.error = 'Enter your registered email to receive a reset PIN.';
      return;
    }
    this.loading = true;
    this.api.forgotPassword(this.forgotEmail).subscribe({
      next: result => {
        this.loading = false;
        this.forgotPinSent = true;
        this.message = result?.message || 'Password reset PIN sent to your email.';
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to request password reset.';
      }
    });
  }

  resetPassword(): void {
    this.clearStatus();
    if (!this.forgotEmail || !this.forgotPin || !this.forgotNewPassword) {
      this.error = 'Enter email, PIN, and new password to reset your password.';
      return;
    }
    if (this.forgotNewPassword.length < 8) {
      this.error = 'New password must be at least 8 characters long.';
      return;
    }
    this.loading = true;
    this.api.resetPassword(this.forgotEmail, this.forgotPin, this.forgotNewPassword).subscribe({
      next: result => {
        this.loading = false;
        this.message = result?.message || 'Password reset successful. Please login.';
        this.showForgot = false;
        this.forgotPinSent = false;
        this.showResetPassword = false;
        this.loginEmail = this.forgotEmail;
        this.loginPassword = '';
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to reset password.';
      }
    });
  }

  loadPublicData(): void {
    const cachedInvestors = localStorage.getItem('publicInvestorsCount');
    const cachedFounders = localStorage.getItem('publicFoundersCount');
    const cachedStartups = localStorage.getItem('publicStartupsCount');
    if (cachedInvestors) {
      const count = Number(cachedInvestors);
      if (Number.isFinite(count)) {
        this.publicInvestors = new Array(Math.max(0, count)).fill({} as User);
      }
    }
    if (cachedFounders) {
      const count = Number(cachedFounders);
      if (Number.isFinite(count)) {
        this.publicFounders = new Array(Math.max(0, count)).fill({} as User);
      }
    }
    if (cachedStartups) {
      const count = Number(cachedStartups);
      if (Number.isFinite(count)) {
        this.publicStartups = new Array(Math.max(0, count)).fill({} as Startup);
      }
    }

    this.api.getPublicStartups().subscribe({
      next: result => {
        this.publicStartups = result?.data ?? [];
        localStorage.setItem('publicStartupsCount', String(this.publicStartups.length));
      },
      error: err => {
        console.error('Unable to load startups:', err);
      }
    });

    this.api.getPublicUsersByRole('INVESTOR').subscribe({
      next: result => {
        this.publicInvestors = result?.data ?? result ?? [];
        localStorage.setItem('publicInvestorsCount', String(this.publicInvestors.length));
      },
      error: err => {
        console.error('Unable to load investors:', err);
      }
    });

    this.api.getPublicUsersByRole('FOUNDER').subscribe({
      next: result => {
        this.publicFounders = result?.data ?? result ?? [];
        localStorage.setItem('publicFoundersCount', String(this.publicFounders.length));
      },
      error: err => {
        console.error('Unable to load founders:', err);
      }
    });
  }

  loadStartups(): void {
    this.clearStatus();
    if (this.isCofounder) {
      this.startupsLoading = false;
      return;
    }
    this.startupsLoading = true;
    this.api.getAllStartups().subscribe({
      next: result => {
        console.log('GET /startup response:', result);
        this.startupsLoading = false;
        this.startups = result?.data ?? result ?? [];
        this.loadFounderNames(this.startups);
        if (this.isFounder) {
          this.loadInvestmentsForMyStartups();
        }
        if (this.isInvestor) {
          this.loadInvestorInvestments();
        }
      },
      error: err => {
        console.error('GET /startup error:', err);
        this.startupsLoading = false;
        this.error = err?.error?.message || 'Unable to load startups.';
      }
    });
  }

  loadRoleData(): void {
    if (this.isFounder) {
      this.loadCofounders();
      this.loadFounderInterestRequests();
    }
    if (this.isInvestor) {
      this.loadInvestorInvestments();
    }
    if (this.isCofounder) {
      this.loadProfileDetails();
      this.loadCofounderInvitations();
      this.loadCofounderActiveTeams();
      this.loadCofounderHistory();
      this.loadCofounderOpportunities();
      this.loadCofounderMyInterests();
    }
    if (this.isAuthenticated) {
      this.loadMessagePartners();
      this.loadNotifications();
    }
  }

  get unreadNotificationCount(): number {
    return this.notifications.filter(item => !item.read).length;
  }

  toggleNotificationsPanel(): void {
    this.showNotificationsPanel = !this.showNotificationsPanel;
    if (this.showNotificationsPanel) {
      this.loadNotifications();
    }
  }

  closeNotificationsPanel(): void {
    this.showNotificationsPanel = false;
  }

  loadNotifications(force = false): void {
    if (!this.userId || (!force && this.notificationsLoading)) {
      return;
    }
    this.notificationsLoading = true;
    this.notificationsError = '';
    this.api.getNotificationsByUser(this.userId).subscribe({
      next: result => {
        this.notificationsLoading = false;
        const raw = result?.data ?? result ?? [];
        const list = Array.isArray(raw) ? raw : [];
        this.notifications = list
          .map((item: any) => ({
            id: Number(item.id),
            userId: Number(item.userId),
            type: String(item.type ?? 'INFO'),
            message: String(item.message ?? ''),
            read: Boolean(item.read),
            createdAt: item.createdAt ?? item.created_at ?? item.time
          }))
          .sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bTime - aTime;
          });

        const now = Date.now();
        this.notifications.forEach(item => {
          if (item.read) {
            if (!this.notificationReadAtMap[item.id]) {
              this.notificationReadAtMap[item.id] = now;
            }
          } else {
            delete this.notificationReadAtMap[item.id];
          }
        });

        this.purgeExpiredReadNotifications();
      },
      error: err => {
        this.notificationsLoading = false;
        this.notificationsError = err?.error?.message || 'Unable to load notifications.';
      }
    });
  }

  markNotificationAsRead(notificationId: number): void {
    if (!notificationId || this.notificationMarkingId === notificationId) {
      return;
    }
    this.notificationMarkingId = notificationId;
    this.api.markNotificationAsRead(notificationId).subscribe({
      next: () => {
        this.notificationMarkingId = null;
        this.notificationReadAtMap[notificationId] = Date.now();
        this.notifications = this.notifications.map(item =>
          item.id === notificationId ? { ...item, read: true } : item
        );
      },
      error: err => {
        this.notificationMarkingId = null;
        this.notificationsError = err?.error?.message || 'Unable to mark notification as read.';
      }
    });
  }

  markAllNotificationsAsRead(): void {
    const unreadIds = this.notifications.filter(item => !item.read).map(item => item.id);
    if (!unreadIds.length || this.notificationsMarkAllLoading) {
      return;
    }
    this.notificationsMarkAllLoading = true;
    this.markAllNotificationsSequential(unreadIds, 0);
  }

  private markAllNotificationsSequential(ids: number[], index: number): void {
    if (index >= ids.length) {
      this.notificationsMarkAllLoading = false;
      const now = Date.now();
      ids.forEach(id => {
        this.notificationReadAtMap[id] = now;
      });
      this.notifications = this.notifications.map(item => ({ ...item, read: true }));
      return;
    }

    this.api.markNotificationAsRead(ids[index]).subscribe({
      next: () => {
        this.markAllNotificationsSequential(ids, index + 1);
      },
      error: err => {
        this.notificationsMarkAllLoading = false;
        this.notificationsError = err?.error?.message || 'Unable to mark all notifications as read.';
      }
    });
  }

  loadInvestorInvestments(): void {
    if (!this.isInvestor) {
      return;
    }
    this.investorInvestmentsLoading = true;
    this.api.getInvestmentsByInvestor().subscribe({
      next: result => {
        console.log('GET /investments/investor response:', result);
        this.investorInvestmentsLoading = false;
        const raw =
          result?.data?.data ??
          result?.data?.content ??
          result?.data ??
          result?.content ??
          result ??
          [];
        const investments = (Array.isArray(raw) ? raw : []).map((inv: any) => {
          const status = String(inv.status ?? inv.investmentStatus ?? inv.state ?? '').toUpperCase().trim();
          return {
            ...inv,
            startupId: inv.startupId ?? inv.startup_id ?? inv.startupID ?? inv.startupIdValue,
            amount: inv.amount ?? inv.investedAmount ?? inv.investmentAmount ?? inv.amountInvested,
            status,
            createdAt: inv.createdAt ?? inv.created_at ?? inv.createdOn
          };
        });
        this.investorInvestments = investments;
        this.prefetchInvestmentStartups(investments);
      },
      error: err => {
        console.error('GET /investments/investor error:', err);
        this.investorInvestmentsLoading = false;
      }
    });
  }

  private prefetchInvestmentStartups(investments: Investment[]): void {
    const startupIds = Array.from(new Set((investments || []).map(inv => Number(inv.startupId)).filter(Boolean)));
    startupIds.forEach(startupId => this.loadStartupName(startupId));
  }

  getStartupNameById(startupId: number): string {
    if (this.startupNameMap[startupId]) {
      return this.startupNameMap[startupId];
    }
    const startup = this.startups.find(item => item.id === startupId);
    if (startup?.name) {
      this.startupNameMap[startupId] = startup.name;
      return startup.name;
    }
    this.loadStartupName(startupId);
    return `Startup #${startupId}`;
  }

  private loadStartupName(startupId: number): void {
    if (this.startupNameMap[startupId] || !startupId) {
      return;
    }
    this.api.getStartupDetails(startupId).subscribe({
      next: result => {
        const payload = result?.data ?? result ?? {};
        if (payload?.name) {
          this.startupNameMap[startupId] = payload.name;
          this.startupDetailsMap[startupId] = payload;
        }
      },
      error: err => {
        console.error(`GET /startup/details/${startupId} error:`, err);
      }
    });
  }

  getStartupDetails(startupId: number): Startup | null {
    if (this.startupDetailsMap[startupId]) {
      return this.startupDetailsMap[startupId];
    }
    this.loadStartupName(startupId);
    return null;
  }

  loadCofounders(): void {
    if (!this.isFounder) {
      return;
    }
    this.cofoundersLoading = true;
    this.cofoundersError = '';
    this.api.getUsersByRole('COFOUNDER').subscribe({
      next: result => {
        console.log('GET /users/role/COFOUNDER response:', result);
        this.cofoundersLoading = false;
        const users = result?.data ?? result ?? [];
        this.cofounders = users.map((user: any) => ({
          ...user,
          id: user.id ?? user.userId
        }));
        this.cofounderPage = Math.min(this.cofounderPage, this.cofounderTotalPages);
      },
      error: err => {
        console.error('GET /users/role/COFOUNDER error:', err);
        this.cofoundersLoading = false;
        this.cofoundersError = err?.error?.message || 'Unable to load cofounders.';
      }
    });
  }

  openInviteModal(startupId: number): void {
    this.selectedStartupId = startupId;
    this.invitedUserId = null;
    this.invitedRole = 'CTO';
    this.inviteError = '';
    this.inviteSuccess = '';
    this.showInviteModal = true;
    if (!this.cofounders.length) {
      this.loadCofounders();
    }
  }

  closeInviteModal(): void {
    this.showInviteModal = false;
    this.inviteError = '';
    this.inviteSuccess = '';
  }

  sendInvite(): void {
    if (!this.selectedStartupId) {
      this.inviteError = 'Startup not selected. Please reopen the invite modal.';
      return;
    }
    const invitedId = Number(this.invitedUserId);
    if (!invitedId || Number.isNaN(invitedId)) {
      this.inviteError = 'Please select a cofounder.';
      return;
    }
    if (!this.invitedRole) {
      this.inviteError = 'Please select a role.';
      return;
    }
    const normalizedRole = String(this.invitedRole || '').trim().toUpperCase().replace(/\s+/g, '_');
    const allowedRoles = ['CTO', 'CPO', 'MARKETING_HEAD', 'ENGINEERING_LEAD'];
    if (!allowedRoles.includes(normalizedRole)) {
      this.inviteError = 'Invalid role selected. Please choose a valid role.';
      return;
    }

    this.inviteLoading = true;
    this.inviteError = '';
    console.log('POST /teams/invite payload:', {
      startupId: this.selectedStartupId,
      invitedUserId: this.invitedUserId,
      role: normalizedRole
    });
    this.teamService.invite({
      startupId: this.selectedStartupId,
      invitedUserId: invitedId,
      role: normalizedRole
    }).subscribe({
      next: result => {
        console.log('POST /teams/invite response:', result);
        this.inviteLoading = false;
        this.inviteSuccess = 'Invitation sent successfully.';
        this.pushToast('success', 'Invitation sent successfully.');
        this.closeInviteModal();
      },
      error: err => {
        console.error('POST /teams/invite error:', err);
        this.inviteLoading = false;
        this.inviteError = err?.error?.message || 'Unable to send invitation.';
        this.pushToast('error', this.inviteError);
      }
    });
  }

  loadCofounderInvitations(): void {
    if (!this.isCofounder) {
      return;
    }
    this.cofounderInvitationsLoading = true;
    this.cofounderInvitationsError = '';
    this.teamService.getUserInvitations().subscribe({
      next: result => {
        console.log('GET /teams/invitations/user response:', result);
        this.cofounderInvitationsLoading = false;
        const invitations = result?.data ?? result ?? [];
        this.cofounderInvitations = invitations;
        invitations.forEach((invite: TeamInvitation) => {
          this.loadStartupName(invite.startupId);
        });
      },
      error: err => {
        console.error('GET /teams/invitations/user error:', err);
        this.cofounderInvitationsLoading = false;
        this.cofounderInvitationsError = err?.error?.message || 'Unable to load invitations.';
      }
    });
  }

  toggleInvitationDetails(invitationId: number): void {
    this.invitationDetailsOpen[invitationId] = !this.invitationDetailsOpen[invitationId];
  }

  acceptInvitation(invite: TeamInvitation): void {
    this.teamService.join(invite.id).subscribe({
      next: result => {
        console.log('POST /teams/join response:', result);
        this.pushToast('success', 'Invitation accepted.');
        this.loadCofounderInvitations();
        this.loadCofounderActiveTeams();
      },
      error: err => {
        console.error('POST /teams/join error:', err);
        this.pushToast('error', err?.error?.message || 'Unable to accept invitation.');
      }
    });
  }

  rejectInvitation(invite: TeamInvitation): void {
    this.teamService.reject(invite.id).subscribe({
      next: result => {
        console.log(`PUT /teams/invitations/${invite.id}/reject response:`, result);
        this.pushToast('info', 'Invitation rejected.');
        this.loadCofounderInvitations();
      },
      error: err => {
        console.error(`PUT /teams/invitations/${invite.id}/reject error:`, err);
        this.pushToast('error', err?.error?.message || 'Unable to reject invitation.');
      }
    });
  }

  loadCofounderActiveTeams(): void {
    if (!this.isCofounder) {
      return;
    }
    this.cofounderActiveTeamsLoading = true;
    this.cofounderActiveTeamsError = '';
    this.teamService.getActiveTeams().subscribe({
      next: result => {
        console.log('GET /teams/member/active response:', result);
        this.cofounderActiveTeamsLoading = false;
        const teams = result?.data ?? result ?? [];
        this.cofounderActiveTeams = teams;
        teams.forEach((team: TeamMember) => {
          this.loadStartupName(team.startupId);
          this.loadTeamMembers(team.startupId);
        });
      },
      error: err => {
        console.error('GET /teams/member/active error:', err);
        this.cofounderActiveTeamsLoading = false;
        this.cofounderActiveTeamsError = err?.error?.message || 'Unable to load active teams.';
      }
    });
  }

  loadCofounderHistory(): void {
    if (!this.isCofounder) {
      return;
    }
    this.cofounderHistoryLoading = true;
    this.cofounderHistoryError = '';
    this.teamService.getMemberHistory().subscribe({
      next: result => {
        console.log('GET /teams/member/history response:', result);
        this.cofounderHistoryLoading = false;
        const history = result?.data ?? result ?? [];
        this.cofounderHistory = history;
        history.forEach((team: TeamMember) => {
          this.loadStartupName(team.startupId);
        });
      },
      error: err => {
        console.error('GET /teams/member/history error:', err);
        this.cofounderHistoryLoading = false;
        this.cofounderHistoryError = err?.error?.message || 'Unable to load history.';
      }
    });
  }

  loadCofounderOpportunities(): void {
    if (!this.isCofounder) {
      return;
    }

    this.cofounderOpportunitiesLoading = true;
    this.cofounderOpportunitiesError = '';

    const expertiseDomain = this.profileExperienceDomain.trim();
    this.api.searchStartups({ industry: expertiseDomain || undefined }).subscribe({
      next: result => {
        this.cofounderOpportunitiesLoading = false;
        const startups = result?.data ?? result ?? [];
        const list = Array.isArray(startups) ? startups : [];
        this.cofounderOpportunities = this.rankStartupsByExpertise(list).slice(0, 12);
      },
      error: () => {
        this.api.getAllStartups().subscribe({
          next: result => {
            this.cofounderOpportunitiesLoading = false;
            const startups = result?.data ?? result ?? [];
            const list = Array.isArray(startups) ? startups : [];
            this.cofounderOpportunities = this.rankStartupsByExpertise(list).slice(0, 12);
          },
          error: err => {
            this.cofounderOpportunitiesLoading = false;
            this.cofounderOpportunitiesError = err?.error?.message || 'Unable to load startup opportunities.';
          }
        });
      }
    });
  }

  private rankStartupsByExpertise(startups: Startup[]): Startup[] {
    const domain = this.profileExperienceDomain.trim().toLowerCase();
    const skills = this.profileSkillChips.map(item => item.toLowerCase());

    return [...startups]
      .map(startup => {
        const text = `${startup.name || ''} ${startup.description || ''} ${startup.industry || ''} ${startup.problemStatement || ''} ${startup.solution || ''}`.toLowerCase();
        const domainScore = domain && text.includes(domain) ? 3 : 0;
        const skillsScore = skills.reduce((score, skill) => score + (skill && text.includes(skill) ? 1 : 0), 0);
        return { startup, score: domainScore + skillsScore };
      })
      .filter(item => item.score > 0 || (!domain && !skills.length))
      .sort((a, b) => b.score - a.score)
      .map(item => item.startup);
  }

  markStartupInterested(payload: { startup: Startup; role: string }): void {
    const startupId = Number(payload?.startup?.id);
    if (!startupId || !this.isCofounder) {
      return;
    }

    this.teamService.markInterest(startupId, payload.role || 'CTO').subscribe({
      next: () => {
        this.pushToast('success', 'Interest submitted to founder.');
        this.loadCofounderMyInterests();
      },
      error: err => {
        this.pushToast('error', err?.error?.message || 'Unable to mark interest.');
      }
    });
  }

  loadCofounderMyInterests(): void {
    if (!this.isCofounder) {
      return;
    }
    this.cofounderMyInterestsLoading = true;
    this.cofounderMyInterestsError = '';
    this.teamService.getMyInterests().subscribe({
      next: result => {
        this.cofounderMyInterestsLoading = false;
        const list = result?.data ?? result ?? [];
        this.cofounderMyInterests = Array.isArray(list) ? list : [];
        this.cofounderMyInterests.forEach(item => this.loadStartupName(item.startupId));
      },
      error: err => {
        this.cofounderMyInterestsLoading = false;
        this.cofounderMyInterestsError = err?.error?.message || 'Unable to load your interest requests.';
      }
    });
  }

  loadFounderInterestRequests(): void {
    if (!this.isFounder) {
      return;
    }
    this.founderInterestRequestsLoading = true;
    this.founderInterestRequestsError = '';
    this.teamService.getFounderInterests().subscribe({
      next: result => {
        this.founderInterestRequestsLoading = false;
        const list = result?.data ?? result ?? [];
        this.founderInterestRequests = Array.isArray(list) ? list : [];
        this.founderInterestRequests.forEach(item => {
          this.loadStartupName(item.startupId);
          this.loadUserName(item.cofounderId);
          this.founderInterestRoleById[item.id] = item.desiredRole || this.founderInterestRoleById[item.id] || 'CTO';
        });
      },
      error: err => {
        this.founderInterestRequestsLoading = false;
        this.founderInterestRequestsError = err?.error?.message || 'Unable to load cofounder interests.';
      }
    });
  }

  acceptInterestRequest(interest: CofounderInterest): void {
    const role = this.founderInterestRoleById[interest.id] || interest.desiredRole || 'CTO';
    this.teamService.acceptInterest(interest.id, role).subscribe({
      next: () => {
        this.pushToast('success', 'Cofounder added to startup team.');
        this.loadFounderInterestRequests();
        this.loadTeamMembers(interest.startupId);
      },
      error: err => {
        this.pushToast('error', err?.error?.message || 'Unable to accept interest request.');
      }
    });
  }

  rejectInterestRequest(interest: CofounderInterest): void {
    this.teamService.rejectInterest(interest.id).subscribe({
      next: () => {
        this.pushToast('info', 'Interest request rejected.');
        this.loadFounderInterestRequests();
      },
      error: err => {
        this.pushToast('error', err?.error?.message || 'Unable to reject interest request.');
      }
    });
  }

  getInterestCofounderSkills(interest: CofounderInterest): string[] {
    const profile = this.userProfileMap[interest.cofounderId];
    const skillsRaw = String(profile?.skills ?? '');
    return skillsRaw
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  getInterestCofounderExpertise(interest: CofounderInterest): string {
    const profile = this.userProfileMap[interest.cofounderId];
    return this.getCofounderExpertise(profile);
  }

  private loadFounderNames(startups: Startup[]): void {
    const founderIds = Array.from(new Set(startups.map(item => item.founderId).filter(Boolean)));
    founderIds.forEach(founderId => {
      if (this.founderNameMap[founderId]) {
        return;
      }
      this.api.getUserById(founderId).subscribe({
        next: result => {
          console.log(`GET /users/${founderId} response:`, result);
          const payload = result?.data ?? result ?? {};
          const name = payload.name ?? payload.fullName ?? payload.username ?? payload.email ?? `Founder #${founderId}`;
          this.founderNameMap[founderId] = name;
        },
        error: err => {
          console.error(`GET /users/${founderId} error:`, err);
          this.founderNameMap[founderId] = `Founder #${founderId}`;
        }
      });
    });
  }

  private loadInvestmentsForMyStartups(): void {
    this.myStartups.forEach(startup => {
      this.loadInvestmentsForStartup(startup.id);
    });
  }

  loadInvestmentsForStartup(startupId: number): void {
    if (this.investmentsLoading[startupId]) {
      return;
    }
    this.investmentsLoading[startupId] = true;
    this.api.getInvestmentsByStartup(startupId).subscribe({
      next: result => {
        console.log(`GET /investments/startup/${startupId} response:`, result);
        this.investmentsLoading[startupId] = false;
        const investments = result?.data ?? result ?? [];
        this.investmentsByStartup[startupId] = investments;
        this.loadInvestorNames(investments);
      },
      error: err => {
        console.error(`GET /investments/startup/${startupId} error:`, err);
        this.investmentsLoading[startupId] = false;
      }
    });
  }

  private loadInvestorNames(investments: Investment[]): void {
    const investorIds = Array.from(new Set(investments.map(item => item.investorId).filter(Boolean)));
    investorIds.forEach(investorId => {
      if (this.investorNameMap[investorId]) {
        return;
      }
      this.api.getUserById(investorId).subscribe({
        next: result => {
          console.log(`GET /users/${investorId} response:`, result);
          const payload = result?.data ?? result ?? {};
          const name = payload.name ?? payload.fullName ?? payload.username ?? payload.email ?? `Investor #${investorId}`;
          this.investorNameMap[investorId] = name;
        },
        error: err => {
          console.error(`GET /users/${investorId} error:`, err);
          this.investorNameMap[investorId] = `Investor #${investorId}`;
        }
      });
    });
  }

  getInvestorName(investorId: number): string {
    return this.investorNameMap[investorId] || `Investor #${investorId}`;
  }

  getUserName(userId: number): string {
    if (this.userNameMap[userId]) {
      return this.userNameMap[userId];
    }
    this.loadUserName(userId);
    return `User #${userId}`;
  }

  private loadUserName(userId: number): void {
    if (!userId || this.userNameMap[userId]) {
      return;
    }
    this.api.getUserById(userId).subscribe({
      next: result => {
        console.log(`GET /users/${userId} response:`, result);
        const payload = result?.data ?? result ?? {};
        const name = payload.name ?? payload.fullName ?? payload.username ?? payload.email ?? `User #${userId}`;
        this.userNameMap[userId] = name;
        this.userProfileMap[userId] = {
          id: payload.id ?? userId,
          name,
          email: payload.email ?? '',
          role: payload.role ?? 'COFOUNDER',
          skills: payload.skills ?? '',
          experience: payload.experience ?? '',
          bio: payload.bio ?? '',
          portfolioLinks: payload.portfolioLinks ?? ''
        };
      },
      error: err => {
        console.error(`GET /users/${userId} error:`, err);
        this.userNameMap[userId] = `User #${userId}`;
      }
    });
  }

  refreshStartupsWithRetry(retries = 2, delayMs = 1000): void {
    this.loadStartups();
    if (retries <= 0) {
      return;
    }
    setTimeout(() => {
      if (!this.startups?.length) {
        this.refreshStartupsWithRetry(retries - 1, delayMs);
      }
    }, delayMs);
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.createFormError = '';
    this.createFormSuccess = '';
  }

  handleInvestorDiscover(): void {
    this.loadStartups();
  }

  handleCofounderBrowse(): void {
    this.loadCofounderInvitations();
    this.loadCofounderActiveTeams();
    this.loadCofounderOpportunities();
    this.loadCofounderMyInterests();
  }

  resetCreateForm(): void {
    this.startupModel = {
      name: '',
      description: '',
      industry: '',
      problemStatement: '',
      solution: '',
      fundingGoal: 0,
      stage: 'IDEA'
    };
  }

  createStartup(): void {
    this.createFormError = '';
    this.createFormSuccess = '';
    if (!this.startupModel.name || !this.startupModel.description || !this.startupModel.industry) {
      this.createFormError = 'Please fill in name, description, and industry.';
      return;
    }
    if (!this.startupModel.problemStatement || !this.startupModel.solution) {
      this.createFormError = 'Please provide a problem statement and solution.';
      return;
    }
    if (!this.startupModel.stage) {
      this.createFormError = 'Please select a startup stage.';
      return;
    }

    this.createLoading = true;
    this.api.createStartup({
      name: this.startupModel.name,
      description: this.startupModel.description,
      industry: this.startupModel.industry,
      problemStatement: this.startupModel.problemStatement,
      solution: this.startupModel.solution,
      fundingGoal: Number(this.startupModel.fundingGoal) || 0,
      stage: this.startupModel.stage
    }).subscribe({
      next: response => {
        console.log('POST /startup response:', response);
        this.createLoading = false;
        if (response?.status !== 201 && response?.status !== 200) {
          this.createFormError = 'Unexpected response from server. Please try again.';
          return;
        }
        this.createFormSuccess = 'Startup created successfully.';
        this.message = 'Startup created successfully.';
        this.showCreateForm = false;
        this.resetCreateForm();
        this.refreshStartupsWithRetry(3, 1000);
      },
      error: err => {
        console.error('POST /startup error:', err);
        this.createLoading = false;
        this.createFormError = err?.error?.message || 'Unable to create startup.';
      }
    });
  }

  openInvestModal(startup: Startup): void {
    this.selectedStartup = startup;
    this.investError = '';
    this.investSuccess = '';
    this.investAmount = 1000;
    this.showInvestModal = true;
  }

  closeInvestModal(): void {
    this.showInvestModal = false;
    this.investError = '';
    this.investSuccess = '';
    this.selectedStartup = null;
  }

  confirmInvest(): void {
    if (!this.selectedStartup) {
      return;
    }
    const amount = Number(this.investAmount);
    if (!Number.isFinite(amount) || amount < 1000) {
      this.investError = 'Minimum investment amount is 1000.';
      return;
    }

    this.investLoading = true;
    this.investError = '';
    this.investSuccess = '';
    this.api.createInvestment({
      startupId: this.selectedStartup.id,
      amount
    }).subscribe({
      next: result => {
        console.log('POST /investments response:', result);
        this.investLoading = false;
        this.investSuccess = 'Investment created. Awaiting founder approval before payment.';
        this.message = 'Investment created. Awaiting founder approval.';
        this.closeInvestModal();
        this.loadInvestorInvestments();
      },
      error: err => {
        console.error('POST /investments error:', err);
        this.investLoading = false;
        this.investError = err?.error?.message || 'Unable to submit investment.';
      }
    });
  }

  onInvestAmountChange(value: any): void {
    const parsed = Number(value);
    this.investAmount = Number.isFinite(parsed) ? parsed : 0;
  }

  confirmInvestFromInput(value: any): void {
    const parsed = Number(value);
    this.investAmount = Number.isFinite(parsed) ? parsed : 0;
    this.confirmInvest();
  }

  approveInvestment(investment: Investment): void {
    this.api.updateInvestmentStatus(investment.id, 'APPROVED').subscribe({
      next: result => {
        console.log(`PUT /investments/${investment.id}/status response:`, result);
        this.loadInvestmentsForStartup(investment.startupId);
      },
      error: err => {
        console.error(`PUT /investments/${investment.id}/status error:`, err);
      }
    });
  }

  rejectInvestment(investment: Investment): void {
    this.api.updateInvestmentStatus(investment.id, 'REJECTED').subscribe({
      next: result => {
        console.log(`PUT /investments/${investment.id}/status response:`, result);
        this.loadInvestmentsForStartup(investment.startupId);
      },
      error: err => {
        console.error(`PUT /investments/${investment.id}/status error:`, err);
      }
    });
  }

  requestPaymentOrder(investment: Investment): void {
    this.paymentLoading = true;
    this.paymentError = '';
    this.paymentSuccess = '';
    this.api.createPaymentOrder(investment.id).subscribe({
      next: result => {
        console.log('POST /payments/create-order response:', result);
        this.paymentLoading = false;
        const payload = result?.data ?? result ?? {};
        this.openRazorpayCheckout({
          orderId: payload.orderId,
          amount: payload.amount,
          currency: payload.currency ?? 'INR',
          investmentId: payload.investmentId ?? investment.id
        });
      },
      error: err => {
        console.error('POST /payments/create-order error:', err);
        this.paymentLoading = false;
        this.paymentError = err?.error?.message || 'Unable to create payment order.';
        this.pushToast('error', this.paymentError);
      }
    });
  }

  private openRazorpayCheckout(order: { orderId: string; amount: number; currency: string; investmentId: number; }): void {
    this.loadRazorpayScript().then(() => {
      if (!order.orderId) {
        this.paymentError = 'Payment order is missing the Razorpay order id.';
        return;
      }

      const options = {
        key: this.razorpayKeyId,
        currency: order.currency,
        name: 'FounderLink',
        description: `Investment #${order.investmentId}`,
        order_id: order.orderId,
        handler: (response: any) => {
          this.paymentLoading = true;
          this.api.confirmPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          }).subscribe({
            next: result => {
              console.log('POST /payments/confirm response:', result);
              this.paymentLoading = false;
              this.paymentSuccess = 'Payment confirmed successfully.';
              this.message = 'Payment confirmed successfully.';
              this.loadInvestorInvestments();
              this.pushToast('success', 'Payment confirmed successfully.');
            },
            error: err => {
              console.error('POST /payments/confirm error:', err);
              this.paymentLoading = false;
              this.paymentError = err?.error?.message || 'Unable to confirm payment.';
              this.pushToast('error', this.paymentError);
            }
          });
        },
        modal: {
          ondismiss: () => {
            this.paymentError = 'Payment was cancelled.';
            this.pushToast('info', this.paymentError);
          }
        }
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    }).catch(() => {
      this.paymentError = 'Unable to load Razorpay checkout. Please try again.';
      this.pushToast('error', this.paymentError);
    });
  }

  private loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) {
        resolve();
        return;
      }
      const scriptId = 'razorpay-checkout-js';
      if (document.getElementById(scriptId)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  }

  openTeamMembers(startupId: number): void {
    this.selectedTeamStartupId = startupId;
    this.showTeamModal = true;
    this.loadTeamMembers(startupId);
  }

  closeTeamMembers(): void {
    this.showTeamModal = false;
    this.selectedTeamStartupId = null;
  }

  getTeamMembers(startupId: number): TeamMember[] {
    return this.teamMembersByStartup[startupId] ?? [];
  }

  loadTeamMembers(startupId: number): void {
    if (!startupId || this.teamMembersLoading[startupId]) {
      return;
    }
    this.teamMembersLoading[startupId] = true;
    this.teamService.getTeamMembers(startupId).subscribe({
      next: result => {
        console.log(`GET /teams/startup/${startupId} response:`, result);
        this.teamMembersLoading[startupId] = false;
        const members = result?.data ?? result ?? [];
        this.teamMembersByStartup[startupId] = members;
        members.forEach((member: TeamMember) => this.loadUserName(member.userId));
      },
      error: err => {
        console.error(`GET /teams/startup/${startupId} error:`, err);
        this.teamMembersLoading[startupId] = false;
        this.pushToast('error', err?.error?.message || 'Unable to load team members.');
      }
    });
  }

  openMessageModal(startupId: number, partnerId: number): void {
    if (!partnerId || !this.userId || partnerId === this.userId) {
      return;
    }
    this.messagePartnerId = partnerId;
    this.messageStartupId = startupId ?? this.getDefaultMessageStartupId() ?? 0;
    this.showMessageModal = false;
    this.messageError = '';
    this.messageText = '';
    this.loadConversation();
  }

  openProfile(): void {
    this.showProfileModal = true;
    this.profileError = '';
    this.profileSuccess = '';
    this.profileEditMode = false;
    this.loadProfileDetails();
    if (this.isFounder) {
      this.myStartups.forEach(startup => this.loadTeamMembers(startup.id));
    }
  }

  closeProfile(): void {
    this.showProfileModal = false;
  }

  loadProfileDetails(): void {
    if (!this.userId) {
      return;
    }
    this.profileLoading = true;
    this.api.getUserById(this.userId).subscribe({
      next: result => {
        this.profileLoading = false;
        const payload = result?.data ?? result ?? {};
        this.profileSkills = String(payload.skills ?? '').trim();
        this.profileExperience = String(payload.experience ?? '').trim();
        const structuredExperience = this.parseExperience(this.profileExperience);
        this.profileExperienceDomain = structuredExperience.domain;
        this.profileExperienceYears = structuredExperience.years;
        this.profileEditMode = !this.hasCofounderProfile;
      },
      error: err => {
        this.profileLoading = false;
        this.profileError = err?.error?.message || 'Unable to load profile details.';
      }
    });
  }

  saveCofounderProfile(): void {
    if (!this.userId || !this.isCofounder) {
      return;
    }
    this.profileSaving = true;
    this.profileError = '';
    this.profileSuccess = '';
    const domain = this.profileExperienceDomain.trim();
    const yearsRaw = Number(this.profileExperienceYears);
    const years = Number.isFinite(yearsRaw) && yearsRaw >= 0 ? Math.floor(yearsRaw) : null;
    if (!domain) {
      this.profileSaving = false;
      this.profileError = 'Please enter expertise domain.';
      return;
    }
    if (years === null) {
      this.profileSaving = false;
      this.profileError = 'Please enter valid years of experience.';
      return;
    }
    this.profileExperience = JSON.stringify({
      domain,
      years
    });
    this.api.updateUser(this.userId, {
      skills: this.profileSkills.trim(),
      experience: this.profileExperience
    }).subscribe({
      next: () => {
        this.profileSaving = false;
        this.profileSuccess = 'Profile updated successfully.';
        this.profileEditMode = false;
      },
      error: err => {
        this.profileSaving = false;
        this.profileError = err?.error?.message || 'Unable to update profile.';
      }
    });
  }

  get hasCofounderProfile(): boolean {
    return !!(this.profileSkills.trim() || this.profileExperienceDomain.trim() || this.profileExperienceYears !== null);
  }

  get profileSkillChips(): string[] {
    return this.profileSkills
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  enableProfileEdit(): void {
    this.profileEditMode = true;
    this.profileError = '';
    this.profileSuccess = '';
  }

  cancelProfileEdit(): void {
    this.profileError = '';
    this.profileSuccess = '';
    this.loadProfileDetails();
  }

  get profileExperienceSummary(): string {
    const domain = this.profileExperienceDomain.trim();
    const years = this.profileExperienceYears;
    if (!domain && years === null) {
      return '';
    }
    if (!domain) {
      return `${years} years`;
    }
    if (years === null) {
      return domain;
    }
    return `${domain} • ${years} years`;
  }

  getCofounderExpertise(cofounder: any): string {
    const parsed = this.parseExperience(cofounder?.experience);
    if (!parsed.domain && parsed.years === null) {
      return '';
    }
    if (!parsed.domain) {
      return `${parsed.years} years`;
    }
    if (parsed.years === null) {
      return parsed.domain;
    }
    return `${parsed.domain} • ${parsed.years} years`;
  }

  private parseExperience(rawValue: any): { domain: string; years: number | null } {
    const raw = String(rawValue ?? '').trim();
    if (!raw) {
      return { domain: '', years: null };
    }

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const domain = String(parsed.domain ?? '').trim();
        const yearsRaw = Number(parsed.years);
        const years = Number.isFinite(yearsRaw) && yearsRaw >= 0 ? Math.floor(yearsRaw) : null;
        if (domain || years !== null) {
          return { domain, years };
        }
      }
    } catch {
      // Keep backward compatibility with older free-text values.
    }

    const commaParts = raw.split(',').map(item => item.trim()).filter(Boolean);
    if (commaParts.length >= 2) {
      const domain = commaParts[0];
      const yearsMatch = commaParts[1].match(/\d+/);
      const years = yearsMatch ? Number(yearsMatch[0]) : null;
      return { domain, years: Number.isFinite(years as number) ? years : null };
    }

    const genericYearsMatch = raw.match(/(\d+)/);
    const years = genericYearsMatch ? Number(genericYearsMatch[1]) : null;
    const domain = raw.replace(/\{.*\}|years?|year|\d+|[:",]/gi, ' ').replace(/\s+/g, ' ').trim();
    if (!domain && years !== null) {
      return { domain: '', years };
    }
    return { domain: domain || raw, years: Number.isFinite(years as number) ? years : null };
  }

  closeMessageModal(): void {
    this.showMessageModal = false;
    this.messagePartnerId = null;
    this.messageStartupId = null;
    this.messageThread = [];
    this.messageText = '';
    this.messageError = '';
  }

  loadConversation(): void {
    if (!this.userId || !this.messagePartnerId) {
      return;
    }
    this.messageLoading = true;
    this.messagingService.getConversation(this.userId, this.messagePartnerId).subscribe({
      next: result => {
        console.log('GET /messages/conversation response:', result);
        this.messageLoading = false;
        this.messageThread = result ?? [];
      },
      error: err => {
        console.error('GET /messages/conversation error:', err);
        this.messageLoading = false;
        this.messageError = err?.error?.message || 'Unable to load conversation.';
      }
    });
  }

  sendMessage(): void {
    if (!this.userId || !this.messagePartnerId) {
      return;
    }
    if (!this.messageText.trim()) {
      this.messageError = 'Message cannot be empty.';
      return;
    }
    const startupId = this.messageStartupId ?? this.getDefaultMessageStartupId() ?? 0;
    this.messageSending = true;
    this.messageError = '';
    this.messagingService.sendMessage({
      senderId: this.userId,
      receiverId: this.messagePartnerId,
      startupId,
      content: this.messageText.trim()
    }).subscribe({
      next: result => {
        console.log('POST /messages response:', result);
        this.messageSending = false;
        this.messageText = '';
        this.loadConversation();
        this.pushToast('success', 'Message sent.');
      },
      error: err => {
        console.error('POST /messages error:', err);
        this.messageSending = false;
        this.messageError = err?.error?.message || 'Unable to send message.';
        this.pushToast('error', this.messageError);
      }
    });
  }

  loadMessagePartners(): void {
    if (!this.userId) {
      return;
    }
    this.messagePartnersLoading = true;
    this.messagingService.getConversationPartners(this.userId).subscribe({
      next: result => {
        console.log('GET /messages/partners response:', result);
        this.messagePartnersLoading = false;
        this.messagePartners = result ?? [];
      },
      error: err => {
        console.error('GET /messages/partners error:', err);
        this.messagePartnersLoading = false;
      }
    });
  }

  setActiveConversation(partnerId: number): void {
    if (!partnerId) {
      return;
    }
    this.messagePartnerId = partnerId;
    this.messageStartupId = this.messageStartupId ?? this.getDefaultMessageStartupId() ?? 0;
    this.loadConversation();
  }

  getMessageStartupOptions(): { id: number; name: string }[] {
    if (this.isFounder) {
      return this.myStartups.map(startup => ({ id: startup.id, name: startup.name }));
    }
    if (this.isCofounder) {
      return this.cofounderActiveTeams.map(team => ({
        id: team.startupId,
        name: this.getStartupNameById(team.startupId)
      }));
    }
    return [];
  }

  private getDefaultMessageStartupId(): number | null {
    const options = this.getMessageStartupOptions();
    return options.length ? options[0].id : null;
  }

  getFilteredMessagePartners(): number[] {
    if (!this.messageSearch.trim()) {
      return this.getRoleScopedPartners(this.messagePartners);
    }
    const query = this.messageSearch.trim().toLowerCase();
    const scoped = this.getRoleScopedPartners(this.messagePartners);
    return scoped.filter(partnerId =>
      this.getUserName(partnerId).toLowerCase().includes(query)
    );
  }

  private getRoleScopedPartners(partners: number[]): number[] {
    return partners;
  }

  onMessageStartupChange(): void {
    if (this.messagePartnerId) {
      this.loadConversation();
    }
  }

  pushToast(type: ToastMessage['type'], message: string): void {
    const toast: ToastMessage = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type,
      message
    };
    this.toasts = [toast, ...this.toasts].slice(0, 4);
    setTimeout(() => {
      this.toasts = this.toasts.filter(item => item.id !== toast.id);
    }, 3500);
  }

  logout(): void {
    this.api.logout().subscribe({
      next: () => {
        this.cleanupSession();
        this.message = 'Logged out successfully.';
      },
      error: () => {
        this.cleanupSession();
        this.message = 'Logged out locally.';
      }
    });
  }

  private cleanupSession(): void {
    this.token = '';
    this.isAuthenticated = false;
    this.authEmail = '';
    this.userId = null;
    this.role = '';
    this.startups = [];
    this.cofounderOpportunities = [];
    this.cofounderMyInterests = [];
    this.founderInterestRequests = [];
    this.founderInterestRoleById = {};
    this.notifications = [];
    this.notificationReadAtMap = {};
    this.showNotificationsPanel = false;
    this.api.setAuthToken('');
    this.api.clearAuthContext();
    localStorage.removeItem('authToken');
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authUserName');
    localStorage.removeItem('authRole');
    localStorage.removeItem('authUserId');
    this.loadPublicData();
  }

  private clearStatus(): void {
    this.message = '';
    this.error = '';
  }

  private startNotificationCleanupTimer(): void {
    if (this.notificationCleanupTimer) {
      return;
    }
    this.notificationCleanupTimer = setInterval(() => {
      this.purgeExpiredReadNotifications();
    }, 15000);
  }

  private purgeExpiredReadNotifications(): void {
    const cutoff = Date.now() - 2 * 60 * 1000;
    const expiredIds = Object.entries(this.notificationReadAtMap)
      .filter(([, readAt]) => Number(readAt) <= cutoff)
      .map(([id]) => Number(id));

    if (!expiredIds.length) {
      return;
    }

    const expiredSet = new Set(expiredIds);
    this.notifications = this.notifications.filter(item => !expiredSet.has(item.id));
    expiredIds.forEach(id => {
      delete this.notificationReadAtMap[id];
    });
  }
}
