export type TransferType = 'INTERNAL' | 'EXTERNAL';
export type TransferStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type Currency = 'PEN' | 'USD' | 'EUR' | 'GBP';

export interface TransferRequest {
  sourceAccountNumber: string;
  type: TransferType;
  amount: number;
  currency: Currency;
  targetAccountNumber?: string;
  externalBankName?: string;
  externalAccountNumber?: string;
  externalBeneficiaryName?: string;
}

export interface Transfer {
  id: number;
  type: TransferType;
  sourceAccountNumber: string;
  targetAccountNumber: string | null;
  externalBankName: string | null;
  externalAccountNumber: string | null;
  externalBeneficiaryName: string | null;
  amount: number;
  currency: Currency;
  exchangeRate: number | null;
  status: TransferStatus;
  createdAt: string;
}

export interface TransferByCurrencyReport {
  currency: Currency;
  totalTransfers: number;
  totalAmount: number;
}

export interface TransferByDayReport {
  day: string;
  totalTransfers: number;
  totalAmount: number;
}

export interface TransferByStatusReport {
  status: TransferStatus;
  total: number;
}

export const CURRENCIES: Currency[] = ['PEN', 'USD', 'EUR', 'GBP'];

export const TRANSFER_STATUS_LABEL: Record<TransferStatus, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completada',
  FAILED: 'Fallida',
};

export const TRANSFER_TYPE_LABEL: Record<TransferType, string> = {
  INTERNAL: 'Interna',
  EXTERNAL: 'Externa',
};
