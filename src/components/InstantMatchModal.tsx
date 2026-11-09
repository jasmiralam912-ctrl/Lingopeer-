import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, X, CheckCircle, Search } from 'lucide-react';
import { SpeakingPartner, TopicCard } from '../types';
import { TOPIC_CARDS } from '../data/mockPartners';

interface InstantMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  partners: SpeakingPartner[];
  onStartSession: (partner: SpeakingPartner, topic: TopicCard) => void;
}

export const InstantMatchModal: React.FC<InstantMatchModalProps> = ({
  isOpen,
  onClose,
  partners,
  onStartSession,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<TopicCard>(TOPIC_CARDS[0]);
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [matchingStep, setMatchingStep] = useState<string>('Ready to search');
  const [matchedPartner, setMatchedPartner] = useState<SpeakingPartner | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsMatching(false);
      setMatchedPartner(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartMatchmaking = () => {
    setIsMatching(true);
    setMatchedPartner(null);
    setMatchingStep('Pinging active online learners...');

    setTimeout(() => {
      setMatchingStep('Matching target levels & conversation topics...');
    }, 900);

    setTimeout(() => {
      setMatchingStep('Found a high-compatibility speaking partner!');
      // Select best rated available partner
      const chosen = partners.find((p) => p.status === 'online') || partners[0];
      setMatchedPartner(chosen);
      setIsMatching(false);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Instant Partner Match</h3>
              <p className="text-xs text-slate-500">Pair with an active learner in seconds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {matchedPartner ? (
          /* Match Found View */
          <div className="text-center space-y-4 py-2 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900">Partner Matched!</h4>
              <p className="text-xs text-slate-500">High conversational chemistry based on ratings</p>
            </div>

            {/* Matched Profile Preview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-left">
              <img
                src={matchedPartner.avatar}
                alt={matchedPartner.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-900 truncate">
                    {matchedPartner.name}
                  </span>
                  <span>{matchedPartner.flag}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {matchedPartner.level} · Rating: <strong>★ {matchedPartner.rating.toFixed(2)}</strong>
                </div>
                <div className="text-[11px] text-sky-700 font-medium truncate mt-0.5">
                  Topic: {selectedTopic.title}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onStartSession(matchedPartner, selectedTopic);
              }}
              className="w-full py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Enter Live Practice Room</span>
            </button>
          </div>
        ) : isMatching ? (
          /* Radar Scanning View */
          <div className="text-center py-8 space-y-4">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-sky-400/30 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-lg">
                <Search className="w-7 h-7 animate-spin" />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{matchingStep}</h4>
              <p className="text-xs text-slate-500 mt-1">Filtering by topic: {selectedTopic.title}</p>
            </div>
          </div>
        ) : (
          /* Configuration View */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Choose Conversation Topic
              </label>
              <select
                value={selectedTopic.id}
                onChange={(e) => {
                  const t = TOPIC_CARDS.find((x) => x.id === e.target.value) || TOPIC_CARDS[0];
                  setSelectedTopic(t);
                }}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {TOPIC_CARDS.map((tc) => (
                  <option key={tc.id} value={tc.id}>
                    {tc.category}: {tc.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs text-sky-950 space-y-1">
              <div className="font-semibold text-sky-900">How Instant Match works:</div>
              <ul className="list-disc pl-4 space-y-0.5 text-sky-800 text-[11px]">
                <li>Matches you with active online learners or volunteers.</li>
                <li>Pre-loads balanced topic questions to guide your discussion.</li>
                <li>After your call, submit a quick rating to endorse your partner!</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleStartMatchmaking}
              className="w-full py-3 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find Speaking Partner Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
