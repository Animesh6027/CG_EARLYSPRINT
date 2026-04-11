import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cofounder-dashboard',
  templateUrl: './cofounder-dashboard.component.html'
})
export class CofounderDashboardComponent {
  @Input() userDisplayName = '';
  @Input() invitations: Array<any> = [];
  @Input() invitationsLoading = false;
  @Input() invitationsError = '';
  @Input() activeTeams: Array<any> = [];
  @Input() activeTeamsLoading = false;
  @Input() activeTeamsError = '';
  @Input() getStartupName!: (startupId: number) => string;
  @Input() opportunities: Array<any> = [];
  @Input() opportunitiesLoading = false;
  @Input() opportunitiesError = '';
  @Input() myInterests: Array<any> = [];
  @Input() myInterestsLoading = false;
  @Input() myInterestsError = '';

  @Output() refreshInvites = new EventEmitter<void>();
  @Output() acceptInvite = new EventEmitter<any>();
  @Output() rejectInvite = new EventEmitter<any>();
  @Output() browse = new EventEmitter<void>();
  @Output() markInterested = new EventEmitter<{ startup: any; role: string }>();
  @Output() refreshInterests = new EventEmitter<void>();

  preferredRolesByStartup: Record<number, string> = {};

  get joinedCount(): number {
    return this.activeTeams.length;
  }

  get acceptedInvitations(): number {
    return this.invitations.filter(inv => String(inv.status || '').toUpperCase() === 'ACCEPTED').length;
  }

  get pendingInvitations(): number {
    return this.invitations.filter(inv => String(inv.status || '').toUpperCase() === 'PENDING').length;
  }

  get pendingInvitationList(): Array<any> {
    return this.invitations.filter(inv => String(inv.status || '').toUpperCase() === 'PENDING');
  }

  get interestStatuses(): Record<string, string> {
    return {
      INTERESTED: 'text-indigo-600',
      ACCEPTED: 'text-emerald-600',
      REJECTED: 'text-rose-600'
    };
  }

  getPreferredRole(startupId: number): string {
    if (!this.preferredRolesByStartup[startupId]) {
      this.preferredRolesByStartup[startupId] = 'CTO';
    }
    return this.preferredRolesByStartup[startupId];
  }

  onInterested(startup: any): void {
    const startupId = Number(startup?.id);
    if (!startupId) {
      return;
    }
    this.markInterested.emit({
      startup,
      role: this.getPreferredRole(startupId)
    });
  }
}
