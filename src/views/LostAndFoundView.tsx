import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, MapPin, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { mockLostItems } from '../data/mockData';
import { LostItem } from '../types';
import { fetchLostItems, claimLostItem } from '../services/api';

export const LostAndFoundView: React.FC = () => {
  const [items, setItems] = useState<LostItem[]>(mockLostItems);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Open' | 'In Custody' | 'Claimed'>('All');
  const [showClaimModal, setShowClaimModal] = useState<LostItem | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    fetchLostItems().then((res) => {
      if (res && res.length > 0) setItems(res);
    });
  }, []);

  const filtered = items.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.locationFound.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchesQuery && matchesStatus;
  });

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showClaimModal) return;
    try {
      const updated = await claimLostItem(showClaimModal.id);
      setItems((prev) =>
        prev.map((it) => (it.id === showClaimModal.id ? updated : it))
      );
    } catch {
      setItems((prev) =>
        prev.map((it) => (it.id === showClaimModal.id ? { ...it, status: 'Claimed' } : it))
      );
    }
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setShowClaimModal(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Campus Property Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
            Lost & Found Ledger
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mt-1">
            Reconnecting students with misplaced items across VGEC campus buildings.
            Report found articles or file a retrieval claim.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
            14 Items Claimed This Month
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search lost items (e.g. calculator, ID card, earbuds)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {(['All', 'Open', 'In Custody', 'Claimed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#00236f] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span
                  className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                    item.status === 'Open'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : item.status === 'In Custody'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">{item.id}</span>
                  <span>{item.category}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h3>

                <div className="text-xs text-slate-500 space-y-1 pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.locationFound}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.foundDate}</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="font-semibold block text-slate-800">Custody Point:</span>
                  <span className="truncate block">{item.custodyOffice}</span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              {item.status !== 'Claimed' ? (
                <button
                  onClick={() => setShowClaimModal(item)}
                  className="w-full py-2 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Claim This Item
                </button>
              ) : (
                <div className="w-full py-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold text-center border border-emerald-200">
                  ✓ Returned to Owner
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900">
              Claim Article: {showClaimModal.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To claim this item, please state identifying proof (serial number, distinctive marks,
              or enrollment ID) before visiting <strong>{showClaimModal.custodyOffice}</strong>.
            </p>

            {claimSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold text-center border border-emerald-200">
                ✓ Claim request logged! Present your college ID card at the custody office.
              </div>
            ) : (
              <form onSubmit={handleClaim} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Identifying Details / Proof
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. My student ID matches the name, or calculator has sticker on back..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowClaimModal(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#00236f] hover:bg-[#1e3a8a] rounded-lg"
                  >
                    Submit Claim Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
