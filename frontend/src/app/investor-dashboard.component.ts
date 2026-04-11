import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-investor-dashboard',
  templateUrl: './investor-dashboard.component.html'
})
export class InvestorDashboardComponent {
  @Input() userDisplayName = '';
  private _startups: Array<any> = [];
  private _investments: Array<any> = [];
  @Input() set startups(value: Array<any>) {
    this._startups = Array.isArray(value) ? value : [];
    if (this.page > this.getTotalPagesForLength(this._startups.length)) {
      this.page = 1;
    }
  }
  get startups(): Array<any> {
    return this._startups;
  }
  @Input() set investments(value: Array<any>) {
    this._investments = Array.isArray(value) ? value : [];
    this.investmentsPage = Math.min(this.investmentsPage, this.investmentsTotalPages);
    this.paymentsPage = Math.min(this.paymentsPage, this.paymentsTotalPages);
  }
  get investments(): Array<any> {
    return this._investments;
  }
  @Input() loading = false;
  @Input() getStartupName!: (startupId: number) => string;

  @Output() refresh = new EventEmitter<void>();
  @Output() discover = new EventEmitter<void>();
  @Output() invest = new EventEmitter<any>();
  @Output() pay = new EventEmitter<any>();
  @Output() refreshInvestments = new EventEmitter<void>();

  page = 1;
  pageSize = 6;
  investmentsPage = 1;
  investmentsPageSize = 4;
  paymentsPage = 1;
  paymentsPageSize = 4;

  get totalStartups(): number {
    return this.startups.length;
  }

