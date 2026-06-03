const STATUS_STYLES: Record<string, string> = {
  active: 'text-green-600 bg-green-100',
  completed: 'text-blue-600 bg-blue-100',
  pending: 'text-amber-600 bg-amber-100',
  pending_review: 'text-amber-600 bg-amber-100',
  processing: 'text-cyan-600 bg-cyan-100',
  approved: 'text-green-600 bg-green-100',
  rejected: 'text-red-600 bg-red-100',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  completed: 'Completed',
  pending: 'Pending Review',
  pending_review: 'Pending Review',
  processing: 'Processing',
  approved: 'Approved',
  rejected: 'Rejected',
};

export function statusStyle(status: string): string {
  return STATUS_STYLES[status] ?? 'text-muted-foreground bg-muted';
}

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}
