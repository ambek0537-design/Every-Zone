import React, { useState } from 'react';
import { RefreshCw, PackageOpen, Plus, ClipboardList } from 'lucide-react';

interface InventoryLog {
  id: string;
  productId: string;
  quantityBefore: number;
  quantityAfter: number;
  changeReason: string;
  createdAt: string;
}

interface Product {
  id: string;
  title: string;
  sku: string;
  quantity: number;
  status: string;
}

interface InventoryManagerProps {
  products: Product[];
  history: InventoryLog[];
  onReplenish: (productId: string, newQty: number, reason: string) => Promise<void>;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  products,
  history,
  onReplenish
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [replenishQty, setReplenishQty] = useState<number>(10);
  const [changeReason, setChangeReason] = useState<string>('Merchant replenishment stock');
  const [isUpdating, setIsUpdating] = useState(false);

  const activeProduct = products.find(p => p.id === selectedProductId) || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || isUpdating) return;

    setIsUpdating(true);
    try {
      const finalQty = (activeProduct?.quantity || 0) + Number(replenishQty);
      await onReplenish(selectedProductId, finalQty, changeReason);
      setReplenishQty(10);
      setSelectedProductId('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div id="inventory-manager" className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Stocks replenishment form */}
      <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl space-y-4 lg:col-span-1">
        <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-1.5 border-b border-neutral-900 pb-2">
          <PackageOpen className="w-4 h-4 text-amber-500" />
          <span>Replenish Stock</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Product */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider font-mono">Select Product</label>
            <select
              id="inv-select-product"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              required
            >
              <option value="">-- Choose a Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (SKU: {p.sku}) [Currently: {p.quantity}]
                </option>
              ))}
            </select>
          </div>

          {activeProduct && (
            <>
              {/* Added units input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider font-mono">Units to Add</label>
                <div className="relative">
                  <input
                    id="inv-qty-input"
                    type="number"
                    value={replenishQty}
                    onChange={(e) => setReplenishQty(Math.max(1, Number(e.target.value)))}
                    placeholder="10"
                    min="1"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-stone-500 font-bold font-mono">
                    New Qty: {(activeProduct.quantity || 0) + Number(replenishQty)}
                  </span>
                </div>
              </div>

              {/* Adjust Reason */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider font-mono">Reason for Change</label>
                <input
                  id="inv-reason-input"
                  type="text"
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="e.g. Stock replenishment shipment"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <button
                id="inv-submit-btn"
                type="submit"
                disabled={isUpdating}
                className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md shadow-amber-500/5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{isUpdating ? 'Updating Stock...' : 'Confirm Stock Replenish'}</span>
              </button>
            </>
          )}
        </form>
      </div>

      {/* Audit History Log */}
      <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl space-y-3 lg:col-span-2 flex flex-col">
        <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-1.5 border-b border-neutral-900 pb-2">
          <ClipboardList className="w-4 h-4 text-amber-500" />
          <span>Real-time Stock Inventory Logs</span>
        </h3>

        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-stone-500 italic text-xs">
            No stock adjustments recorded for your products yet.
          </div>
        ) : (
          <div className="flex-1 max-h-[300px] overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {history.map((log) => {
              const matchedProduct = products.find(p => p.id === log.productId);
              const isIncrease = log.quantityAfter > log.quantityBefore;
              return (
                <div
                  key={log.id}
                  id={`inv-log-${log.id}`}
                  className="bg-neutral-950 border border-neutral-850 p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-stone-200 line-clamp-1">{matchedProduct ? matchedProduct.title : 'Deleted Product'}</p>
                    <p className="text-[10px] text-stone-400 font-mono italic">"{log.changeReason}"</p>
                    <p className="text-[9px] text-stone-500 font-mono">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="text-right space-y-0.5 flex-shrink-0">
                    <div className="flex items-center justify-end gap-1 font-mono">
                      <span className="text-stone-500">{log.quantityBefore}</span>
                      <span className="text-stone-600">→</span>
                      <span className={`font-bold ${isIncrease ? 'text-emerald-400' : 'text-red-400'}`}>
                        {log.quantityAfter}
                      </span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isIncrease ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'bg-red-500/10 text-red-400 border border-red-500/10'
                    }`}>
                      {isIncrease ? `+${log.quantityAfter - log.quantityBefore} Stock` : `-${log.quantityBefore - log.quantityAfter} Stock`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