  scrollToStartups(): void {
    this.discover.emit();
    const section = document.getElementById('startups');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  get totalInvestments(): number {
    return this.investments.length;
  }

  get totalAmountInvested(): number {
    return this.investments.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  }

  get activeInvestments(): number {
    const closed = new Set(['REJECTED', 'COMPLETED', 'STARTUP_CLOSED', 'FAILED', 'CANCELLED', 'CLOSED']);
    return this.investments.filter(inv => {
      const status = String(inv.status || '').toUpperCase();
      return status ? !closed.has(status) : true;
    }).length;
  }

  get investmentsByStartup(): Array<{ startupId: number; totalAmount: number; latestDate?: string; latestStatus?: string; payableInvestment?: any; }> {
    const map = new Map<number, { startupId: number; totalAmount: number; latestDate?: string; latestStatus?: string; payableInvestment?: any; }>();
    this.investments.forEach(inv => {
      const id = Number(inv.startupId);
      if (!id) {
        return;
      }
      const existing = map.get(id) ?? { startupId: id, totalAmount: 0 };
      existing.totalAmount += Number(inv.amount) || 0;
      const status = this.getStatus(inv) || existing.latestStatus;
      const date = this.getDate(inv) || existing.latestDate;
      const statusUpper = String(this.getStatus(inv) || '').toUpperCase().trim();
      if (['APPROVED'].includes(statusUpper)) {
        if (!existing.payableInvestment) {
          existing.payableInvestment = inv;
        } else if (date && existing.payableInvestment?.createdAt) {
          const current = new Date(existing.payableInvestment.createdAt).getTime();
          const next = new Date(date).getTime();
          if (!Number.isNaN(next) && next >= current) {
            existing.payableInvestment = inv;
          }
        }
      }
      if (date && (!existing.latestDate || new Date(date).getTime() >= new Date(existing.latestDate).getTime())) {
        existing.latestDate = date;
        existing.latestStatus = status;
      }
      map.set(id, existing);
    });
    return Array.from(map.values()).sort((a, b) => {
      const aTime = a.latestDate ? new Date(a.latestDate).getTime() : 0;
      const bTime = b.latestDate ? new Date(b.latestDate).getTime() : 0;
      return bTime - aTime;
    });
  }

  get payableInvestments(): Array<any> {
    return this.investments.filter(inv => {
      const statusUpper = String(this.getStatus(inv) || '').toUpperCase().trim();
      return [
        'APPROVED'
      ].includes(statusUpper);
    });
  }

  get sortedPayableInvestments(): Array<any> {
    return [...this.payableInvestments].sort((a, b) => {
      const aTime = this.getInvestmentTime(a);
      const bTime = this.getInvestmentTime(b);
      if (aTime !== bTime) {
        return bTime - aTime;
      }
      const aId = Number(a?.id) || 0;
      const bId = Number(b?.id) || 0;
      return bId - aId;
    });
  }

  private getStatus(inv: any): string {
    return inv?.status ?? inv?.investmentStatus ?? inv?.state ?? '';
  }

  toUpper(value: any): string {
    return String(value ?? '').toUpperCase().trim();
  }

  private getDate(inv: any): string {
    return inv?.createdAt ?? inv?.created_at ?? inv?.createdOn ?? '';
  }

  getInvestmentTotalForStartup(startupId: number): number {
    return this.investments
      .filter(inv => Number(inv.startupId) === Number(startupId))
      .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  }

  getPaidTotalForStartup(startupId: number): number {
    return this.investments
      .filter(inv => Number(inv.startupId) === Number(startupId))
      .filter(inv => this.toUpper(this.getStatus(inv)) === 'COMPLETED')
      .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  }

  getFundingProgressPercent(startup: any): number {
    if (!startup) {
      return 0;
    }
    const goal = Number(startup.fundingGoal) || 0;
    if (!goal) {
      return 0;
    }
    const invested = this.getInvestmentTotalForStartup(startup.id);
    return Math.min(100, (invested / goal) * 100);
  }

  getFundingProgressWidth(startup: any): number {
    const percent = this.getFundingProgressPercent(startup);
    if (percent <= 0) {
      return 0;
    }
    return Math.min(100, Math.max(1, percent));
  }

  getFundingProgressLabel(startup: any): string {
    const percent = this.getFundingProgressPercent(startup);
    if (percent <= 0) {
      return '0%';
    }
    if (percent >= 1) {
      return `${Math.round(percent)}%`;
    }
    return `${percent.toFixed(2)}%`;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedStartups.length / this.pageSize));
  }

  get sortedStartups(): Array<any> {
    return [...this.startups].sort((a, b) => {
      const aTime = this.getStartupTime(a);
      const bTime = this.getStartupTime(b);
      if (aTime !== bTime) {
        return bTime - aTime;
      }
      const aId = Number(a?.id) || 0;
      const bId = Number(b?.id) || 0;
      return bId - aId;
    });
  }

  get paginatedStartups(): Array<any> {
    const clampedPage = Math.min(this.page, this.totalPages);
    const start = (clampedPage - 1) * this.pageSize;
    return this.sortedStartups.slice(start, start + this.pageSize);
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page -= 1;
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page += 1;
    }
  }

  get startupRangeLabel(): string {
    if (!this.sortedStartups.length) {
      return 'Showing 0 of 0';
    }
    const start = (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, this.sortedStartups.length);
    return `Showing ${start}-${end} of ${this.sortedStartups.length}`;
  }

  get paginatedInvestmentsByStartup(): Array<{ startupId: number; totalAmount: number; latestDate?: string; latestStatus?: string; payableInvestment?: any; }> {
    const start = (this.investmentsPage - 1) * this.investmentsPageSize;
    return this.investmentsByStartup.slice(start, start + this.investmentsPageSize);
  }

  get investmentsTotalPages(): number {
    return Math.max(1, Math.ceil(this.investmentsByStartup.length / this.investmentsPageSize));
  }

  get investmentsRangeLabel(): string {
    if (!this.investmentsByStartup.length) {
      return 'Showing 0 of 0';
    }
    const start = (this.investmentsPage - 1) * this.investmentsPageSize + 1;
    const end = Math.min(this.investmentsPage * this.investmentsPageSize, this.investmentsByStartup.length);
    return `Showing ${start}-${end} of ${this.investmentsByStartup.length}`;
  }

  prevInvestmentsPage(): void {
    if (this.investmentsPage > 1) {
      this.investmentsPage -= 1;
    }
  }

  nextInvestmentsPage(): void {
    if (this.investmentsPage < this.investmentsTotalPages) {
      this.investmentsPage += 1;
    }
  }

  get paginatedPayableInvestments(): Array<any> {
    const start = (this.paymentsPage - 1) * this.paymentsPageSize;
    return this.sortedPayableInvestments.slice(start, start + this.paymentsPageSize);
  }

  get paymentsTotalPages(): number {
    return Math.max(1, Math.ceil(this.sortedPayableInvestments.length / this.paymentsPageSize));
  }

  get paymentsRangeLabel(): string {
    if (!this.sortedPayableInvestments.length) {
      return 'Showing 0 of 0';
    }
    const start = (this.paymentsPage - 1) * this.paymentsPageSize + 1;
    const end = Math.min(this.paymentsPage * this.paymentsPageSize, this.sortedPayableInvestments.length);
    return `Showing ${start}-${end} of ${this.sortedPayableInvestments.length}`;
  }

  prevPaymentsPage(): void {
    if (this.paymentsPage > 1) {
      this.paymentsPage -= 1;
    }
  }

  nextPaymentsPage(): void {
    if (this.paymentsPage < this.paymentsTotalPages) {
      this.paymentsPage += 1;
    }
  }

  private getTotalPagesForLength(length: number): number {
    return Math.max(1, Math.ceil(length / this.pageSize));
  }

  private getInvestmentTime(investment: any): number {
    const raw = this.getDate(investment) || investment?.updatedAt || investment?.updated_at || '';
    const time = raw ? new Date(raw).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
  }

  private getStartupTime(startup: any): number {
    if (!startup) {
      return 0;
    }
    if (startup.createdAt) {
      const time = new Date(startup.createdAt).getTime();
      if (!Number.isNaN(time)) {
        return time;
      }
    }
    if (startup.updatedAt) {
      const time = new Date(startup.updatedAt).getTime();
      if (!Number.isNaN(time)) {
        return time;
      }
    }
    return 0;
  }
}
