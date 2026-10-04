import { InvoiceData, InvoiceItem } from '../types/invoice';

export interface ItemCalculation {
  baseAmount: number;
  discountAmount: number;
  netAmount: number;
  formulaText: string;
}

export interface InvoiceTotals {
  rawSubtotal: number;
  itemDiscountsTotal: number;
  subtotal: number;
  invoiceDiscountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}

export const calculateItem = (item: InvoiceItem): ItemCalculation => {
  const qty = Number(item.quantity) || 0;
  const price = Number(item.price) || 0;
  const discountVal = Number(item.discountValue) || 0;

  const baseAmount = qty * price;
  let discountAmount = 0;

  if (discountVal > 0) {
    if (item.discountType === 'percentage') {
      discountAmount = (baseAmount * discountVal) / 100;
    } else {
      discountAmount = Math.min(baseAmount, discountVal);
    }
  }

  const netAmount = Math.max(0, baseAmount - discountAmount);

  return {
    baseAmount,
    discountAmount,
    netAmount,
    formulaText: `${qty} × $${price.toFixed(2)} = $${baseAmount.toFixed(2)}`,
  };
};

export const calculateInvoiceTotals = (invoice: InvoiceData): InvoiceTotals => {
  let rawSubtotal = 0;
  let itemDiscountsTotal = 0;
  let totalItemNet = 0;
  let nonDiscountedItemsNet = 0;

  invoice.items.forEach((item) => {
    const itemCalc = calculateItem(item);
    rawSubtotal += itemCalc.baseAmount;
    itemDiscountsTotal += itemCalc.discountAmount;
    totalItemNet += itemCalc.netAmount;

    if (!item.discountValue || item.discountValue <= 0) {
      nonDiscountedItemsNet += itemCalc.netAmount;
    }
  });

  // Calculate invoice-level discount
  let invoiceDiscountAmount = 0;
  const invDiscountVal = Number(invoice.discountValue) || 0;

  if (invDiscountVal > 0) {
    const baseForInvoiceDiscount = invoice.applyDiscountToDiscounted
      ? totalItemNet
      : nonDiscountedItemsNet;

    if (invoice.discountType === 'percentage') {
      invoiceDiscountAmount = (baseForInvoiceDiscount * invDiscountVal) / 100;
    } else {
      invoiceDiscountAmount = Math.min(baseForInvoiceDiscount, invDiscountVal);
    }
  }

  const taxableAmount = Math.max(0, totalItemNet - invoiceDiscountAmount);
  const taxRate = Number(invoice.taxRate) || 0;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  return {
    rawSubtotal,
    itemDiscountsTotal,
    subtotal: totalItemNet,
    invoiceDiscountAmount,
    taxableAmount,
    taxAmount,
    total,
  };
};
