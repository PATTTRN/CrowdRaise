import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionService, contributionService, withdrawalService, authService } from '@/services';
import { handleApiError } from '@/lib/result';
import type { CollectionQueryParams } from '@/services/collection.service';
import type {
  Collection, Contribution, Withdrawal, Balance, Bank,
  CreateCollectionPayload, UpdateCollectionPayload, InitializeContributionPayload,
  SaveBankDetailsPayload, RegisterPayload, LoginPayload,
} from '@/lib/api-types';

const DEFAULT_STALE = 30_000;
const LONG_STALE = 5 * 60_000;

// ── Keys ──────────────────────────────────────────────────────────────────────

export const queryKeys = {
  collections: {
    all: ['collections'] as const,
    list: (params: CollectionQueryParams) => ['collections', 'list', params] as const,
    detail: (id: string) => ['collections', id] as const,
  },
  contributions: {
    byCollection: (id: string, page?: number) => ['contributions', id, page] as const,
    revenue: ['contributions', 'revenue'] as const,
    all: (page?: number) => ['contributions', 'all', page] as const,
  },
  withdrawals: {
    all: 'withdrawals' as const,
    balance: ['withdrawals', 'balance'] as const,
    my: (page?: number) => ['withdrawals', 'my', page] as const,
    admin: (status?: string, page?: number) => ['withdrawals', 'admin', status, page] as const,
  },
  banks: ['banks'] as const,
  users: ['users'] as const,
  auth: {
    me: ['auth', 'me'] as const,
  },
};

// ── Collections ────────────────────────────────────────────────────────────────

export function useCollections(params: CollectionQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.collections.list(params),
    queryFn: () => collectionService.getAllCollections(params),
    select: (data) => data.data,
    staleTime: DEFAULT_STALE,
  });
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: queryKeys.collections.detail(id),
    queryFn: () => collectionService.getCollectionById(id),
    select: (data) => data.data,
    enabled: !!id,
    staleTime: DEFAULT_STALE,
  });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCollectionPayload) => collectionService.createCollection(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.collections.all }),
    onError: (err) => handleApiError(err, 'Failed to create collection'),
  });
}

export function useUpdateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollectionPayload }) =>
      collectionService.updateCollection(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.collections.all }),
    onError: (err) => handleApiError(err, 'Failed to update collection'),
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => collectionService.deleteCollection(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.collections.all }),
    onError: (err) => handleApiError(err, 'Failed to delete collection'),
  });
}

// ── Contributions ──────────────────────────────────────────────────────────────

export function useContributions(collectionId: string, page = 1) {
  return useQuery({
    queryKey: queryKeys.contributions.byCollection(collectionId, page),
    queryFn: () => contributionService.getCollectionContributions(collectionId, page),
    enabled: !!collectionId,
    staleTime: DEFAULT_STALE,
  });
}

export function useAllContributions(page = 1) {
  return useQuery({
    queryKey: queryKeys.contributions.all(page),
    queryFn: () => contributionService.getAllContributions(page),
    staleTime: DEFAULT_STALE,
  });
}

export function useRevenueSummary() {
  return useQuery({
    queryKey: queryKeys.contributions.revenue,
    queryFn: () => contributionService.getRevenueSummary(),
    staleTime: LONG_STALE,
  });
}

export function useInitializeContribution() {
  return useMutation({
    mutationFn: (payload: InitializeContributionPayload) =>
      contributionService.initializeContribution(payload),
    onError: (err) => handleApiError(err, 'Payment initialization failed'),
  });
}

// ── Withdrawals ────────────────────────────────────────────────────────────────

export function useBalance() {
  return useQuery({
    queryKey: queryKeys.withdrawals.balance,
    queryFn: () => withdrawalService.getBalance(),
    select: (data) => data.data,
    staleTime: DEFAULT_STALE,
  });
}

export function useMyWithdrawals(page = 1) {
  return useQuery({
    queryKey: queryKeys.withdrawals.my(page),
    queryFn: () => withdrawalService.getMyWithdrawals(page),
    select: (data) => data.data,
    staleTime: DEFAULT_STALE,
  });
}

export function useBanks() {
  return useQuery({
    queryKey: queryKeys.banks,
    queryFn: () => withdrawalService.getBanks(),
    select: (data) => data.data,
    staleTime: LONG_STALE,
  });
}

export function useAdminWithdrawals(status?: string, page = 1) {
  return useQuery({
    queryKey: queryKeys.withdrawals.admin(status, page),
    queryFn: () => withdrawalService.adminGetAll(status, page),
    select: (data) => data.data,
    staleTime: DEFAULT_STALE,
  });
}

export function useRequestWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => withdrawalService.requestWithdrawal(amount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.withdrawals.balance });
      qc.invalidateQueries({ queryKey: [queryKeys.withdrawals.all] });
    },
    onError: (err) => handleApiError(err, 'Withdrawal request failed'),
  });
}

export function useSaveBankDetails() {
  return useMutation({
    mutationFn: (details: SaveBankDetailsPayload) => withdrawalService.saveBankDetails(details),
    onError: (err) => handleApiError(err, 'Failed to save bank details'),
  });
}

export function useAdminApproveWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => withdrawalService.adminApprove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKeys.withdrawals.all] }),
    onError: (err) => handleApiError(err, 'Failed to approve withdrawal'),
  });
}

export function useAdminRejectWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      withdrawalService.adminReject(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKeys.withdrawals.all] }),
    onError: (err) => handleApiError(err, 'Failed to reject withdrawal'),
  });
}

export function useAdminCompleteWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => withdrawalService.adminComplete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKeys.withdrawals.all] }),
    onError: (err) => handleApiError(err, 'Failed to complete withdrawal'),
  });
}

// ── Auth ───────────────────────────────────────────────────────────────────────

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginPayload) => authService.login(credentials),
    onError: (err) => handleApiError(err, 'Login failed'),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (userData: RegisterPayload) => authService.register(userData),
    onError: (err) => handleApiError(err, 'Registration failed'),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (otp: string) => authService.verifyOtp(otp),
    onError: (err) => handleApiError(err, 'Verification failed'),
  });
}
