import { statusStyle, statusLabel } from './status';

describe('statusStyle', () => {
  it('returns correct style for known statuses', () => {
    expect(statusStyle('active')).toBe('text-green-600 bg-green-100');
    expect(statusStyle('rejected')).toBe('text-red-600 bg-red-100');
    expect(statusStyle('pending')).toBe('text-amber-600 bg-amber-100');
  });

  it('returns fallback for unknown status', () => {
    expect(statusStyle('unknown')).toBe('text-muted-foreground bg-muted');
  });
});

describe('statusLabel', () => {
  it('returns correct label for known statuses', () => {
    expect(statusLabel('active')).toBe('Active');
    expect(statusLabel('pending_review')).toBe('Pending Review');
  });

  it('returns the raw status for unknown labels', () => {
    expect(statusLabel('unknown_status')).toBe('unknown_status');
  });
});
