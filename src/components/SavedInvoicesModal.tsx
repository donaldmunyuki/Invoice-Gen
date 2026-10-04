import React from 'react';
import { X, Trash2, ArrowRight, Plus, FileText, Calendar } from 'lucide-react';
import { InvoiceData } from '../types/invoice';
import { formatCurrency } from '../utils/currencies';
import { calculateInvoiceTotals } from '../utils/calculations';

interface SavedInvoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedInvoices: InvoiceData[];
  onLoadInvoice: (invoice: InvoiceData) => void;
  onDeleteInvoice: (id: string) => void;
  onNewInvoice: () => void;
}

export const SavedInvoicesModal: React.FC<SavedInvoicesModalProps> = ({
  isOpen,
  onClose,
  savedInvoices,
  onLoadInvoice,
  onDeleteInvoice,
  onNewInvoice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Saved Invoices
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {savedInvoices.length} {savedInvoices.length === 1 ? 'invoice' : 'invoices'} stored locally
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {savedInvoices.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                No saved invoices yet
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 max-w-xs mx-auto">
                Click the "Save" button at the bottom of the invoice form to preserve your drafts.
              </p>
            </div>
          ) : (
            savedInvoices.map((inv) => {
              const totals = calculateInvoiceTotals(inv);
              return (
                <div
                  key={inv.id}
                  style={{ backgroundColor: '#262626' }}
                  className="group flex items-center justify-between gap-4 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition cursor-pointer"
                  onClick={() => {
                    onLoadInvoice(inv);
                    onClose();
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {inv.invoiceNumber || 'Untitled'}
                      </span>
                      <span className="text-xs text-neutral-400 dark:text-neutral-500">
                        · {inv.date || 'No date'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate mt-0.5">
                      To: {inv.toName || 'Unnamed client'}
                    </p>
                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 tabular-nums mt-1">
                      {formatCurrency(totals.total, inv.currency)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      style={{ backgroundColor: '#262626' }}
                      onClick={() => {
                        onLoadInvoice(inv);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-650 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteInvoice(inv.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                      title="Delete saved invoice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{ backgroundColor: '#262626' }}
          className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center"
        >
          <button
            type="button"
            onClick={() => {
              onNewInvoice();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Blank Invoice</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-750 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
