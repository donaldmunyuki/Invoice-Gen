import React, { useRef } from 'react';
import { Plus, Trash2, Upload, X, Check, Save } from 'lucide-react';
import { InvoiceData, InvoiceItem, DiscountType } from '../types/invoice';
import { CURRENCIES, formatCurrency, getCurrencySymbol } from '../utils/currencies';
import { calculateItem, calculateInvoiceTotals } from '../utils/calculations';

interface InvoiceEditorProps {
  invoice: InvoiceData;
  onChange: (updated: InvoiceData) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({
  invoice,
  onChange,
  onSave,
  isSaving,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update top-level invoice field
  const updateField = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    onChange({
      ...invoice,
      [key]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  // Add Item
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      description: '',
      quantity: 1,
      price: 0,
      currency: invoice.currency,
      discountType: 'percentage',
      discountValue: 0,
    };
    updateField('items', [...invoice.items, newItem]);
  };

  // Remove Item
  const handleRemoveItem = (id: string) => {
    if (invoice.items.length <= 1) {
      // Keep at least one blank item
      updateField('items', [
        {
          id: `item_${Date.now()}`,
          description: '',
          quantity: 1,
          price: 0,
          currency: invoice.currency,
          discountType: 'percentage',
          discountValue: 0,
        },
      ]);
      return;
    }
    updateField(
      'items',
      invoice.items.filter((item) => item.id !== id)
    );
  };

  // Update Item field
  const updateItemField = <K extends keyof InvoiceItem>(
    id: string,
    field: K,
    value: InvoiceItem[K]
  ) => {
    const updated = invoice.items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateField('items', updated);
  };

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        updateField('companyLogo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    updateField('companyLogo', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Invoice calculations
  const totals = calculateInvoiceTotals(invoice);
  const activeCurrencySymbol = getCurrencySymbol(invoice.currency);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-16">
      {/* Main Form Card Container */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs p-6 sm:p-8 space-y-8 relative">
        {/* Top Two-Column Grid: Invoice Details & Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Invoice Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Invoice Details
            </h2>

            {/* Invoice Number */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoice.invoiceNumber}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
                placeholder="INV-7651"
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={invoice.date}
                onChange={(e) => updateField('date', e.target.value)}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition"
              />
            </div>

            {/* Invoice Currency */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Invoice Currency
              </label>
              <select
                value={invoice.currency}
                onChange={(e) => {
                  const newCurrency = e.target.value;
                  // Optionally sync items currency
                  const updatedItems = invoice.items.map((it) => ({
                    ...it,
                    currency: newCurrency,
                  }));
                  onChange({
                    ...invoice,
                    currency: newCurrency,
                    items: updatedItems,
                  });
                }}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tax Rate (%) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={invoice.taxRate}
                onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition tabular-nums"
              />
            </div>

            {/* Invoice Discount */}
            <div className="space-y-2 pt-1">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Invoice Discount
              </label>

              {/* Radio Selector */}
              <div className="flex items-center gap-6 text-sm text-neutral-700 dark:text-neutral-300">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="invoiceDiscountType"
                    checked={invoice.discountType === 'percentage'}
                    onChange={() => updateField('discountType', 'percentage')}
                    className="accent-neutral-900 dark:accent-neutral-100 w-4 h-4 cursor-pointer"
                  />
                  <span>Percentage (%)</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="invoiceDiscountType"
                    checked={invoice.discountType === 'amount'}
                    onChange={() => updateField('discountType', 'amount')}
                    className="accent-neutral-900 dark:accent-neutral-100 w-4 h-4 cursor-pointer"
                  />
                  <span>Amount</span>
                </label>
              </div>

              {/* Discount Input */}
              <input
                type="number"
                min="0"
                step="any"
                value={invoice.discountValue}
                onChange={(e) => updateField('discountValue', parseFloat(e.target.value) || 0)}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition tabular-nums"
              />

              {/* Apply to already discounted items checkbox */}
              <div className="pt-1">
                <label className="inline-flex items-center gap-2.5 text-sm text-neutral-800 dark:text-neutral-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={invoice.applyDiscountToDiscounted}
                    onChange={(e) => updateField('applyDiscountToDiscounted', e.target.checked)}
                    className="w-4 h-4 rounded-xs border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
                  />
                  <span>Apply invoice discount to already discounted items</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Company Information & From */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Company Information
            </h2>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={invoice.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder=""
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition"
              />
            </div>

            {/* Company Logo */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Company Logo
              </label>
              <div className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 text-sm">
                {invoice.companyLogo ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={invoice.companyLogo}
                        alt="Company Logo Preview"
                        className="h-10 w-10 object-contain rounded-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-0.5"
                      />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                        Logo attached
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-sm hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="logo-upload-input"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="sr-only"
                    />
                    <label
                      htmlFor="logo-upload-input"
                      className="cursor-pointer px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-650 rounded-sm border border-neutral-300 dark:border-neutral-600 transition select-none"
                    >
                      Choose file
                    </label>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      No file chosen
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Company Details */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Company Details
              </label>
              <textarea
                rows={3}
                value={invoice.companyDetails}
                onChange={(e) => updateField('companyDetails', e.target.value)}
                placeholder="Registration number, VAT ID, etc."
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition resize-y"
              />
            </div>

            {/* From Sub-section */}
            <div className="pt-2 space-y-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                From
              </h3>

              {/* From Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={invoice.fromName}
                  onChange={(e) => updateField('fromName', e.target.value)}
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition"
                />
              </div>

              {/* From Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={invoice.fromEmail}
                  onChange={(e) => updateField('fromEmail', e.target.value)}
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition"
                />
              </div>

              {/* From Address */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Address
                </label>
                <textarea
                  rows={3}
                  value={invoice.fromAddress}
                  onChange={(e) => updateField('fromAddress', e.target.value)}
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition resize-y"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: To */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            To
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* To Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={invoice.toName}
                onChange={(e) => updateField('toName', e.target.value)}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition"
              />
            </div>

            {/* To Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={invoice.toEmail}
                onChange={(e) => updateField('toEmail', e.target.value)}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition"
              />
            </div>
          </div>

          {/* To Address */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Address
            </label>
            <textarea
              rows={3}
              value={invoice.toAddress}
              onChange={(e) => updateField('toAddress', e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition resize-y"
            />
          </div>
        </div>

        {/* Section: Items */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Items
          </h2>

          {/* Item Cards List */}
          <div className="space-y-4">
            {invoice.items.map((item, index) => {
              const itemCalc = calculateItem(item);
              const itemSymbol = getCurrencySymbol(item.currency || invoice.currency);

              return (
                <div
                  key={item.id}
                  style={{ backgroundColor: '#262626' }}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 space-y-4 transition"
                >
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItemField(item.id, 'description', e.target.value)}
                      placeholder=""
                      className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition"
                    />
                  </div>

                  {/* Quantity, Price, Currency, Delete Row */}
                  <div className="grid grid-cols-12 gap-3 items-end">
                    {/* Quantity */}
                    <div className="col-span-3 sm:col-span-3">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItemField(item.id, 'quantity', parseFloat(e.target.value) || 0)
                        }
                        className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition tabular-nums"
                      />
                    </div>

                    {/* Price */}
                    <div className="col-span-4 sm:col-span-4">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Price
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.price}
                        onChange={(e) =>
                          updateItemField(item.id, 'price', parseFloat(e.target.value) || 0)
                        }
                        className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition tabular-nums"
                      />
                    </div>

                    {/* Currency */}
                    <div className="col-span-4 sm:col-span-4">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Currency
                      </label>
                      <select
                        value={item.currency || invoice.currency}
                        onChange={(e) => updateItemField(item.id, 'currency', e.target.value)}
                        className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition cursor-pointer"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Delete Icon */}
                    <div className="col-span-1 sm:col-span-1 flex justify-center pb-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Delete item"
                        className="p-1.5 text-neutral-400 hover:text-rose-600 dark:text-neutral-500 dark:hover:text-rose-400 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Item Discount */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Item Discount
                    </label>

                    {/* Radio */}
                    <div className="flex items-center gap-6 text-sm text-neutral-700 dark:text-neutral-300">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`itemDiscountType_${item.id}`}
                          checked={item.discountType === 'percentage'}
                          onChange={() => updateItemField(item.id, 'discountType', 'percentage')}
                          className="accent-neutral-900 dark:accent-neutral-100 w-4 h-4 cursor-pointer"
                        />
                        <span>Percentage (%)</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`itemDiscountType_${item.id}`}
                          checked={item.discountType === 'amount'}
                          onChange={() => updateItemField(item.id, 'discountType', 'amount')}
                          className="accent-neutral-900 dark:accent-neutral-100 w-4 h-4 cursor-pointer"
                        />
                        <span>Amount</span>
                      </label>
                    </div>

                    {/* Discount Input */}
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.discountValue}
                      onChange={(e) =>
                        updateItemField(
                          item.id,
                          'discountValue',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition tabular-nums"
                    />
                  </div>

                  {/* Item Math Breakdown (Centered, exactly like screenshot 2) */}
                  <div className="pt-2 text-center select-none">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                      {item.quantity} × {formatCurrency(item.price, item.currency || invoice.currency)} = {formatCurrency(itemCalc.baseAmount, item.currency || invoice.currency)}
                      {itemCalc.discountAmount > 0 && (
                        <span className="text-amber-600 dark:text-amber-400 ml-1">
                          (-{formatCurrency(itemCalc.discountAmount, item.currency || invoice.currency)})
                        </span>
                      )}
                    </p>
                    <p className="text-base font-bold text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
                      {formatCurrency(itemCalc.netAmount, item.currency || invoice.currency)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Item Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-750 transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>

          {/* Totals Summary (Aligned to Right, Screenshot 2 & 3) */}
          <div className="flex justify-end pt-4 pb-2">
            <div className="w-full max-w-xs space-y-2 text-right">
              <div className="flex justify-between items-center text-sm text-neutral-700 dark:text-neutral-300">
                <span className="font-normal">Subtotal:</span>
                <span className="tabular-nums font-medium">
                  {formatCurrency(totals.subtotal, invoice.currency)}
                </span>
              </div>

              {totals.invoiceDiscountAmount > 0 && (
                <div className="flex justify-between items-center text-sm text-amber-600 dark:text-amber-400">
                  <span>
                    Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'fixed'}):
                  </span>
                  <span className="tabular-nums font-medium">
                    -{formatCurrency(totals.invoiceDiscountAmount, invoice.currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-neutral-700 dark:text-neutral-300">
                <span>Tax ({invoice.taxRate}%):</span>
                <span className="tabular-nums font-medium">
                  {formatCurrency(totals.taxAmount, invoice.currency)}
                </span>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2 flex justify-between items-center">
                <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Total:
                </span>
                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {formatCurrency(totals.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section (Screenshot 3) */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Notes
            </label>
            <textarea
              rows={3}
              value={invoice.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Payment terms, bank details, etc."
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition resize-y"
            />
          </div>

          {/* Invoice Footer Section */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Invoice Footer
            </label>
            <textarea
              rows={3}
              value={invoice.invoiceFooter}
              onChange={(e) => updateField('invoiceFooter', e.target.value)}
              placeholder="Thank you."
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition resize-y"
            />
          </div>
        </div>

        {/* Subtle Save Button in bottom right corner (Screenshot 2 & 3) */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition shadow-xs disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Page Footer (Screenshot 3) */}
      <footer className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-8 pb-4">
        © 2026 INVOICE-GEN. All rights reserved.
      </footer>
    </div>
  );
};
