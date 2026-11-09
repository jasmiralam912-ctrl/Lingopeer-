import React, { useState } from 'react';
import { Star, Volume2, Phone, MessageSquare, Award } from 'lucide-react';
import { SpeakingPartner } from '../types';
import { speakEnglish, stopSpeaking } from '../utils/speech';

interface PartnerCardProps {
  partner: SpeakingPartner;
  onOpenProfile: (partner: SpeakingPartner) => void;
  onStartCall: (partner: SpeakingPartner) => void;
  onOpenFeedback: (partner: SpeakingPartner) => void;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  partner,
  onOpenProfile,
  onStartCall,
  onOpenFeedback,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudioPreview = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    await speakEnglish(
      partner.voiceBio.transcript,
      partner.country === 'United Kingdom' ? 'british' : 'american'
    );
    setIsPlayingAudio(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group">
      {/* Top Profile Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={partner.avatar}
                alt={partner.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 text-lg drop-shadow-xs">
                {partner.flag}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-700 transition-colors">
                  {partner.name}
                </h3>
              </div>

              {/* Clean unboxed metadata with dot separators */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <span>{partner.country}</span>
                <span aria-hidden="true">·</span>
                <span className="text-sky-700 font-medium">{partner.level}</span>
              </div>
            </div>
          </div>

          {/* Star Rating Badge button that opens reviews */}
          <button
            type="button"
            onClick={() => onOpenProfile(partner)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 transition-colors"
            title="View partner ratings & reviews"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="font-bold text-xs">{partner.rating.toFixed(2)}</span>
            <span className="text-[11px] text-amber-700">({partner.reviewCount})</span>
          </button>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {partner.bio}
        </p>

        {/* Audio Bio Preview Button */}
        <div className="mt-3">
          <button
            type="button"
            onClick={handleAudioPreview}
            className={`w-full px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-colors ${
              isPlayingAudio
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-sky-600" />
              <span>{isPlayingAudio ? 'Speaking intro...' : 'Voice Intro Bio'}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">{partner.voiceBio.duration}</span>
          </button>
        </div>

        {/* Conversation Topics */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {partner.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md"
            >
              {topic}
            </span>
          ))}
          {partner.topics.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] text-slate-600">
              +{partner.topics.length - 3} more
            </span>
          )}
        </div>

        {/* Top Endorsed Badge */}
        {partner.badges.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-purple-700 font-medium">
            <Award className="w-3 h-3 text-purple-600" />
            <span>Top badge: <strong>{partner.badges[0]}</strong></span>
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpenProfile(partner)}
          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 text-center flex items-center justify-center gap-1"
        >
          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
          <span>Reviews ({partner.reviewCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onStartCall(partner)}
          className="flex-1 py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs text-center flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Practice Now</span>
        </button>
      </div>
    </div>
  );
};
