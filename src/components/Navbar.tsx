import React from 'react';
import { Sparkles, PhoneCall } from 'lucide-react';

interface NavbarProps {
  activeTab: 'partners' | 'topics' | 'ai_coach' | 'my_reviews';
  onSelectTab: (tab: 'partners' | 'topics' | 'ai_coach' | 'my_reviews') => void;
  onOpenInstantMatch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenInstantMatch,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('partners')}
          className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-base shadow-xs">
            LP
          </div>
          <span>LingoPeer</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onSelectTab('partners')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'partners'
                ? 'text-sky-700 font-semibold border-b-2 border-sky-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Find Speaking Partners
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('topics')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'topics'
                ? 'text-sky-700 font-semibold border-b-2 border-sky-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Topic Generator
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('ai_coach')}
            className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 ${
              activeTab === 'ai_coach'
                ? 'text-sky-700 font-semibold border-b-2 border-sky-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Practice Coach</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('my_reviews')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'my_reviews'
                ? 'text-sky-700 font-semibold border-b-2 border-sky-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Ratings & Feedback
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenInstantMatch}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-xs flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Instant Partner Match</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50/90 px-2 py-2 text-xs font-medium">
        <button
          type="button"
          onClick={() => onSelectTab('partners')}
          className={`px-2 py-1 rounded-md ${activeTab === 'partners' ? 'bg-white text-sky-700 font-bold shadow-xs' : 'text-slate-600'}`}
        >
          Partners
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('topics')}
          className={`px-2 py-1 rounded-md ${activeTab === 'topics' ? 'bg-white text-sky-700 font-bold shadow-xs' : 'text-slate-600'}`}
        >
          Topics
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('ai_coach')}
          className={`px-2 py-1 rounded-md flex items-center gap-1 ${activeTab === 'ai_coach' ? 'bg-white text-sky-700 font-bold shadow-xs' : 'text-slate-600'}`}
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>AI Coach</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('my_reviews')}
          className={`px-2 py-1 rounded-md ${activeTab === 'my_reviews' ? 'bg-white text-sky-700 font-bold shadow-xs' : 'text-slate-600'}`}
        >
          Reviews
        </button>
      </div>
    </header>
  );
};
