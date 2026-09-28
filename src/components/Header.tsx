import React, { useState, useEffect } from 'react';
import { Search, Globe, User, ChevronDown, Check, Zap, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  isLiveUpdating: boolean;
  onToggleLive: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAccount,
  isLiveUpdating,
  onToggleLive,
  activeNav,
  setActiveNav,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [marketOpen] = useState(true);

  const languages = [
    { code: 'EN', label: 'English (US)' },
    { code: 'ES', label: 'Español' },
    { code: 'DE', label: 'Deutsch' },
    { code: 'JA', label: '日本語' },
    { code: 'FR', label: 'Français' },
    { code: 'ZH', label: '简体中文' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-lang-menu]')) {
        setLangMenuOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E0E3EB]" data-purpose="top-navigation">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-[64px] flex items-center justify-between">
        {/* Brand & Search Section */}
        <div className="flex items-center space-x-6 flex-shrink-0">
          {/* TradingView Geometric Logo */}
          <button
            onClick={() => setActiveNav('Markets')}
            aria-label="TradingView Home"
            className="flex items-center text-[#131722] hover:opacity-90 transition-opacity focus:outline-none"
          >
            <svg className="w-8 h-8 fill-current" viewBox="0 0 36 28" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 22H7V6h7v16zm8-22h-7v28h7V0zm8 11h-7v17h7V11z" fill="currentColor" />
            </svg>
          </button>

          {/* Search Bar with Shortcut */}
          <div className="relative w-64 md:w-80 lg:w-96">
            <button
              onClick={onOpenSearch}
              type="button"
              className="w-full text-left bg-[#f0f3fa] hover:bg-[#e4e8f0] text-sm text-[#787B86] pl-10 pr-4 py-2 rounded-full border border-transparent focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF] outline-none transition-all duration-150 flex items-center justify-between group"
            >
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#787B86] group-hover:text-[#131722] transition-colors">
                <Search className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-xs md:text-sm text-[#787B86]">Search (Ctrl+K)</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white text-[#787B86] border border-[#E0E3EB]">
                ⌘K
              </span>
            </button>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-[#131722]">
          {['Products', 'Community', 'Markets', 'Brokers', 'More'].map((nav) => {
            const isActive = activeNav === nav;
            return (
              <button
                key={nav}
                onClick={() => setActiveNav(nav)}
                className={`py-5 transition-colors relative font-medium ${
                  isActive
                    ? 'text-[#2962FF] font-semibold'
                    : 'text-[#131722] hover:text-[#2962FF]'
                }`}
              >
                {nav}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2962FF]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Live Tick Pulse Toggle */}
          <button
            onClick={onToggleLive}
            title={isLiveUpdating ? 'Live data streaming active (click to pause)' : 'Live data streaming paused (click to resume)'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              isLiveUpdating
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveUpdating ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'
              }`}
            />
            <span className="font-semibold">{isLiveUpdating ? 'Live' : 'Paused'}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative" data-lang-menu>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full hover:bg-[#F0F3FA] text-[#131722] transition-colors"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-[#131722] stroke-[1.8]" />
              <span className="tracking-wide">{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-[#787B86]" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-[#E0E3EB] py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-100">
                <div className="px-3 py-1 font-semibold text-[#787B86] border-b border-[#E0E3EB] uppercase text-[10px]">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setCurrentLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F7F9FC] text-[#131722] transition-colors"
                  >
                    <span>{l.label}</span>
                    {currentLang === l.code && <Check className="w-3.5 h-3.5 text-[#2962FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Avatar/Icon */}
          <button
            onClick={onOpenAccount}
            aria-label="User Account"
            className="p-1.5 rounded-full text-[#131722] hover:bg-[#F0F3FA] transition-colors focus:outline-none"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* CTA Button */}
          <button
            onClick={onOpenAccount}
            className="bg-gradient-to-r from-[#1976D2] to-[#2962FF] hover:opacity-95 text-white text-xs md:text-sm font-semibold px-4 md:px-5 py-2 rounded-full shadow-sm transition-all duration-150 cursor-pointer"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
};
