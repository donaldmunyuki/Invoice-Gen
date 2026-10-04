import React from 'react';
import { Printer, Download, ArrowLeft, Check, Copy } from 'lucide-react';
import { InvoiceData } from '../types/invoice';
import { calculateItem, calculateInvoiceTotals } from '../utils/calculations';
import { formatCurrency, getCurrencySymbol } from '../utils/currencies';

interface InvoicePreviewProps {
  invoice: InvoiceData;
  onBackToEdit: () => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  onBackToEdit,
}) => {
  const [copied, setCopied] = React.useState(false);
  const totals = calculateInvoiceTotals(invoice);
  const currencySymbol = getCurrencySymbol(invoice.currency);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(invoice, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${invoice.invoiceNumber || 'invoice'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    const text = `Invoice #${invoice.invoiceNumber}\nDate: ${invoice.date}\nDue Date: ${invoice.dueDate}\nFrom: ${invoice.fromName || invoice.companyName}\nTo: ${invoice.toName}\nTotal Due: ${formatCurrency(totals.total, invoice.currency)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-20">
      {/* Action Toolbar (hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 sm:px-5 shadow-xs">
        <button
          type="button"
          onClick={onBackToEdit}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Edit</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition"
            title="Copy invoice summary to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition"
            title="Export as JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white/90 rounded-lg shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Invoice Printable Sheet */}
      <div
        id="printable-invoice"
        className="invoice-card bg-white text-neutral-900 rounded-2xl border border-neutral-200 shadow-sm p-8 sm:p-12 space-y-10"
      >
        {/* Header Block: Logo & Company vs Invoice Info */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-neutral-100 pb-8">
          <div className="space-y-3 max-w-sm">
            {invoice.companyLogo ? (
              <img
                src={invoice.companyLogo}
                alt="Company Logo"
                className="h-14 max-w-50 object-contain"
              />
            ) : invoice.companyName ? (
              <div className="h-12 w-12 rounded-xl bg-neutral-900 text-white font-bold text-xl flex items-center justify-center">
                {invoice.companyName.charAt(0).toUpperCase()}
              </div>
            ) : null}

            <div>
              <h2 className="text-xl font-bold text-neutral-950">
                {invoice.companyName || 'Your Company Name'}
              </h2>
              {invoice.companyDetails && (
                <p className="text-xs text-neutral-500 whitespace-pre-line mt-1">
                  {invoice.companyDetails}
                </p>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
              INVOICE
            </h1>
            <p className="text-sm font-semibold text-neutral-700 tabular-nums">
              #{invoice.invoiceNumber || 'INV-0001'}
            </p>

            <div className="pt-3 space-y-1 text-xs text-neutral-600">
              <p>
                <span className="text-neutral-400">Date Issued: </span>
                <span className="font-medium text-neutral-800 tabular-nums">
                  {invoice.date || '—'}
                </span>
              </p>
              <p>
                <span className="text-neutral-400">Payment Due: </span>
                <span className="font-semibold text-neutral-900 tabular-nums">
                  {invoice.dueDate || '—'}
                </span>
              </p>
              <p>
                <span className="text-neutral-400">Currency: </span>
                <span className="font-medium text-neutral-800">
                  {invoice.currency}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Addresses Row: From & To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
          {/* Billed From */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
              From
            </span>
            <p className="font-semibold text-neutral-900">
              {invoice.fromName || invoice.companyName || 'Sender Name'}
            </p>
            {invoice.fromEmail && (
              <p className="text-xs text-neutral-600">{invoice.fromEmail}</p>
            )}
            {invoice.fromAddress && (
              <p className="text-xs text-neutral-600 whitespace-pre-line leading-relaxed">
                {invoice.fromAddress}
              </p>
            )}
          </div>

          {/* Billed To */}
          <div className="space-y-1.5 sm:text-right">
            <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
              Billed To
            </span>
            <p className="font-semibold text-neutral-900">
              {invoice.toName || 'Client Name / Organization'}
            </p>
            {invoice.toEmail && (
              <p className="text-xs text-neutral-600">{invoice.toEmail}</p>
            )}
            {invoice.toAddress && (
              <p className="text-xs text-neutral-600 whitespace-pre-line leading-relaxed">
                {invoice.toAddress}
              </p>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-900 text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                <th scope="col" className="py-3 pr-4 pl-0">
                  Description
                </th>
                <th scope="col" className="py-3 px-3 text-center">
                  Qty
                </th>
                <th scope="col" className="py-3 px-3 text-right">
                  Rate
                </th>
                <th scope="col" className="py-3 px-3 text-right">
                  Discount
                </th>
                <th scope="col" className="py-3 pl-3 pr-0 text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-150">
              {invoice.items.map((item, idx) => {
                const itemCalc = calculateItem(item);
                const itemCurr = item.currency || invoice.currency;

                return (
                  <tr key={item.id || idx} className="hover:bg-neutral-50/50 transition">
                    <td className="py-3.5 pr-4 pl-0 font-medium text-neutral-900">
                      {item.description || `Item #${idx + 1}`}
                    </td>
                    <td className="py-3.5 px-3 text-center text-neutral-700 tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-3 text-right text-neutral-700 tabular-nums">
                      {formatCurrency(item.price, itemCurr)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-neutral-600 tabular-nums text-xs">
                      {item.discountValue > 0 ? (
                        item.discountType === 'percentage' ? (
                          `-${item.discountValue}% (${formatCurrency(itemCalc.discountAmount, itemCurr)})`
                        ) : (
                          `-${formatCurrency(itemCalc.discountAmount, itemCurr)}`
                        )
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3.5 pl-3 pr-0 text-right font-semibold text-neutral-900 tabular-nums">
                      {formatCurrency(itemCalc.netAmount, itemCurr)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 border-t border-neutral-200">
          {/* Notes & Bank Details on Left */}
          <div className="w-full sm:max-w-sm space-y-4">
            {invoice.notes && (
              <div>
                <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase block mb-1">
                  Notes & Terms
                </span>
                <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-200/60">
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>

          {/* Totals Table on Right */}
          <div className="w-full sm:max-w-xs space-y-2 text-right">
            <div className="flex justify-between text-xs sm:text-sm text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-medium text-neutral-900 tabular-nums">
                {formatCurrency(totals.subtotal, invoice.currency)}
              </span>
            </div>

            {totals.invoiceDiscountAmount > 0 && (
              <div className="flex justify-between text-xs sm:text-sm text-amber-700">
                <span>
                  Invoice Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'}):
                </span>
                <span className="font-medium tabular-nums">
                  -{formatCurrency(totals.invoiceDiscountAmount, invoice.currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-xs sm:text-sm text-neutral-600">
              <span>Tax ({invoice.taxRate}%):</span>
              <span className="font-medium text-neutral-900 tabular-nums">
                {formatCurrency(totals.taxAmount, invoice.currency)}
              </span>
            </div>

            <div className="border-t-2 border-neutral-900 pt-3 flex justify-between items-baseline">
              <span className="text-base font-bold text-neutral-900">
                Total Due:
              </span>
              <span className="text-2xl font-black text-neutral-950 tabular-nums tracking-tight">
                {formatCurrency(totals.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Footer */}
        {invoice.invoiceFooter && (
          <div className="pt-8 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-500 font-medium italic">
              {invoice.invoiceFooter}
            </p>
          </div>
        )}
      </div>

      {/* Page Footer */}
      <footer className="no-print text-center text-xs text-neutral-500 dark:text-neutral-400 pt-8 pb-4">
        © 2026 INVOICE-GEN. All rights reserved.
      </footer>
    </div>
  );
};
