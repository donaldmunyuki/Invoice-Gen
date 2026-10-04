import { InvoiceData } from '../types/invoice';

export const createDefaultInvoice = (): InvoiceData => {
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 30);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const randomNum = Math.floor(1000 + Math.random() * 9000);

  return {
    id: `inv_${Date.now()}`,
    invoiceNumber: `INV-${randomNum}`,
    date: formatDate(today),
    dueDate: formatDate(dueDate),
    currency: 'ZAR',
    taxRate: 0,
    discountType: 'percentage',
    discountValue: 0,
    applyDiscountToDiscounted: true,
    companyName: '',
    companyLogo: '',
    companyDetails: '',
    fromName: '',
    fromEmail: '',
    fromAddress: '',
    toName: '',
    toEmail: '',
    toAddress: '',
    items: [
      {
        id: `item_${Date.now()}_1`,
        description: '',
        quantity: 1,
        price: 0,
        currency: 'ZAR',
        discountType: 'percentage',
        discountValue: 0,
      },
    ],
    notes: '',
    invoiceFooter: 'Thank you for your business!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const sampleInvoice: InvoiceData = {
  id: 'inv_sample_01',
  invoiceNumber: 'INV-7651',
  date: '2026-10-03',
  dueDate: '2026-11-02',
  currency: 'ZAR',
  taxRate: 15,
  discountType: 'percentage',
  discountValue: 5,
  applyDiscountToDiscounted: true,
  companyName: 'Vertex Creative Labs (Pty) Ltd',
  companyLogo: '',
  companyDetails: 'VAT ID: 4920192847\nReg: 2024/094201/07\nBank: First National Bank (FNB)',
  fromName: 'Donald Munyuki',
  fromEmail: 'donaldmunyuki20@gmail.com',
  fromAddress: '15 Alice Lane, Sandton\nJohannesburg, 2196\nSouth Africa',
  toName: 'Acme Global Ventures Inc.',
  toEmail: 'billing@acmeglobal.io',
  toAddress: '100 Broadway, 14th Floor\nNew York, NY 10005\nUnited States',
  items: [
    {
      id: 'item_sample_1',
      description: 'Web Application Design System & Figma Component Library',
      quantity: 1,
      price: 36000,
      currency: 'ZAR',
      discountType: 'percentage',
      discountValue: 10,
    },
    {
      id: 'item_sample_2',
      description: 'Frontend Implementation (React, Tailwind CSS, TypeScript)',
      quantity: 40,
      price: 1250,
      currency: 'ZAR',
      discountType: 'percentage',
      discountValue: 0,
    },
    {
      id: 'item_sample_3',
      description: 'Cloud Infrastructure Setup & CI/CD Deployment Pipeline',
      quantity: 1,
      price: 18000,
      currency: 'ZAR',
      discountType: 'amount',
      discountValue: 3000,
    },
  ],
  notes: 'Payment is due within 30 days of issuance.\nBank: First National Bank (FNB)\nAccount: 62894102941\nBranch Code: 250655',
  invoiceFooter: 'Thank you for your business! We appreciate the opportunity to collaborate.',
  createdAt: '2026-10-03T10:00:00.000Z',
  updatedAt: '2026-10-03T10:00:00.000Z',
};
