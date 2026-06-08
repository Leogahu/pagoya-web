export interface Customer {
  id: number;
  fullName: string;
  dni: string;
  phone: string | null;
  userId: number;
}

export interface UpdateCustomerRequest {
  fullName: string;
  phone?: string;
}
