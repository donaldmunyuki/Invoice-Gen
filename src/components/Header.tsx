import React from 'react';
import { FolderOpen, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'edit' | 'preview';
  onTabChange: (tab: 'edit' | 'preview') => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onLoadSample: () => void;
  onNewInvoice: () => void;
  onOpenSavedModal: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onLoadSample,
  onNewInvoice,
  onOpenSavedModal,
  savedCount,
}) => {
  return (
    <header className="no-print pt-6 pb-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {/* Top Title and Actions Row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2.5">
            Invoice Generator
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 hidden sm:block">
            Create, calculate, customize, and export professional invoices
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Action: Load Sample */}
          <button
            type="button"
            onClick={onLoadSample}
            title="Load sample invoice data"
            className="hidden sm:inline-flex items-center px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors shadow-xs"
          >
            <span>Sample Data</span>
          </button>

          {/* Quick Action: New Invoice */}
          <button
            type="button"
            onClick={onNewInvoice}
            title="Create blank new invoice"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New</span>
          </button>

          {/* Saved Invoices */}
          <button
            type="button"
            onClick={onOpenSavedModal}
            title="View saved invoices"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors shadow-xs"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Row: Centered Segmented Control */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl border border-neutral-200/80 dark:border-neutral-700/60 max-w-md w-full shadow-inner">
          <button
            type="button"
            onClick={() => onTabChange('edit')}
            className={`flex-1 py-2 px-6 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Edit Invoice
          </button>
          <button
            type="button"
            onClick={() => onTabChange('preview')}
            className={`flex-1 py-2 px-6 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>
      </div>
    </header>
  );
};
