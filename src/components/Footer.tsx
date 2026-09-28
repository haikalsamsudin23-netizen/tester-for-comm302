import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E0E3EB] mt-auto py-8" data-purpose="page-footer">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#787B86] gap-4">
        <div className="flex items-center space-x-4">
          <span>© 2025 TradingView</span>
          <button
            type="button"
            className="hover:text-[#131722] transition-colors focus:outline-none"
            onClick={() => {}}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            className="hover:text-[#131722] transition-colors focus:outline-none"
            onClick={() => {}}
          >
            Terms of Service
          </button>
          <button
            type="button"
            className="hover:text-[#131722] transition-colors focus:outline-none"
            onClick={() => {}}
          >
            Disclaimers
          </button>
        </div>
        <div>
          <span>Market quotes are simulated and displayed for demonstration purposes.</span>
        </div>
      </div>
    </footer>
  );
};
