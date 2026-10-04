import React, { useState, useEffect } from 'react';
import { InvoiceData } from './types/invoice';
import { createDefaultInvoice, sampleInvoice } from './utils/sampleData';
import { Header } from './components/Header';
import { InvoiceEditor } from './components/InvoiceEditor';
import { InvoicePreview } from './components/InvoicePreview';
import { SavedInvoicesModal } from './components/SavedInvoicesModal';

const STORAGE_KEY_CURRENT = 'invoice_current_draft';
const STORAGE_KEY_SAVED = 'invoice_saved_list';
const STORAGE_KEY_THEME = 'invoice_theme_mode';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Active tab state: 'edit' | 'preview'
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Active Invoice state
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        // If parsed draft is untouched with previous default USD, switch to ZAR
        if (parsed.currency === 'USD' && !parsed.companyName && !parsed.toName && (!parsed.items || parsed.items.length <= 1 && !parsed.items[0]?.description)) {
          parsed.currency = 'ZAR';
          if (parsed.items?.[0]) parsed.items[0].currency = 'ZAR';
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return createDefaultInvoice();
  });

  // Saved Invoices list
  const [savedInvoices, setSavedInvoices] = useState<InvoiceData[]>(() => {
    try {
      const savedList = localStorage.getItem(STORAGE_KEY_SAVED);
      if (savedList) {
        return JSON.parse(savedList);
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Modal & feedback state
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDarkMode]);

  // Persist current working draft
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(invoice));
    } catch {
      // ignore storage errors
    }
  }, [invoice]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleInvoiceChange = (updated: InvoiceData) => {
    setInvoice(updated);
  };

  const handleSaveInvoice = () => {
    setIsSaving(true);
    const existingIndex = savedInvoices.findIndex((inv) => inv.id === invoice.id);
    let updatedList: InvoiceData[];
    if (existingIndex >= 0) {
      updatedList = [...savedInvoices];
      updatedList[existingIndex] = { ...invoice, updatedAt: new Date().toISOString() };
    } else {
      updatedList = [invoice, ...savedInvoices];
    }
    setSavedInvoices(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    showToast(`Invoice ${invoice.invoiceNumber || ''} saved!`);
    setTimeout(() => setIsSaving(false), 1200);
  };

  const handleLoadSample = () => {
    setInvoice({ ...sampleInvoice, id: `inv_${Date.now()}` });
    showToast('Sample invoice loaded!');
  };

  const handleNewInvoice = () => {
    const blank = createDefaultInvoice();
    setInvoice(blank);
    setActiveTab('edit');
    showToast('Started new blank invoice');
  };

  const handleLoadSavedInvoice = (selected: InvoiceData) => {
    setInvoice(selected);
    showToast(`Loaded ${selected.invoiceNumber || 'invoice'}`);
  };

  const handleDeleteSavedInvoice = (id: string) => {
    const filtered = savedInvoices.filter((item) => item.id !== id);
    setSavedInvoices(filtered);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(filtered));
    } catch {
      // ignore
    }
    showToast('Invoice removed from saved list');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Main App Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onLoadSample={handleLoadSample}
        onNewInvoice={handleNewInvoice}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        savedCount={savedInvoices.length}
      />

      {/* Viewport Content */}
      <main className="w-full">
        {activeTab === 'edit' ? (
          <InvoiceEditor
            invoice={invoice}
            onChange={handleInvoiceChange}
            onSave={handleSaveInvoice}
            isSaving={isSaving}
          />
        ) : (
          <InvoicePreview
            invoice={invoice}
            onBackToEdit={() => setActiveTab('edit')}
          />
        )}
      </main>

      {/* Saved Invoices Modal */}
      <SavedInvoicesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedInvoices={savedInvoices}
        onLoadInvoice={handleLoadSavedInvoice}
        onDeleteInvoice={handleDeleteSavedInvoice}
        onNewInvoice={handleNewInvoice}
      />
    </div>
  );
}
