export type AccountType = 'SAVINGS' | 'CHECKING';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

export interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  status: AccountStatus;
  type: AccountType;
  customerId: number;
}

export interface CreateAccountRequest {
  type: AccountType;
}

export interface AccountBalance {
  accountNumber: string;
  balance: number;
}

export interface DepositRequest {
  amount: number;
}

export interface RecipientAccount {
  accountNumber: string;
  type: AccountType;
  ownerName: string;
}

export interface AccountSummaryReport {
  type: AccountType;
  status: AccountStatus;
  total: number;
  totalBalance: number;
}

export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  SAVINGS: 'Ahorros',
  CHECKING: 'Corriente',
};

export const ACCOUNT_STATUS_LABEL: Record<AccountStatus, string> = {
  ACTIVE: 'Activa',
  SUSPENDED: 'Suspendida',
  CLOSED: 'Cerrada',
};
