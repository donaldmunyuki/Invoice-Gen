export type DiscountType = 'percentage' | 'amount';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  currency: string;
  discountType: DiscountType;
  discountValue: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  currency: string;
  taxRate: number;
  discountType: DiscountType;
  discountValue: number;
  applyDiscountToDiscounted: boolean;
  
  // Company Information
  companyName: string;
  companyLogo?: string; // base64 or url
  companyDetails: string;
  
  // From Information
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  
  // To Information
  toName: string;
  toEmail: string;
  toAddress: string;
  
  // Items
  items: InvoiceItem[];
  
  // Bottom Notes
  notes: string;
  invoiceFooter: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
}
