export interface ApiResponse<T> {
  message: string
  data: T
  access_code?: string
  authorization_url?: string
}

export interface PaginatedResponse<T> {
  count: number
  data: T[]
}

export interface User {
  _id: string
  name: string
  email: string
  role: "user" | "admin"
  emailVerified: boolean
}

export interface UploadedImage {
  url: string
  publicId: string
  isPrimary?: boolean
}

export interface Collection {
  _id: string
  type: "fundraiser" | "occasion" | "tips"
  title: string
  category: string
  description: string
  fullStory: string
  goal: number
  raised: number
  supporters: number
  daysLeft: number
  status: "active" | "completed" | "pending" | "rejected"
  images: UploadedImage[]
  primaryImage?: UploadedImage
  creator: { name: string; email: string; _id: string }
  location: string
  createdAt: string
  eventDate?: string
  receiverName?: string
  fundUsage?: { description: string; amount: number }[]
  suggestedAmounts?: number[]
  featured?: boolean
  rejectionReason?: string
}

export interface Contribution {
  _id: string
  collectionId: string
  collectionTitle: string
  supporterName?: string
  supporterEmail?: string
  amount: number
  message?: string
  isAnonymous?: boolean
  status: string
  createdAt: string
}

export interface Bank {
  name: string
  code: string
}

export interface BankDetails {
  accountNumber: string
  bankCode: string
  accountName: string
  bankName: string
}

export interface Balance {
  totalGross: number
  totalFees: number
  totalEarned: number
  totalPaid: number
  pendingAmount: number
  available: number
}

export interface Withdrawal {
  _id: string
  creator?: { _id: string; name: string; email: string }
  amount: number
  bankDetails: BankDetails
  status: "pending" | "approved" | "processing" | "completed" | "rejected"
  createdAt: string
  adminNote?: string
}

export interface RevenueSummary {
  totalGrossDonated: number
  totalPlatformRevenue: number
  totalContributions: number
}

export interface DashboardStats {
  totalCollections: number
  activeCollections: number
  totalRaised: number
  totalSupporters: number
  averageDonation: number
  completionRate: number
}

export interface PlatformStats {
  totalCollections: number
  pendingCollections: number
  approvedCollections: number
  rejectedCollections: number
  totalRaised: number
  platformRevenue: number
  totalContributions: number
}

// ── Payloads ───────────────────────────────────────────────────────────────────

export interface CreateCollectionPayload {
  type: "fundraiser" | "occasion" | "tips"
  title: string
  category: string
  description: string
  fullStory: string
  goal?: number
  images: UploadedImage[]
  eventDate?: string
  receiverName?: string
  fundUsage?: { description: string; amount: number }[]
  suggestedAmounts?: number[]
}

export interface UpdateCollectionPayload {
  title?: string
  category?: string
  description?: string
  fullStory?: string
  goal?: number
  images?: UploadedImage[]
  eventDate?: string
  receiverName?: string
  fundUsage?: { description: string; amount: number }[]
  suggestedAmounts?: number[]
  status?: string
  rejectionReason?: string
}

export interface InitializeContributionPayload {
  collectionId: string
  amount: number
  message?: string
  isAnonymous?: boolean
  supporterName?: string
  supporterEmail?: string
  currency?: string
}

export interface SaveBankDetailsPayload {
  accountNumber: string
  bankCode: string
  accountName: string
  bankName: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

export interface DashboardBalance {
  totalGross: number
  totalFees: number
  totalEarned: number
  totalWithdrawn: number
  pendingWithdrawals: number
  available: number
}

export interface DashboardSummary {
  stats: DashboardStats
  balance: DashboardBalance
  walletBalance: { balance: number; currency: string }
  recentCollections: Collection[]
  recentContributions: {
    supporterName?: string
    amount: number
    platformFee: number
    netAmount: number
    collectionTitle: string
    createdAt: string
    isAnonymous?: boolean
  }[]
}

export interface WalletData {
  _id: string
  user: string
  balance: number
  currency: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WalletTransaction {
  _id: string
  wallet: string
  user: string
  type: 'credit' | 'debit'
  reference: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  description: string
  category: 'funding' | 'contribution' | 'withdrawal' | 'refund' | 'adjustment'
  status: string
  createdAt: string
}

export interface Transaction {
  _id: string
  type: 'contribution' | 'withdrawal'
  description: string
  amount: number
  fee: number
  netAmount: number
  status: string
  date: string
  meta?: Record<string, unknown>
}

export interface EarningsBreakdown {
  _id: { collection: string; collectionTitle: string } | null
  totalGross: number
  totalFees: number
  totalNet: number
  count: number
}
