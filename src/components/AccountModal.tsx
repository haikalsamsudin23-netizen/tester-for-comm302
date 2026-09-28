import React, { useState } from 'react';
import { X, User, Shield, Wallet, Settings, Bell, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  virtualBalance: number;
  onResetBalance: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  virtualBalance,
  onResetBalance,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [userName, setUserName] = useState('Pro Trader');
  const [saveAlert, setSaveAlert] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E0E3EB] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E0E3EB] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2962FF] text-white flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#131722]">TradingView Profile & Account</h3>
              <p className="text-xs text-[#787B86]">Pro Market Workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA] rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#E0E3EB] px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 mr-6 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-[#2962FF] text-[#2962FF]'
                : 'border-transparent text-[#787B86] hover:text-[#131722]'
            }`}
          >
            Virtual Portfolio
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-[#2962FF] text-[#2962FF]'
                : 'border-transparent text-[#787B86] hover:text-[#131722]'
            }`}
          >
            Preferences
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {activeTab === 'profile' ? (
            <>
              {/* Virtual Account Card */}
              <div className="bg-gradient-to-br from-[#131722] to-[#1E293B] text-white p-5 rounded-2xl shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Paper Trading Capital
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#089981]/20 text-[#089981] border border-[#089981]/40">
                    Live Demo
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-extrabold tabular-nums tracking-tight">
                    ${virtualBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Available Buying Power: ${(virtualBalance * 2).toLocaleString('en-US', { minimumFractionDigits: 2 })} (2x Margin)
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-700/60">
                  <span className="text-[11px] text-slate-400">Account status: Active</span>
                  <button
                    onClick={onResetBalance}
                    className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Balance ($100k)</span>
                  </button>
                </div>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-[#E0E3EB] p-3 rounded-xl bg-[#F7F9FC]">
                  <span className="text-[#787B86] block text-[11px]">Subscription</span>
                  <span className="font-bold text-[#131722] text-xs">TradingView Pro+ Tier</span>
                </div>
                <div className="border border-[#E0E3EB] p-3 rounded-xl bg-[#F7F9FC]">
                  <span className="text-[#787B86] block text-[11px]">Market Data</span>
                  <span className="font-bold text-[#089981] text-xs">Real-Time Streams</span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#131722] block mb-1">Display Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full border border-[#E0E3EB] rounded-lg px-3 py-2 text-xs text-[#131722] outline-none focus:border-[#2962FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#131722] block mb-1">Quote Currency</label>
                <select className="w-full border border-[#E0E3EB] rounded-lg px-3 py-2 text-xs text-[#131722] bg-white outline-none">
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                  <option value="JPY">JPY - Japanese Yen (¥)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#131722] block mb-1">Chart Color Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border-2 border-[#2962FF] rounded-lg p-2.5 text-center font-bold text-[#131722] bg-[#F7F9FC]">
                    Light Classic (Matches TV)
                  </div>
                  <div className="border border-[#E0E3EB] rounded-lg p-2.5 text-center font-bold text-[#787B86] opacity-60">
                    Dark Pro
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSaveAlert(true);
                  setTimeout(() => setSaveAlert(false), 2000);
                }}
                className="w-full bg-[#2962FF] hover:bg-[#1E53E5] text-white font-bold py-2 rounded-lg transition-colors mt-2"
              >
                {saveAlert ? 'Preferences Saved!' : 'Save Preferences'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
