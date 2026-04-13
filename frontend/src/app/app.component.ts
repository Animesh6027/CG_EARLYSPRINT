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
  adminLoginMode = false;

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
  messageUnreadCountByPartner: Record<number, number> = {};
  private messageLastSeenAtByPartner: Record<number, number> = {};
  private messagePollingTimer: any = null;
  private readonly messageSeenStorageKey = 'founderlink.messageLastSeenAtByPartner';
  notifications: NotificationItem[] = [];
  notificationsLoading = false;
  notificationsError = '';
  showNotificationsPanel = false;
  notificationMarkingId: number | null = null;
  notificationsMarkAllLoading = false;
  private notificationReadAtMap: Record<number, number> = {};
  private notificationCleanupTimer: any = null;
  showProfileMenu = false;
  showProfileModal = false;
  profileSkills = '';
  profileExperience = '';
  profileBio = '';
  profilePortfolioLinks = '';
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

  adminSections = ['dashboard', 'founders', 'cofounders', 'investors', 'startups', 'investments', 'reports', 'settings'];
  adminActiveSection = 'dashboard';
  adminFounderSearch = '';
  adminFounderFilter = 'ALL';
  adminFounderSort = 'NAME_ASC';
  adminFounderPage = 1;
  adminFounderPageSize = 8;
  adminCofounderSearch = '';
  adminCofounderAvailabilityFilter = 'ALL';
  adminCofounderSort = 'NAME_ASC';
  adminCofounderPage = 1;
  adminCofounderPageSize = 8;
  adminInvestorSearch = '';
  adminInvestorFilter = 'ALL';
  adminInvestorSort = 'INVESTED_DESC';
  adminInvestorPage = 1;
  adminInvestorPageSize = 8;
  adminStartupSearch = '';
  adminStartupFilter = 'ALL';
  adminStartupSort = 'NEWEST';
  adminStartupPage = 1;
  adminStartupPageSize = 8;
  adminInvestmentSearch = '';
  adminInvestmentFilter = 'ALL';
  adminInvestmentSort = 'NEWEST';
  adminInvestmentPage = 1;
  adminInvestmentPageSize = 8;
  adminReportSearch = '';
  adminReportFilter = 'ALL';
  adminReportSort = 'TYPE_ASC';
  adminReportPage = 1;
  adminReportPageSize = 8;
  adminRoleLoading = {
    founders: false,
    cofounders: false,
    investors: false,
    startups: false,
    investments: false,
    reports: false
  };
  adminCofounderStartupFilter = 'ALL';
  adminCofounderStatusFilter = 'ALL';
  adminCofounderLinksByUserId: Record<number, { startupName: string; contribution: string; status: string; joinedAt?: string }> = {};
  adminSettingsName = '';
  adminSettingsEmail = '';
  adminFounderBlockedById: Record<number, boolean> = {};
  adminInvestorBlockedById: Record<number, boolean> = {};
  adminStartupStatusById: Record<number, 'PENDING' | 'APPROVED' | 'REJECTED'> = {};
  adminCofounderApprovalById: Record<number, 'PENDING' | 'APPROVED' | 'REJECTED'> = {};
  adminAllInvestments: Investment[] = [];
  adminInvestmentsLoading = false;
  showAdminDetailsModal = false;
  adminDetailsTitle = '';
  adminDetailsPayload: any = null;
  adminDetailsSaving = false;
  adminDetailsLoading = false;
  adminDetailsError = '';
  adminDetailsSuccess = '';
  adminDetailsDraft = {
    skills: '',
    experience: '',
    bio: '',
    portfolioLinks: ''
  };

  // Temporary local admin credentials for frontend development.
  // Replace/remove once backend admin auth is finalized.
  private readonly tempAdminEmail = 'temp.admin@founderlink.local';
  private readonly tempAdminPassword = 'TempAdmin@123';
  private readonly tempAdminSessionToken = 'temp-admin-session';

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
    this.loadMessageSeenState();
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
      if (this.userId) {
        this.api.getUserById(this.userId).subscribe({
          next: result => {
            const payload = result?.data ?? result ?? {};
            const name = payload.name ?? payload.fullName ?? payload.username ?? '';
            if (name) {
              this.userName = name;
              localStorage.setItem('authUserName', name);
            }
          },
          error: err => {
            if (this.handleUnauthorized(err)) {
              this.message = 'Your session expired. Please login again.';
            }
          }
        });
      }
    }

    this.loadPublicData();
    if (this.isAuthenticated) {
      if (this.isTempAdminSession) {
        this.message = 'Logged in using temporary admin credentials (local mode).';
        // Load admin data using public endpoints via fallback chain.
        this.loadAdminData();
      } else {
        this.loadRoleData();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.notificationCleanupTimer) {
      clearInterval(this.notificationCleanupTimer);
      this.notificationCleanupTimer = null;
    }
    if (this.messagePollingTimer) {
      clearInterval(this.messagePollingTimer);
      this.messagePollingTimer = null;
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

  get isAdmin(): boolean {
    return this.normalizedRole === 'ADMIN';
  }

  get isTempAdminSession(): boolean {
    return this.token === this.tempAdminSessionToken;
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
    this.adminLoginMode = false;
    this.clearStatus();
  }

  showAdminLogin(): void {
    this.showRegister = false;
    this.showForgot = false;
    this.forgotPinSent = false;
    this.adminLoginMode = true;
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

    if (this.adminLoginMode
      && this.loginEmail.trim().toLowerCase() === this.tempAdminEmail
      && this.loginPassword === this.tempAdminPassword) {
      this.loginWithTempAdmin();
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

        if (this.adminLoginMode && this.role !== 'ADMIN') {
          this.loading = false;
          this.isAuthenticated = false;
          this.error = 'This login is reserved for admin accounts.';
          return;
        }

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
        this.message = this.isAdmin
          ? (this.userName ? `Welcome back, Admin ${this.userName}` : 'Welcome back, Admin')
          : (this.userName ? `Welcome back, ${this.userName}` : (this.authEmail ? `Welcome back, ${this.authEmail}` : 'Welcome back!'));
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

  private loginWithTempAdmin(): void {
    this.loading = false;
    this.token = this.tempAdminSessionToken;
    this.userId = -1;
    this.role = 'ADMIN';
    this.authEmail = this.tempAdminEmail;
    this.userName = 'Temp Admin';
    this.isAuthenticated = true;

    localStorage.setItem('authToken', this.token);
    localStorage.setItem('authEmail', this.authEmail);
    localStorage.setItem('authUserName', this.userName);
    localStorage.setItem('authRole', this.role);
    localStorage.setItem('authUserId', String(this.userId));

    this.api.setAuthToken(this.token);
    this.api.setAuthContext(this.userId, this.role);
    this.message = 'Logged in using temporary admin credentials (local mode).';

    // Load admin data using public endpoints via fallback chain.
    this.loadPublicData();
    this.loadAdminData();
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
    this.publicInvestors = [];
    this.publicFounders = [];
    this.publicStartups = [];

    this.api.getPublicStartups().subscribe({
      next: result => {
        this.publicStartups = this.normalizePublicStartups(this.extractCollection(result));
        localStorage.setItem('publicStartupsCount', String(this.publicStartups.length));
      },
      error: err => {
        if (err?.status !== 401 && err?.status !== 403) {
          console.error('Unable to load startups:', err);
        }
      }
    });

    this.api.getPublicUsersByRole('INVESTOR').subscribe({
      next: result => {
        this.publicInvestors = this.normalizePublicUsers(this.extractCollection(result));
        localStorage.setItem('publicInvestorsCount', String(this.publicInvestors.length));
      },
      error: err => {
        if (err?.status !== 401 && err?.status !== 403) {
          console.error('Unable to load investors:', err);
        }
      }
    });

    this.api.getPublicUsersByRole('FOUNDER').subscribe({
      next: result => {
        this.publicFounders = this.normalizePublicUsers(this.extractCollection(result));
        localStorage.setItem('publicFoundersCount', String(this.publicFounders.length));
      },
      error: err => {
        if (err?.status !== 401 && err?.status !== 403) {
          console.error('Unable to load founders:', err);
        }
      }
    });
  }

  private normalizePublicUsers(list: any[]): User[] {
    if (!Array.isArray(list)) {
      return [];
    }
    return list
      .map((item: any) => ({
        id: Number(item?.id ?? item?.userId ?? 0),
        name: String(item?.name ?? item?.fullName ?? item?.username ?? '').trim(),
        email: String(item?.email ?? '').trim(),
        role: String(item?.role ?? '').trim(),
        skills: String(item?.skills ?? '').trim(),
        experience: String(item?.experience ?? '').trim(),
        bio: String(item?.bio ?? '').trim(),
        portfolioLinks: String(item?.portfolioLinks ?? '').trim()
      }))
      .filter(item => Number.isFinite(item.id) && item.id > 0);
  }

  private normalizePublicStartups(list: any[]): Startup[] {
    if (!Array.isArray(list)) {
      return [];
    }
    return list
      .map((item: any) => ({
        id: Number(item?.id ?? 0),
        name: String(item?.name ?? '').trim(),
        description: String(item?.description ?? '').trim(),
        industry: String(item?.industry ?? '').trim(),
        problemStatement: String(item?.problemStatement ?? item?.problem_statement ?? '').trim(),
        solution: String(item?.solution ?? '').trim(),
        fundingGoal: Number(item?.fundingGoal ?? item?.funding_goal ?? 0),
        stage: String(item?.stage ?? '').trim(),
        founderId: Number(item?.founderId ?? item?.founder_id ?? 0),
        founderName: String(item?.founderName ?? item?.founder_name ?? '').trim(),
        tags: Array.isArray(item?.tags) ? item.tags : [],
        createdAt: item?.createdAt ?? item?.created_at ?? item?.createdOn ?? ''
      }))
      .filter(item => Number.isFinite(item.id) && item.id > 0);
  }

  private extractCollection(result: any): any[] {
    const raw =
      result?.data?.data ??
      result?.data?.content ??
      result?.data ??
      result?.content ??
      result ??
      [];
    return Array.isArray(raw) ? raw : [];
  }

  private mergeUsersById(...lists: User[][]): User[] {
    const byId = new Map<number, User>();
    lists.forEach(list => {
      (list || []).forEach(user => {
        const id = Number(user?.id);
        if (!Number.isFinite(id) || id <= 0) {
          return;
        }
        const existing = byId.get(id);
        if (!existing) {
          byId.set(id, {
            id,
            name: String(user?.name ?? '').trim(),
            email: String(user?.email ?? '').trim(),
            role: String(user?.role ?? '').trim(),
            skills: String(user?.skills ?? '').trim(),
            experience: String(user?.experience ?? '').trim(),
            bio: String(user?.bio ?? '').trim(),
            portfolioLinks: String(user?.portfolioLinks ?? '').trim()
          });
          return;
        }
        byId.set(id, {
          ...existing,
          name: existing.name || String(user?.name ?? '').trim(),
          email: existing.email || String(user?.email ?? '').trim(),
          role: existing.role || String(user?.role ?? '').trim(),
          skills: existing.skills || String(user?.skills ?? '').trim(),
          experience: existing.experience || String(user?.experience ?? '').trim(),
          bio: existing.bio || String(user?.bio ?? '').trim(),
          portfolioLinks: existing.portfolioLinks || String(user?.portfolioLinks ?? '').trim()
        });
      });
    });
    return Array.from(byId.values());
  }

  private get foundersFromStartups(): User[] {
    const byFounderId = new Map<number, User>();
    (this.startups || []).forEach(startup => {
      const founderId = Number(startup?.founderId);
      if (!Number.isFinite(founderId) || founderId <= 0) {
        return;
      }
      const knownName = this.resolveFounderDisplayName(founderId, startup);
      if (!byFounderId.has(founderId)) {
        byFounderId.set(founderId, {
          id: founderId,
          name: knownName,
          email: '',
          role: 'FOUNDER',
          skills: '',
          experience: '',
          bio: '',
          portfolioLinks: ''
        });
      }
    });
    return Array.from(byFounderId.values());
  }

  private resolveFounderDisplayName(founderId: number, startup?: Startup): string {
    const fromStartup = String(startup?.founderName ?? '').trim();
    if (fromStartup) {
      return fromStartup;
    }

    const fromFounders = this.founders.find(item => Number(item.id) === founderId);
    if (fromFounders?.name?.trim()) {
      return fromFounders.name.trim();
    }

    const fromPublicFounders = this.publicFounders.find(item => Number(item.id) === founderId);
    if (fromPublicFounders?.name?.trim()) {
      return fromPublicFounders.name.trim();
    }

    const fromMap = String(this.founderNameMap[founderId] ?? '').trim();
    if (fromMap) {
      return fromMap;
    }

    return `Founder #${founderId}`;
  }

  get adminSkeletonRows(): number[] {
    return [1, 2, 3, 4, 5];
  }

  adminDisplayValue(value: any, fallback = 'Not Available'): string {
    if (value === null || value === undefined) {
      return fallback;
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? String(value) : fallback;
    }
    const text = String(value).trim();
    return text ? text : fallback;
  }

  getInitials(name: string): string {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return 'NA';
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  loadStartups(): void {
    this.clearStatus();
    if (this.isCofounder) {
      this.startupsLoading = false;
      return;
    }
    if (this.isAdmin) {
      this.adminRoleLoading.startups = true;
    }
    this.startupsLoading = true;
    this.api.getAllStartups().subscribe({
      next: result => {
        console.log('GET /startup response:', result);
        this.startupsLoading = false;
        if (this.isAdmin) {
          this.adminRoleLoading.startups = false;
        }
        this.startups = result?.data ?? result ?? [];
        this.loadFounderNames(this.startups);
        if (this.isFounder) {
          this.loadInvestmentsForMyStartups();
        }
        if (this.isInvestor) {
          this.loadInvestorInvestments();
        }
        if (this.isAdmin) {
          this.loadAdminInvestmentsFromStartups();
          this.loadAdminTeamMappings();
        }
      },
      error: err => {
        if (this.handleUnauthorized(err)) {
          this.startupsLoading = false;
          if (this.isAdmin) {
            this.adminRoleLoading.startups = false;
          }
          return;
        }
        console.error('GET /startup error:', err);
        this.startupsLoading = false;
        if (this.isAdmin) {
          this.adminRoleLoading.startups = false;
        }
        this.error = err?.error?.message || 'Unable to load startups.';
      }
    });
  }

  loadRoleData(): void {
    if (this.isAdmin) {
      this.loadAdminData();
    }
    if (this.isFounder) {
      this.loadCofounders();
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
    }
    if (this.isAuthenticated) {
      this.loadMessagePartners();
      this.startMessagePollingTimer();
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

  toggleProfileMenu(event?: MouseEvent): void {
    event?.stopPropagation();
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu(): void {
    this.showProfileMenu = false;
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
        if (this.handleUnauthorized(err)) {
          return;
        }
        this.notificationsError = err?.error?.message || 'Unable to load notifications.';
      }
    });
  }

  formatNotificationMessage(message: string): string {
    let formatted = String(message || '').trim();
    if (!formatted) {
      return '';
    }

    formatted = formatted.replace(/investment\s+#(\d+)\s+in\s+startup\s+#(\d+)/gi, (_match, _investmentId, startupId) => {
      const startupName = this.getStartupNameById(Number(startupId));
      return `investment in ${startupName}`;
    });

    formatted = formatted.replace(/startup\s+#(\d+)/gi, (_match, startupId) => {
      return this.getStartupNameById(Number(startupId));
    });

    formatted = formatted.replace(/(founder|investor|cofounder|user)\s+#(\d+)/gi, (_match, role, userId) => {
      const name = this.getUserName(Number(userId));
      const normalizedRole = String(role || '').toLowerCase();
      const roleLabel = normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1);
      return `${roleLabel} ${name}`;
    });

    formatted = formatted.replace(/investment\s+#(\d+)/gi, (_match, investmentId) => {
      const investment = this.findInvestmentById(Number(investmentId));
      if (investment) {
        return `investment in ${this.getStartupNameById(Number(investment.startupId))}`;
      }
      return 'investment';
    });

    return formatted;
  }

  private findInvestmentById(investmentId: number): Investment | null {
    if (!Number.isFinite(investmentId) || investmentId <= 0) {
      return null;
    }

    const direct = (this.investorInvestments || []).find(inv => Number(inv.id) === investmentId);
    if (direct) {
      return direct;
    }

    const all = Object.values(this.investmentsByStartup || {}).flat();
    const nested = all.find(inv => Number(inv?.id) === investmentId);
    return nested || null;
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
    if (!this.isFounder && !this.isAdmin) {
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
        this.loadMessagePartners();
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
        if (this.isAuthenticated) {
          this.loadMessagePartners();
        }
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
        error: () => {
          this.api.getPublicUserById(founderId).subscribe({
            next: publicResult => {
              const payload = publicResult?.data ?? publicResult ?? {};
              const name = payload.name ?? payload.fullName ?? payload.username ?? payload.email ?? `Founder #${founderId}`;
              this.founderNameMap[founderId] = name;
            },
            error: err => {
              console.error(`GET /users/${founderId} error:`, err);
              this.founderNameMap[founderId] = `Founder #${founderId}`;
            }
          });
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
      error: () => {
        this.api.getPublicUserById(userId).subscribe({
          next: publicResult => {
            const payload = publicResult?.data ?? publicResult ?? {};
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
        this.loadMessagePartners();
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

  handleInvestorMessageFounder(event: { startupId: number; founderId: number }): void {
    if (!event?.startupId || !event?.founderId) {
      return;
    }
    this.openMessageModal(event.startupId, event.founderId);
  }

  openProfile(): void {
    this.showProfileMenu = false;
    this.showProfileModal = true;
    this.profileError = '';
    this.profileSuccess = '';
    this.profileEditMode = false;
    this.loadProfileDetails();
    if (this.isFounder) {
      this.myStartups.forEach(startup => this.loadTeamMembers(startup.id));
    }
  }

  openProfileFromMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    setTimeout(() => this.openProfile(), 0);
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
        this.profileBio = String(payload.bio ?? '').trim();
        this.profilePortfolioLinks = String(payload.portfolioLinks ?? '').trim();
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
    if (!this.userId) {
      return;
    }
    this.profileSaving = true;
    this.profileError = '';
    this.profileSuccess = '';
    const fullPayload = {
      skills: this.profileSkills.trim(),
      experience: this.profileExperience.trim(),
      bio: this.profileBio.trim(),
      portfolioLinks: this.profilePortfolioLinks.trim()
    };

    this.api.updateUser(this.userId, fullPayload).subscribe({
      next: () => {
        this.profileSaving = false;
        this.profileSuccess = 'Profile updated successfully.';
        this.profileEditMode = false;
      },
      error: err => {
        const status = Number(err?.status ?? err?.error?.status ?? 0);
        if (status >= 500) {
          // Backward-compatible fallback for deployments that support only legacy fields.
          this.api.updateUser(this.userId!, {
            skills: fullPayload.skills,
            experience: fullPayload.experience
          }).subscribe({
            next: () => {
              this.profileSaving = false;
              this.profileSuccess = 'Profile updated. Bio and portfolio links are not supported on this server yet.';
              this.profileEditMode = false;
            },
            error: fallbackErr => {
              this.profileSaving = false;
              this.profileError = fallbackErr?.error?.message || 'Unable to update profile.';
            }
          });
          return;
        }

        this.profileSaving = false;
        this.profileError = err?.error?.message || 'Unable to update profile.';
      }
    });
  }

  get hasCofounderProfile(): boolean {
    return !!(
      this.profileSkills.trim()
      || this.profileExperience.trim()
      || this.profileBio.trim()
      || this.profilePortfolioLinks.trim()
    );
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
    return this.profileExperience.trim();
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
    const activePartnerId = this.messagePartnerId;
    this.messageLoading = true;
    this.messagingService.getConversation(this.userId, activePartnerId).subscribe({
      next: result => {
        console.log('GET /messages/conversation response:', result);
        this.messageLoading = false;
        this.messageThread = result ?? [];
        this.markConversationAsSeen(activePartnerId, this.messageThread);
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

  sendMessageOnEnter(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.messageSending || !this.messagePartnerId) {
      return;
    }
    this.sendMessage();
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
        this.refreshUnreadCounts();
      },
      error: err => {
        if (this.handleUnauthorized(err)) {
          this.messagePartnersLoading = false;
          return;
        }
        console.error('GET /messages/partners error:', err);
        this.messagePartnersLoading = false;
      }
    });
  }

  private handleUnauthorized(err: any): boolean {
    const status = Number(err?.status ?? err?.error?.status ?? 0);
    if (status !== 401 && status !== 403) {
      return false;
    }

    if (this.isAuthenticated) {
      this.cleanupSession();
    }
    return true;
  }

  setActiveConversation(partnerId: number): void {
    if (!partnerId) {
      return;
    }
    this.messagePartnerId = partnerId;
    if (this.isInvestor) {
      this.messageStartupId = this.getInvestorStartupIdByFounderId(partnerId) ?? this.messageStartupId ?? this.getDefaultMessageStartupId() ?? 0;
    } else {
      this.messageStartupId = this.messageStartupId ?? this.getDefaultMessageStartupId() ?? 0;
    }
    this.loadConversation();
  }

  getUnreadCount(partnerId: number): number {
    const key = Number(partnerId);
    if (!Number.isFinite(key) || key <= 0) {
      return 0;
    }
    return this.messageUnreadCountByPartner[key] || 0;
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
    const basePartners = Array.from(
      new Set((Array.isArray(partners) ? partners : [])
        .map(item => Number(item))
        .filter(item => Number.isFinite(item) && item > 0))
    );

    if (this.isInvestor) {
      const founderPartners = this.getInvestorFounderPartnerIds();
      return Array.from(new Set([...founderPartners, ...basePartners]))
        .map(item => Number(item))
        .filter(item => Number.isFinite(item) && item > 0);
    }

    if (this.isCofounder) {
      const founderPartners = this.getCofounderFounderPartnerIds();
      return Array.from(new Set([...founderPartners, ...basePartners]))
        .map(item => Number(item))
        .filter(item => Number.isFinite(item) && item > 0);
    }

    if (this.isFounder) {
      const founderPartners = this.getFounderPartnerIds();
      return Array.from(new Set([...founderPartners, ...basePartners]))
        .map(item => Number(item))
        .filter(item => Number.isFinite(item) && item > 0);
    }

    return basePartners;
  }

  private getInvestorFounderPartnerIds(): number[] {
    if (!this.isInvestor || !this.userId) {
      return [];
    }

    const startupIds = Array.from(
      new Set(
        (this.investorInvestments || [])
          .filter(inv => {
            const status = this.upper(String(inv?.status ?? ''));
            return status === 'APPROVED' || status === 'COMPLETED';
          })
          .map(inv => Number(inv?.startupId))
          .filter(id => Number.isFinite(id) && id > 0)
      )
    );

    const founderIds: number[] = [];
    startupIds.forEach(startupId => {
      let founderId = Number(this.startupDetailsMap[startupId]?.founderId);
      if (!Number.isFinite(founderId) || founderId <= 0) {
        const startup =
          this.startups.find(item => Number(item?.id) === startupId) ||
          this.publicStartups.find(item => Number(item?.id) === startupId);
        founderId = Number(startup?.founderId);
      }

      if (Number.isFinite(founderId) && founderId > 0 && founderId !== this.userId) {
        founderIds.push(founderId);
        this.loadUserName(founderId);
      }

      if (!this.startupDetailsMap[startupId]) {
        this.loadStartupName(startupId);
      }
    });

    return Array.from(new Set(founderIds));
  }

  private getCofounderFounderPartnerIds(): number[] {
    if (!this.isCofounder || !this.userId) {
      return [];
    }

    const startupIds = Array.from(
      new Set(
        (this.cofounderActiveTeams || [])
          .map(team => Number(team?.startupId))
          .filter(id => Number.isFinite(id) && id > 0)
      )
    );

    const founderIds: number[] = [];
    startupIds.forEach(startupId => {
      let founderId = Number(this.startupDetailsMap[startupId]?.founderId);
      if (!Number.isFinite(founderId) || founderId <= 0) {
        const startup =
          this.startups.find(item => Number(item?.id) === startupId) ||
          this.publicStartups.find(item => Number(item?.id) === startupId);
        founderId = Number(startup?.founderId);
      }

      if (Number.isFinite(founderId) && founderId > 0 && founderId !== this.userId) {
        founderIds.push(founderId);
        this.loadUserName(founderId);
      }

      if (!this.startupDetailsMap[startupId]) {
        this.loadStartupName(startupId);
      }
    });

    return Array.from(new Set(founderIds));
  }

  private getFounderPartnerIds(): number[] {
    if (!this.isFounder || !this.userId) {
      return [];
    }

    const partnerIds: number[] = [];

    this.myStartups.forEach(startup => {
      const startupId = Number(startup?.id);
      if (!Number.isFinite(startupId) || startupId <= 0) {
        return;
      }

      const investments = this.investmentsByStartup[startupId] || [];
      (investments || []).forEach(inv => {
        const status = this.upper(String(inv?.status ?? ''));
        if (status !== 'APPROVED' && status !== 'COMPLETED') {
          return;
        }
        const investorId = Number(inv?.investorId);
        if (Number.isFinite(investorId) && investorId > 0 && investorId !== this.userId) {
          partnerIds.push(investorId);
          this.loadUserName(investorId);
        }
      });

      const members = this.teamMembersByStartup[startupId] || [];
      (members || []).forEach(member => {
        const isActive = Boolean(member?.isActive);
        const memberId = Number(member?.userId);
        if (!isActive || !Number.isFinite(memberId) || memberId <= 0 || memberId === this.userId) {
          return;
        }
        partnerIds.push(memberId);
        this.loadUserName(memberId);
      });
    });

    return Array.from(new Set(partnerIds));
  }

  private refreshFounderPartnerSources(): void {
    if (!this.isFounder || !this.userId) {
      return;
    }
    this.loadInvestmentsForMyStartups();
    this.myStartups.forEach(startup => {
      const startupId = Number(startup?.id);
      if (Number.isFinite(startupId) && startupId > 0) {
        this.loadTeamMembers(startupId);
      }
    });
  }

  private getInvestorStartupIdByFounderId(founderId: number): number | null {
    const normalizedFounderId = Number(founderId);
    if (!this.isInvestor || !Number.isFinite(normalizedFounderId) || normalizedFounderId <= 0) {
      return null;
    }

    const investments = [...(this.investorInvestments || [])].sort((a, b) => this.getInvestmentTime(b) - this.getInvestmentTime(a));
    for (const inv of investments) {
      const startupId = Number(inv?.startupId);
      if (!Number.isFinite(startupId) || startupId <= 0) {
        continue;
      }

      const knownFounderId = Number(this.startupDetailsMap[startupId]?.founderId);
      if (Number.isFinite(knownFounderId) && knownFounderId === normalizedFounderId) {
        return startupId;
      }

      const startup =
        this.startups.find(item => Number(item?.id) === startupId) ||
        this.publicStartups.find(item => Number(item?.id) === startupId);
      const fallbackFounderId = Number(startup?.founderId);
      if (Number.isFinite(fallbackFounderId) && fallbackFounderId === normalizedFounderId) {
        return startupId;
      }
    }

    return null;
  }

  private loadAdminData(): void {
    this.adminSettingsName = this.userDisplayName;
    this.adminSettingsEmail = this.authEmail;
    this.adminRoleLoading.reports = true;
    this.loadPublicData();
    this.loadAdminRoleUsers();
    if (!this.startups.length) {
      this.loadStartups();
    } else {
      this.loadAdminInvestmentsFromStartups();
      this.loadAdminTeamMappings();
    }
    this.syncAdminPages();
  }

  private loadAdminRoleUsers(): void {
    this.adminRoleLoading.founders = true;
    this.adminRoleLoading.investors = true;
    this.adminRoleLoading.cofounders = true;
    this.loadAdminUsersByRole('FOUNDER', users => {
      this.founders = users;
      this.adminRoleLoading.founders = false;
      this.onAdminFounderFiltersChanged();
      this.adminRoleLoading.reports = false;
    });
    this.loadAdminUsersByRole('INVESTOR', users => {
      this.investors = users;
      this.adminRoleLoading.investors = false;
      this.onAdminInvestorFiltersChanged();
      this.adminRoleLoading.reports = false;
    });
    this.loadAdminUsersByRole('COFOUNDER', users => {
      this.cofounders = users;
      this.adminRoleLoading.cofounders = false;
      this.onAdminCofounderFiltersChanged();
      this.adminRoleLoading.reports = false;
    });
  }

  private loadAdminTeamMappings(): void {
    if (!this.isAdmin || !this.startups.length) {
      this.adminCofounderLinksByUserId = {};
      return;
    }

    const startupIds = Array.from(new Set(this.startups.map(item => Number(item.id)).filter(Boolean)));
    if (!startupIds.length) {
      this.adminCofounderLinksByUserId = {};
      return;
    }

    const mapping: Record<number, { startupName: string; contribution: string; status: string; joinedAt?: string }> = {};
    let finished = 0;

    startupIds.forEach(startupId => {
      this.teamService.getTeamMembers(startupId).subscribe({
        next: result => {
          const members = this.extractCollection(result);
          members.forEach((member: any) => {
            const userId = Number(member?.userId ?? member?.id);
            if (!Number.isFinite(userId) || userId <= 0) {
              return;
            }
            const status = member?.isActive === false ? 'INACTIVE' : 'ACTIVE';
            const role = String(member?.role ?? '').trim();
            const startupName = this.getStartupNameById(startupId);
            const joinedAt = member?.joinedAt ?? member?.createdAt ?? member?.created_at ?? '';
            if (!mapping[userId]) {
              mapping[userId] = {
                startupName,
                contribution: role || 'Not Available',
                status,
                joinedAt
              };
            }
            this.loadUserName(userId);
          });

          finished += 1;
          if (finished === startupIds.length) {
            this.adminCofounderLinksByUserId = mapping;
            this.syncAdminPages();
          }
        },
        error: () => {
          finished += 1;
          if (finished === startupIds.length) {
            this.adminCofounderLinksByUserId = mapping;
            this.syncAdminPages();
          }
        }
      });
    });
  }

  private loadAdminUsersByRole(role: 'FOUNDER' | 'INVESTOR' | 'COFOUNDER', apply: (users: User[]) => void): void {
    this.tryLoadRoleUsers(this.getRoleCandidates(role), apply, true);
  }

  private loadAdminUsersByRoleFallback(role: 'FOUNDER' | 'INVESTOR' | 'COFOUNDER', apply: (users: User[]) => void): void {
    this.tryLoadRoleUsers(this.getRoleCandidates(role), apply, false);
  }

  private getRoleCandidates(role: 'FOUNDER' | 'INVESTOR' | 'COFOUNDER'): string[] {
    if (role === 'COFOUNDER') {
      return ['COFOUNDER', 'CO_FOUNDER', 'CO-FOUNDER'];
    }
    return [role];
  }

  private tryLoadRoleUsers(roleCandidates: string[], apply: (users: User[]) => void, authenticated: boolean): void {
    if (!roleCandidates.length) {
      apply([]);
      this.syncAdminPages();
      return;
    }

    const [role, ...rest] = roleCandidates;
    const request = authenticated ? this.api.getUsersByRole(role) : this.api.getPublicUsersByRole(role);
    request.subscribe({
      next: result => {
        const users = this.normalizePublicUsers(this.extractCollection(result));
        if (users.length) {
          apply(users);
          this.syncAdminPages();
          return;
        }

        if (rest.length) {
          this.tryLoadRoleUsers(rest, apply, authenticated);
          return;
        }

        if (authenticated) {
          const fallbackRole = role.includes('INVESTOR') ? 'INVESTOR' : role.includes('FOUNDER') && !role.includes('CO') ? 'FOUNDER' : 'COFOUNDER';
          this.loadAdminUsersByRoleFallback(fallbackRole, apply);
          return;
        }

        apply([]);
        this.syncAdminPages();
      },
      error: () => {
        if (rest.length) {
          this.tryLoadRoleUsers(rest, apply, authenticated);
          return;
        }

        if (authenticated) {
          const fallbackRole = role.includes('INVESTOR') ? 'INVESTOR' : role.includes('FOUNDER') && !role.includes('CO') ? 'FOUNDER' : 'COFOUNDER';
          this.loadAdminUsersByRoleFallback(fallbackRole, apply);
          return;
        }

        apply([]);
        this.syncAdminPages();
      }
    });
  }

  private loadAdminInvestmentsFromStartups(): void {
    if (!this.isAdmin) {
      return;
    }
    const startupIds = Array.from(new Set(this.startups.map(item => Number(item.id)).filter(Boolean)));
    if (!startupIds.length) {
      this.adminAllInvestments = [];
      this.syncAdminPages();
      return;
    }

    this.adminInvestmentsLoading = true;
    this.adminRoleLoading.investments = true;
    const collected: Investment[] = [];
    let completed = 0;

    startupIds.forEach(startupId => {
      this.api.getInvestmentsByStartup(startupId).subscribe({
        next: result => {
          const list = this.extractCollection(result);
          const normalized = (Array.isArray(list) ? list : []).map((inv: any) => ({
            id: inv.id,
            startupId: inv.startupId ?? startupId,
            investorId: inv.investorId ?? inv.investor_id ?? 0,
            amount: Number(inv.amount ?? inv.investedAmount ?? 0),
            status: String(inv.status ?? inv.investmentStatus ?? 'PENDING').toUpperCase(),
            createdAt: inv.createdAt ?? inv.created_at ?? inv.createdOn ?? ''
          }));
          collected.push(...normalized);
          normalized.forEach(item => {
            this.loadUserName(Number(item.investorId));
            this.loadStartupName(Number(item.startupId));
          });
          completed += 1;
          if (completed === startupIds.length) {
            this.adminAllInvestments = collected;
            this.adminInvestmentsLoading = false;
            this.adminRoleLoading.investments = false;
            this.syncAdminPages();
          }
        },
        error: () => {
          completed += 1;
          if (completed === startupIds.length) {
            this.adminAllInvestments = collected;
            this.adminInvestmentsLoading = false;
            this.adminRoleLoading.investments = false;
            this.syncAdminPages();
          }
        }
      });
    });
  }

  setAdminSection(section: string): void {
    if (!this.adminSections.includes(section)) {
      return;
    }
    this.adminActiveSection = section;
    this.syncAdminPages();
  }

  get adminTotalUsers(): number {
    return this.adminFounderUsers.length + this.adminInvestorUsers.length + this.cofounders.length;
  }

  get adminTotalStartups(): number {
    return Math.max(this.startups.length, this.publicStartups.length);
  }

  get adminFounderUsers(): User[] {
    return this.mergeUsersById(this.founders, this.publicFounders, this.foundersFromStartups);
  }

  get adminInvestorUsers(): User[] {
    return this.mergeUsersById(this.investors, this.publicInvestors);
  }

  get adminFounderCount(): number {
    return this.adminFounderUsers.length;
  }

  get adminInvestorCount(): number {
    return this.adminInvestorUsers.length;
  }

  get adminCofounderCount(): number {
    return this.cofounders.length;
  }

  get adminTotalInvestmentsAmount(): number {
    return this.adminAllInvestments.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  }

  get adminRevenue(): number {
    return this.adminAllInvestments
      .filter(inv => ['COMPLETED', 'SUCCESS'].includes(String(inv.status).toUpperCase()))
      .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  }

  get adminFounderRows(): any[] {
    return this.adminFounderUsers.map(founder => {
      const founderStartups = this.startups.filter(s => Number(s.founderId) === Number(founder.id));
      const displayName =
        String(founder.name || '').trim() ||
        this.resolveFounderDisplayName(Number(founder.id), founderStartups[0]) ||
        `Founder #${founder.id}`;
      const displayEmail = String(founder.email || '').trim() || this.adminDisplayValue('');
      return {
        ...founder,
        name: displayName,
        email: displayEmail,
        startupName: founderStartups[0]?.name || this.adminDisplayValue(''),
        startupCount: founderStartups.length,
        status: this.adminFounderBlockedById[founder.id] ? 'BLOCKED' : 'ACTIVE',
        createdAt: (founder as any)?.createdAt || founderStartups[0]?.createdAt || ''
      };
    });
  }

  get filteredAdminFounders(): any[] {
    const query = this.adminFounderSearch.trim().toLowerCase();
    let rows = this.adminFounderRows.filter(item => {
      const searchable = `${item.name || ''} ${item.email || ''} ${item.startupName || ''}`.toLowerCase();
      const searchMatch = !query || searchable.includes(query);
      const isNew = item.createdAt ? (Date.now() - new Date(item.createdAt).getTime()) <= 30 * 24 * 60 * 60 * 1000 : false;
      const filterMatch = this.adminFounderFilter === 'ALL'
        || item.status === this.adminFounderFilter
        || (this.adminFounderFilter === 'NEW' && isNew);
      return searchMatch && filterMatch;
    });

    if (this.adminFounderSort === 'NAME_ASC') {
      rows = rows.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    } else if (this.adminFounderSort === 'NAME_DESC') {
      rows = rows.sort((a, b) => String(b.name || '').localeCompare(String(a.name || '')));
    } else if (this.adminFounderSort === 'STARTUPS_DESC') {
      rows = rows.sort((a, b) => (b.startupCount || 0) - (a.startupCount || 0));
    } else if (this.adminFounderSort === 'RECENT_JOINED') {
      rows = rows.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
    }

    return rows;
  }

  get pagedAdminFounders(): any[] {
    const currentPage = Math.min(this.adminFounderPage, this.adminFounderTotalPages);
    const start = (currentPage - 1) * this.adminFounderPageSize;
    return this.filteredAdminFounders.slice(start, start + this.adminFounderPageSize);
  }

  get adminFounderTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAdminFounders.length / this.adminFounderPageSize));
  }

  toggleFounderBlock(founderId: number): void {
    const isBlocked = !!this.adminFounderBlockedById[founderId];
    const confirmText = isBlocked ? 'Unblock this founder?' : 'Block this founder?';
    if (!window.confirm(confirmText)) {
      return;
    }
    this.adminFounderBlockedById[founderId] = !isBlocked;
    this.pushToast('info', isBlocked ? 'Founder unblocked.' : 'Founder blocked.');
  }

  get adminCofounderStartupOptions(): string[] {
    const options = Object.values(this.adminCofounderLinksByUserId)
      .map(item => String(item?.startupName ?? '').trim())
      .filter(Boolean);
    return Array.from(new Set(options)).sort((a, b) => a.localeCompare(b));
  }

  get adminCofounderRows(): any[] {
    return this.cofounders.map(item => {
      const link = this.adminCofounderLinksByUserId[item.id];
      const mappedStatus = this.adminCofounderApprovalById[item.id] === 'REJECTED' ? 'INACTIVE' : (link?.status || 'ACTIVE');
      return {
        ...item,
        name: this.adminDisplayValue(item.name),
        email: this.adminDisplayValue(item.email),
        startupName: this.adminDisplayValue(link?.startupName),
        contribution: this.adminDisplayValue(link?.contribution),
        status: mappedStatus,
        approvalStatus: this.adminCofounderApprovalById[item.id] || 'PENDING'
      };
    });
  }

  get filteredAdminCofounders(): any[] {
    const query = this.adminCofounderSearch.trim().toLowerCase();
    let rows = this.adminCofounderRows.filter(item => {
      const profile = `${item.name || ''} ${item.email || ''} ${item.startupName || ''} ${item.contribution || ''}`.toLowerCase();
      const searchMatch = !query || profile.includes(query);
      const startupMatch = this.adminCofounderStartupFilter === 'ALL' || item.startupName === this.adminCofounderStartupFilter;
      const statusMatch = this.adminCofounderStatusFilter === 'ALL' || String(item.status).toUpperCase() === this.adminCofounderStatusFilter;
      return searchMatch && startupMatch && statusMatch;
    });

    if (this.adminCofounderSort === 'NAME_ASC') {
      rows = rows.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    } else if (this.adminCofounderSort === 'NAME_DESC') {
      rows = rows.sort((a, b) => String(b.name || '').localeCompare(String(a.name || '')));
    }
    return rows;
  }

  get pagedAdminCofounders(): any[] {
    const start = (this.adminCofounderCurrentPage - 1) * this.adminCofounderPageSize;
    return this.filteredAdminCofounders.slice(start, start + this.adminCofounderPageSize);
  }

  get adminCofounderTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAdminCofounders.length / this.adminCofounderPageSize));
  }

  setCofounderApproval(cofounderId: number, status: 'APPROVED' | 'REJECTED'): void {
    if (!window.confirm(`Are you sure you want to ${status === 'APPROVED' ? 'approve' : 'reject'} this cofounder?`)) {
      return;
    }
    this.adminCofounderApprovalById[cofounderId] = status;
    this.pushToast('success', `Cofounder ${status.toLowerCase()}.`);
  }

  get adminInvestorRows(): any[] {
    const byId = new Map<number, User>();
    this.adminInvestorUsers.forEach(investor => {
      const investorId = Number(investor.id);
      if (Number.isFinite(investorId) && investorId > 0) {
        byId.set(investorId, investor);
      }
    });

    this.adminAllInvestments.forEach(item => {
      const investorId = Number(item.investorId);
      if (!Number.isFinite(investorId) || investorId <= 0 || byId.has(investorId)) {
        return;
      }

      byId.set(investorId, {
        id: investorId,
        name: this.getUserName(investorId),
        email: '',
        role: 'INVESTOR',
        skills: '',
        experience: '',
        bio: '',
        portfolioLinks: ''
      });
    });

    return Array.from(byId.values()).map(investor => {
      const investments = this.adminAllInvestments.filter(item => Number(item.investorId) === Number(investor.id));
      const latest = [...investments].sort((a, b) => this.getInvestmentTime(b) - this.getInvestmentTime(a))[0];
      return {
        ...investor,
        name: String(investor.name || '').trim() || this.getUserName(Number(investor.id)),
        email: this.adminDisplayValue(investor.email),
        totalInvested: investments.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0),
        investmentCount: investments.length,
        recentActivity: latest
          ? `${this.getStartupNameById(Number(latest.startupId))} (${latest.createdAt ? new Date(latest.createdAt).toLocaleDateString('en-IN') : 'Recent'})`
          : this.adminDisplayValue(''),
        status: this.adminInvestorBlockedById[investor.id] ? 'BLOCKED' : 'ACTIVE'
      };
    });
  }

  get filteredAdminInvestors(): any[] {
    const query = this.adminInvestorSearch.trim().toLowerCase();
    let rows = this.adminInvestorRows.filter(item => {
      const searchable = `${item.name || ''} ${item.email || ''}`.toLowerCase();
      const searchMatch = !query || searchable.includes(query);
      const filterMatch = this.adminInvestorFilter === 'ALL' || item.status === this.adminInvestorFilter;
      return searchMatch && filterMatch;
    });

    if (this.adminInvestorSort === 'INVESTED_DESC') {
      rows = rows.sort((a, b) => (b.totalInvested || 0) - (a.totalInvested || 0));
    } else if (this.adminInvestorSort === 'INVESTED_ASC') {
      rows = rows.sort((a, b) => (a.totalInvested || 0) - (b.totalInvested || 0));
    } else if (this.adminInvestorSort === 'NAME_ASC') {
      rows = rows.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    }
    return rows;
  }

  get pagedAdminInvestors(): any[] {
    const currentPage = Math.min(this.adminInvestorPage, this.adminInvestorTotalPages);
    const start = (currentPage - 1) * this.adminInvestorPageSize;
    return this.filteredAdminInvestors.slice(start, start + this.adminInvestorPageSize);
  }

  get adminInvestorTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAdminInvestors.length / this.adminInvestorPageSize));
  }

  toggleInvestorBlock(investorId: number): void {
    const isBlocked = !!this.adminInvestorBlockedById[investorId];
    if (!window.confirm(isBlocked ? 'Unblock this investor?' : 'Block this investor?')) {
      return;
    }
    this.adminInvestorBlockedById[investorId] = !isBlocked;
    this.pushToast('info', isBlocked ? 'Investor unblocked.' : 'Investor blocked.');
  }

  getAdminStartupStatus(startup: any): 'PENDING' | 'APPROVED' | 'REJECTED' {
    const fromMap = this.adminStartupStatusById[startup.id];
    if (fromMap) {
      return fromMap;
    }
    const raw = String((startup as any)?.status || '').toUpperCase();
    if (raw === 'APPROVED' || raw === 'REJECTED') {
      return raw;
    }
    return 'PENDING';
  }

  get filteredAdminStartups(): any[] {
    const query = this.adminStartupSearch.trim().toLowerCase();
    let rows = this.startups.filter(startup => {
      const status = this.getAdminStartupStatus(startup);
      const searchable = `${startup.name || ''} ${startup.industry || ''} ${this.getFounderName(startup)}`.toLowerCase();
      const searchMatch = !query || searchable.includes(query);
      const filterMatch = this.adminStartupFilter === 'ALL' || status === this.adminStartupFilter;
      return searchMatch && filterMatch;
    });

    if (this.adminStartupSort === 'NEWEST') {
      rows = rows.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) || 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) || 0;
        return bTime - aTime;
      });
    } else if (this.adminStartupSort === 'FUNDING_DESC') {
      rows = rows.sort((a, b) => (Number(b.fundingGoal) || 0) - (Number(a.fundingGoal) || 0));
    } else if (this.adminStartupSort === 'NAME_ASC') {
      rows = rows.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    }

    return rows.map(item => {
      const amountRaised = this.getStartupInvestedAmount(Number(item.id));
      const goal = Number(item.fundingGoal) || 0;
      const progress = goal > 0 ? Math.min(100, Math.round((amountRaised / goal) * 100)) : 0;
      return {
        ...item,
        amountRaised,
        fundingProgress: progress,
        founderDisplayName: this.resolveFounderDisplayName(Number(item.founderId), item)
      };
    });
  }

  get pagedAdminStartups(): any[] {
    const start = (this.adminStartupCurrentPage - 1) * this.adminStartupPageSize;
    return this.filteredAdminStartups.slice(start, start + this.adminStartupPageSize);
  }

  get adminStartupTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAdminStartups.length / this.adminStartupPageSize));
  }

  updateStartupStatus(startupId: number, status: 'APPROVED' | 'REJECTED'): void {
    if (!window.confirm(`Are you sure you want to mark this startup as ${status.toLowerCase()}?`)) {
      return;
    }
    this.adminStartupStatusById[startupId] = status;
    this.pushToast('success', `Startup ${status.toLowerCase()}.`);
  }

  get filteredAdminInvestments(): Investment[] {
    const query = this.adminInvestmentSearch.trim().toLowerCase();
    let rows = [...this.adminAllInvestments].filter(inv => {
      const investor = this.getUserName(Number(inv.investorId));
      const startup = this.getStartupNameById(Number(inv.startupId));
      const searchable = `${investor} ${startup} ${inv.status}`.toLowerCase();
      const searchMatch = !query || searchable.includes(query);
      const status = String(inv.status || '').toUpperCase();
      const filter = this.adminInvestmentFilter;
      const filterMatch = filter === 'ALL' || status === filter;
      return searchMatch && filterMatch;
    });

    if (this.adminInvestmentSort === 'RECENT' || this.adminInvestmentSort === 'NEWEST') {
      rows = rows.sort((a, b) => this.getInvestmentTime(b) - this.getInvestmentTime(a));
    } else if (this.adminInvestmentSort === 'AMOUNT_DESC') {
      rows = rows.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
    } else if (this.adminInvestmentSort === 'AMOUNT_ASC') {
      rows = rows.sort((a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0));
    }

    return rows;
  }

  get pagedAdminInvestments(): Investment[] {
    const start = (this.adminInvestmentCurrentPage - 1) * this.adminInvestmentPageSize;
    return this.filteredAdminInvestments.slice(start, start + this.adminInvestmentPageSize);
  }

  get adminInvestmentTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAdminInvestments.length / this.adminInvestmentPageSize));
  }

  get adminReports(): any[] {
    const blockedFounders = this.adminFounderRows
      .filter(item => item.status === 'BLOCKED')
      .map(item => ({ type: 'Founder', title: item.name, reason: 'Blocked by admin', actionId: item.id }));
    const blockedInvestors = this.adminInvestorRows
      .filter(item => item.status === 'BLOCKED')
      .map(item => ({ type: 'Investor', title: item.name, reason: 'Blocked by admin', actionId: item.id }));
    const rejectedStartups = this.startups
      .filter(item => this.getAdminStartupStatus(item) === 'REJECTED')
      .map(item => ({ type: 'Startup', title: item.name, reason: 'Rejected by admin', actionId: item.id }));
    const flaggedInvestments = this.adminAllInvestments
      .filter(item => ['FAILED', 'PENDING', 'REJECTED'].includes(this.upper(item.status)))
      .map(item => ({
        type: 'Investment',
        title: `${this.getUserName(Number(item.investorId))} -> ${this.getStartupNameById(Number(item.startupId))}`,
        reason: `Status: ${this.upper(item.status)}`,
        actionId: item.id
      }));
    return [...blockedFounders, ...blockedInvestors, ...rejectedStartups, ...flaggedInvestments];
  }

  get filteredAdminReports(): any[] {
    const query = this.adminReportSearch.trim().toLowerCase();
    let rows = this.adminReports.filter(item => {
      const searchable = `${item.type} ${item.title} ${item.reason}`.toLowerCase();
      const searchMatch = !query || searchable.includes(query);
      const filterMatch = this.adminReportFilter === 'ALL' || String(item.type).toUpperCase() === this.adminReportFilter;
      return searchMatch && filterMatch;
    });

    if (this.adminReportSort === 'TYPE_ASC') {
      rows = rows.sort((a, b) => String(a.type).localeCompare(String(b.type)));
    } else if (this.adminReportSort === 'TYPE_DESC') {
      rows = rows.sort((a, b) => String(b.type).localeCompare(String(a.type)));
    } else if (this.adminReportSort === 'TITLE_ASC') {
      rows = rows.sort((a, b) => String(a.title).localeCompare(String(b.title)));
    }

    return rows;
  }

  get pagedAdminReports(): any[] {
    const start = (this.adminReportCurrentPage - 1) * this.adminReportPageSize;
    return this.filteredAdminReports.slice(start, start + this.adminReportPageSize);
  }

  get adminReportTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAdminReports.length / this.adminReportPageSize));
  }

  get adminFounderCurrentPage(): number {
    return Math.min(Math.max(1, this.adminFounderPage), this.adminFounderTotalPages);
  }

  get adminCofounderCurrentPage(): number {
    return Math.min(Math.max(1, this.adminCofounderPage), this.adminCofounderTotalPages);
  }

  get adminInvestorCurrentPage(): number {
    return Math.min(Math.max(1, this.adminInvestorPage), this.adminInvestorTotalPages);
  }

  get adminStartupCurrentPage(): number {
    return Math.min(Math.max(1, this.adminStartupPage), this.adminStartupTotalPages);
  }

  get adminInvestmentCurrentPage(): number {
    return Math.min(Math.max(1, this.adminInvestmentPage), this.adminInvestmentTotalPages);
  }

  get adminReportCurrentPage(): number {
    return Math.min(Math.max(1, this.adminReportPage), this.adminReportTotalPages);
  }

  onAdminFounderFiltersChanged(): void {
    this.adminFounderPage = 1;
  }

  onAdminCofounderFiltersChanged(): void {
    this.adminCofounderPage = 1;
  }

  onAdminInvestorFiltersChanged(): void {
    this.adminInvestorPage = 1;
  }

  onAdminStartupFiltersChanged(): void {
    this.adminStartupPage = 1;
  }

  onAdminInvestmentFiltersChanged(): void {
    this.adminInvestmentPage = 1;
  }

  onAdminReportFiltersChanged(): void {
    this.adminReportPage = 1;
  }

  prevAdminFounderPage(): void {
    this.adminFounderPage = Math.max(1, this.adminFounderCurrentPage - 1);
  }

  nextAdminFounderPage(): void {
    this.adminFounderPage = Math.min(this.adminFounderTotalPages, this.adminFounderCurrentPage + 1);
  }

  prevAdminCofounderPage(): void {
    this.adminCofounderPage = Math.max(1, this.adminCofounderCurrentPage - 1);
  }

  nextAdminCofounderPage(): void {
    this.adminCofounderPage = Math.min(this.adminCofounderTotalPages, this.adminCofounderCurrentPage + 1);
  }

  prevAdminInvestorPage(): void {
    this.adminInvestorPage = Math.max(1, this.adminInvestorCurrentPage - 1);
  }

  nextAdminInvestorPage(): void {
    this.adminInvestorPage = Math.min(this.adminInvestorTotalPages, this.adminInvestorCurrentPage + 1);
  }

  prevAdminStartupPage(): void {
    this.adminStartupPage = Math.max(1, this.adminStartupCurrentPage - 1);
  }

  nextAdminStartupPage(): void {
    this.adminStartupPage = Math.min(this.adminStartupTotalPages, this.adminStartupCurrentPage + 1);
  }

  prevAdminInvestmentPage(): void {
    this.adminInvestmentPage = Math.max(1, this.adminInvestmentCurrentPage - 1);
  }

  nextAdminInvestmentPage(): void {
    this.adminInvestmentPage = Math.min(this.adminInvestmentTotalPages, this.adminInvestmentCurrentPage + 1);
  }

  prevAdminReportPage(): void {
    this.adminReportPage = Math.max(1, this.adminReportCurrentPage - 1);
  }

  nextAdminReportPage(): void {
    this.adminReportPage = Math.min(this.adminReportTotalPages, this.adminReportCurrentPage + 1);
  }

  private syncAdminPages(): void {
    this.adminFounderPage = this.adminFounderCurrentPage;
    this.adminCofounderPage = this.adminCofounderCurrentPage;
    this.adminInvestorPage = this.adminInvestorCurrentPage;
    this.adminStartupPage = this.adminStartupCurrentPage;
    this.adminInvestmentPage = this.adminInvestmentCurrentPage;
    this.adminReportPage = this.adminReportCurrentPage;
  }

  get adminDetailsIsProfile(): boolean {
    return this.isAdminProfileTitle(this.adminDetailsTitle) && !!this.adminDetailsPayload;
  }

  get adminDetailsIsStartupCard(): boolean {
    return this.adminDetailsTitle === 'Startup Details' && !!this.adminDetailsPayload;
  }

  get adminDetailsIsInvestorPortfolioCard(): boolean {
    return this.adminDetailsTitle === 'Investor Portfolio' && !!this.adminDetailsPayload;
  }

  get adminProfileDetailsView(): any {
    const payload = this.adminDetailsPayload || {};
    const profileId = Number(payload.id) || 0;
    const ownedStartups = profileId > 0
      ? this.startups.filter(item => Number((item as any)?.founderId) === profileId)
      : [];

    return {
      id: profileId,
      name: this.adminDisplayValue(payload.name),
      email: this.adminDisplayValue(payload.email),
      role: this.adminDisplayValue(payload.role),
      status: this.adminDisplayValue(payload.status, 'ACTIVE'),
      startupName: this.adminDisplayValue(payload.startupName),
      startupCount: Number(payload.startupCount) || ownedStartups.length,
      joinedOn: payload.createdAt || payload.created_at || '',
      contribution: this.adminDisplayValue(payload.contribution),
      totalInvested: Number(payload.totalInvested) || 0,
      investmentCount: Number(payload.investmentCount) || 0,
      recentActivity: this.adminDisplayValue(payload.recentActivity),
      skills: this.adminDisplayValue(payload.skills),
      experience: this.adminDisplayValue(payload.experience),
      bio: this.adminDisplayValue(payload.bio),
      portfolioLinks: this.adminDisplayValue(payload.portfolioLinks)
    };
  }

  get adminStartupDetailsView(): any {
    const payload = this.adminDetailsPayload || {};
    const startupId = Number(payload.id) || 0;
    const raised = Number(payload.amountRaised) || this.getStartupInvestedAmount(startupId);
    const goal = Number(payload.fundingGoal) || 0;
    const progress = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
    return {
      id: startupId,
      name: this.adminDisplayValue(payload.name),
      founderName: this.adminDisplayValue(payload.founderDisplayName || this.resolveFounderDisplayName(Number(payload.founderId), payload)),
      industry: this.adminDisplayValue(payload.industry),
      stage: this.adminDisplayValue(payload.stage),
      description: this.adminDisplayValue(payload.description),
      problemStatement: this.adminDisplayValue(payload.problemStatement),
      solution: this.adminDisplayValue(payload.solution),
      fundingGoal: goal,
      amountRaised: raised,
      fundingProgress: progress,
      createdAt: payload.createdAt || payload.created_at || '',
      status: this.getAdminStartupStatus(payload)
    };
  }

  getAdminStatusBadgeClass(status: any): string {
    const normalized = String(status || '').toUpperCase();
    if (normalized === 'BLOCKED' || normalized === 'INACTIVE') {
      return 'bg-rose-100 text-rose-700';
    }
    if (normalized === 'PENDING') {
      return 'bg-amber-100 text-amber-700';
    }
    return 'bg-emerald-100 text-emerald-700';
  }

  formatAdminDateTime(value: any): string {
    if (!value) {
      return 'Not Available';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private isAdminProfileTitle(title: string): boolean {
    return title === 'Founder Profile' || title === 'Cofounder Profile' || title === 'Investor Profile';
  }

  private seedAdminDetailsDraft(payload: any): void {
    this.adminDetailsDraft.skills = String(payload?.skills ?? '').trim();
    this.adminDetailsDraft.experience = String(payload?.experience ?? '').trim();
    this.adminDetailsDraft.bio = String(payload?.bio ?? '').trim();
    this.adminDetailsDraft.portfolioLinks = String(payload?.portfolioLinks ?? '').trim();
  }

  private hydrateAdminProfileDetails(userId: number): void {
    if (!userId) {
      return;
    }
    this.adminDetailsLoading = true;
    this.api.getUserById(userId).subscribe({
      next: result => {
        this.adminDetailsLoading = false;
        const payload = result?.data ?? result ?? {};
        this.adminDetailsPayload = {
          ...this.adminDetailsPayload,
          ...payload
        };
        this.seedAdminDetailsDraft(this.adminDetailsPayload);
      },
      error: () => {
        this.api.getPublicUserById(userId).subscribe({
          next: publicResult => {
            this.adminDetailsLoading = false;
            const payload = publicResult?.data ?? publicResult ?? {};
            this.adminDetailsPayload = {
              ...this.adminDetailsPayload,
              ...payload
            };
            this.seedAdminDetailsDraft(this.adminDetailsPayload);
          },
          error: () => {
            this.adminDetailsLoading = false;
          }
        });
      }
    });
  }

  private patchAdminUserCollections(userId: number, patch: { skills: string; experience: string; bio: string; portfolioLinks: string }): void {
    const patchUser = (user: User): User => {
      if (Number(user.id) !== userId) {
        return user;
      }
      return {
        ...user,
        skills: patch.skills,
        experience: patch.experience,
        bio: patch.bio,
        portfolioLinks: patch.portfolioLinks
      };
    };

    this.founders = this.founders.map(patchUser);
    this.publicFounders = this.publicFounders.map(patchUser);
    this.investors = this.investors.map(patchUser);
    this.publicInvestors = this.publicInvestors.map(patchUser);
    this.cofounders = this.cofounders.map(patchUser);

    const existing = this.userProfileMap[userId] || {
      id: userId,
      name: this.getUserName(userId),
      email: '',
      role: '',
      skills: '',
      experience: '',
      bio: '',
      portfolioLinks: ''
    };
    this.userProfileMap[userId] = {
      ...existing,
      ...patch
    };
  }

  saveAdminProfileDetails(): void {
    const userId = Number(this.adminDetailsPayload?.id);
    if (!this.adminDetailsIsProfile || !userId) {
      return;
    }

    this.adminDetailsSaving = true;
    this.adminDetailsError = '';
    this.adminDetailsSuccess = '';

    const patch = {
      skills: this.adminDetailsDraft.skills.trim(),
      experience: this.adminDetailsDraft.experience.trim(),
      bio: this.adminDetailsDraft.bio.trim(),
      portfolioLinks: this.adminDetailsDraft.portfolioLinks.trim()
    };

    this.api.updateUser(userId, patch).subscribe({
      next: () => {
        this.adminDetailsSaving = false;
        this.adminDetailsSuccess = 'Profile details updated.';
        this.adminDetailsPayload = {
          ...this.adminDetailsPayload,
          ...patch
        };
        this.patchAdminUserCollections(userId, patch);
        this.pushToast('success', 'Profile updated successfully.');
      },
      error: err => {
        this.adminDetailsSaving = false;
        this.adminDetailsError = err?.error?.message || 'Unable to update profile details.';
      }
    });
  }

  openAdminDetails(title: string, payload: any): void {
    this.adminDetailsTitle = title;
    this.adminDetailsPayload = payload;
    this.adminDetailsError = '';
    this.adminDetailsSuccess = '';
    this.adminDetailsSaving = false;
    this.adminDetailsLoading = false;
    this.seedAdminDetailsDraft(payload || {});
    if (this.isAdminProfileTitle(title)) {
      this.hydrateAdminProfileDetails(Number(payload?.id));
    }
    this.showAdminDetailsModal = true;
  }

  closeAdminDetails(): void {
    this.showAdminDetailsModal = false;
    this.adminDetailsTitle = '';
    this.adminDetailsPayload = null;
    this.adminDetailsError = '';
    this.adminDetailsSuccess = '';
    this.adminDetailsSaving = false;
    this.adminDetailsLoading = false;
  }

  saveAdminSettings(): void {
    this.userName = this.adminSettingsName.trim() || this.userName;
    this.authEmail = this.adminSettingsEmail.trim() || this.authEmail;
    localStorage.setItem('authUserName', this.userName);
    localStorage.setItem('authEmail', this.authEmail);
    this.pushToast('success', 'Admin settings saved.');
  }

  get adminActivityFeed(): any[] {
    const activities: any[] = [];
    const latestFounders = this.adminFounderUsers.slice(0, 3).map(item => ({
      text: `New founder joined: ${item.name || item.email || 'Founder'}`,
      time: 'recent'
    }));
    const latestInvestments = [...this.adminAllInvestments]
      .sort((a, b) => this.getInvestmentTime(b) - this.getInvestmentTime(a))
      .slice(0, 4)
      .map(inv => ({
        text: `Investment ${this.upper(inv.status)} - ${this.getUserName(inv.investorId)} invested Rs ${Number(inv.amount || 0).toLocaleString()} in ${this.getStartupNameById(inv.startupId)}`,
        time: inv.createdAt || 'recent'
      }));
    activities.push(...latestInvestments, ...latestFounders);
    return activities.slice(0, 8);
  }

  get adminStartupGrowthSeries(): Array<{ label: string; value: number }> {
    const windowDays = 7;
    const labels = this.getRecentDayLabels(windowDays);
    const values = new Array(windowDays).fill(0);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    this.startups.forEach(startup => {
      const createdRaw = (startup as any)?.createdAt ?? (startup as any)?.created_at ?? (startup as any)?.createdOn;
      const date = this.parseSeriesDate(createdRaw);
      if (!date) {
        return;
      }
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const daysAgo = Math.floor((todayStart - dayStart) / 86400000);
      if (daysAgo >= 0 && daysAgo < windowDays) {
        const index = windowDays - 1 - daysAgo;
        values[index] += 1;
      }
    });

    return labels.map((label, index) => ({ label, value: values[index] }));
  }

  get adminInvestmentSeries(): Array<{ label: string; value: number }> {
    const months = this.getRecentMonths(6);
    const buckets = new Map<string, number>();
    months.forEach(month => buckets.set(month.key, 0));

    this.adminAllInvestments.forEach(investment => {
      const date = this.parseSeriesDate((investment as any)?.createdAt ?? (investment as any)?.created_at ?? (investment as any)?.createdOn);
      if (!date) {
        return;
      }
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) || 0) + (Number(investment.amount) || 0));
      }
    });

    // If timestamps are unavailable in responses, keep total visible in the current month.
    if (this.adminAllInvestments.length && Array.from(buckets.values()).every(value => value === 0)) {
      const currentMonthKey = months[months.length - 1]?.key;
      if (currentMonthKey) {
        buckets.set(currentMonthKey, this.adminTotalInvestmentsAmount);
      }
    }

    return months.map(month => ({ label: month.label, value: Math.round(buckets.get(month.key) || 0) }));
  }

  private parseSeriesDate(raw: any): Date | null {
    if (!raw) {
      return null;
    }
    const date = raw instanceof Date ? raw : new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private getRecentDayLabels(days: number): string[] {
    const labels: string[] = [];
    const now = new Date();
    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - offset);
      labels.push(date.toLocaleDateString('en-IN', { weekday: 'short' }));
    }
    return labels;
  }

  private getRecentMonths(count: number): Array<{ key: string; label: string }> {
    const months: Array<{ key: string; label: string }> = [];
    const now = new Date();
    for (let offset = count - 1; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-IN', { month: 'short' });
      months.push({ key, label });
    }
    return months;
  }

  getSeriesPointHeight(value: number, list: Array<{ label: string; value: number }>, min = 12, max = 100): number {
    const peak = Math.max(1, ...list.map(item => item.value));
    const ratio = value / peak;
    return Math.max(min, Math.round(ratio * max));
  }

  getLineChartPoints(list: Array<{ label: string; value: number }>): string {
    if (!list.length) {
      return '';
    }
    const max = Math.max(1, ...list.map(item => item.value));
    const count = Math.max(1, list.length - 1);
    return list
      .map((item, index) => {
        const x = (index / count) * 100;
        const y = 100 - ((item.value / max) * 100);
        return `${x},${y}`;
      })
      .join(' ');
  }

  onMessageStartupChange(): void {
    if (this.messagePartnerId) {
      this.loadConversation();
    }
  }

  private refreshUnreadCounts(): void {
    if (!this.userId) {
      return;
    }

    const partners = this.getRoleScopedPartners(this.messagePartners);
    if (!partners.length) {
      this.messageUnreadCountByPartner = {};
      return;
    }

    partners.forEach(partnerId => {
      this.messagingService.getConversation(this.userId as number, partnerId).subscribe({
        next: result => {
          const conversation = Array.isArray(result) ? result : [];
          this.recalculateUnreadForPartner(partnerId, conversation);
        },
        error: () => {
          this.messageUnreadCountByPartner[partnerId] = this.messageUnreadCountByPartner[partnerId] || 0;
        }
      });
    });
  }

  private recalculateUnreadForPartner(partnerId: number, conversation: MessageItem[]): void {
    const normalizedPartnerId = Number(partnerId);
    if (!this.userId || !Number.isFinite(normalizedPartnerId) || normalizedPartnerId <= 0) {
      return;
    }

    if (this.messagePartnerId === normalizedPartnerId) {
      this.messageUnreadCountByPartner[normalizedPartnerId] = 0;
      return;
    }

    const lastSeenAt = this.messageLastSeenAtByPartner[normalizedPartnerId] || 0;
    const unread = (conversation || []).filter(msg => {
      const senderId = Number((msg as any)?.senderId);
      if (senderId !== normalizedPartnerId) {
        return false;
      }
      return this.getMessageTime(msg) > lastSeenAt;
    }).length;

    this.messageUnreadCountByPartner[normalizedPartnerId] = Math.max(0, unread);
  }

  private markConversationAsSeen(partnerId: number, conversation: MessageItem[] = []): void {
    const normalizedPartnerId = Number(partnerId);
    if (!Number.isFinite(normalizedPartnerId) || normalizedPartnerId <= 0) {
      return;
    }
    const latestMessageTime = (conversation || [])
      .map(item => this.getMessageTime(item))
      .reduce((max, value) => Math.max(max, value), 0);
    this.messageLastSeenAtByPartner[normalizedPartnerId] = latestMessageTime || Date.now();
    this.messageUnreadCountByPartner[normalizedPartnerId] = 0;
    this.persistMessageSeenState();
  }

  private getMessageTime(message: MessageItem | any): number {
    const raw = message?.createdAt ?? message?.created_at ?? message?.createdOn ?? message?.updatedAt ?? '';
    const time = raw ? new Date(raw).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
  }

  private startMessagePollingTimer(): void {
    if (this.messagePollingTimer) {
      return;
    }
    this.messagePollingTimer = setInterval(() => {
      if (!this.isAuthenticated || !this.userId) {
        return;
      }
      if (this.isInvestor) {
        this.loadInvestorInvestments();
      }
      if (this.isFounder) {
        this.refreshFounderPartnerSources();
      }
      this.loadMessagePartners();
      if (this.messagePartnerId) {
        this.loadConversation();
      }
    }, 15000);
  }

  private loadMessageSeenState(): void {
    try {
      const raw = localStorage.getItem(this.messageSeenStorageKey);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as Record<string, number>;
      if (!parsed || typeof parsed !== 'object') {
        return;
      }
      this.messageLastSeenAtByPartner = Object.entries(parsed).reduce((acc, [key, value]) => {
        const partnerId = Number(key);
        const seenAt = Number(value);
        if (Number.isFinite(partnerId) && partnerId > 0 && Number.isFinite(seenAt) && seenAt > 0) {
          acc[partnerId] = seenAt;
        }
        return acc;
      }, {} as Record<number, number>);
    } catch {
      this.messageLastSeenAtByPartner = {};
    }
  }

  private persistMessageSeenState(): void {
    try {
      localStorage.setItem(this.messageSeenStorageKey, JSON.stringify(this.messageLastSeenAtByPartner));
    } catch {
      // ignore storage write failures
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
    this.adminLoginMode = false;
    this.startups = [];
    this.cofounderOpportunities = [];
    this.cofounderMyInterests = [];
    this.founderInterestRequests = [];
    this.founderInterestRoleById = {};
    this.notifications = [];
    this.notificationReadAtMap = {};
    this.showNotificationsPanel = false;
    this.showProfileMenu = false;
    this.messageUnreadCountByPartner = {};
    this.messageLastSeenAtByPartner = {};
    localStorage.removeItem(this.messageSeenStorageKey);
    if (this.messagePollingTimer) {
      clearInterval(this.messagePollingTimer);
      this.messagePollingTimer = null;
    }
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
