import React, { useState } from 'react';
import { Star, Volume2, Award, Calendar, ThumbsUp, MessageSquare, AlertCircle, Phone, X, Filter } from 'lucide-react';
import { SpeakingPartner, PartnerReview } from '../types';
import { speakEnglish, stopSpeaking } from '../utils/speech';

interface PartnerProfileModalProps {
  partner: SpeakingPartner | null;
  isOpen: boolean;
  onClose: () => void;
  onStartCall: (partner: SpeakingPartner) => void;
  onOpenFeedback: (partner: SpeakingPartner) => void;
}

export const PartnerProfileModal: React.FC<PartnerProfileModalProps> = ({
  partner,
  isOpen,
  onClose,
  onStartCall,
  onOpenFeedback,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | '5' | 'with_comments'>('all');

  if (!isOpen || !partner) return null;

  const handlePlayVoiceBio = async () => {
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

  const filteredReviews = partner.reviews.filter((rev: PartnerReview) => {
    if (reviewFilter === '5') return rev.rating === 5;
    if (reviewFilter === 'with_comments') return rev.comment.trim().length > 10;
    return true;
  });

  const totalReviews = partner.reviewCount || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={partner.avatar}
                alt={partner.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <span className="absolute -bottom-1.5 -right-1.5 text-2xl shadow-xs">
                {partner.flag}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{partner.name}</h2>
                <span className="text-xs px-2 py-0.5 font-medium bg-slate-200 text-slate-700 rounded-md">
                  {partner.role}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2">
                <span>Native: <strong>{partner.nativeLanguage}</strong></span>
                <span>·</span>
                <span>English: <strong className="text-sky-700">{partner.level}</strong></span>
                <span>·</span>
                <span>{partner.country}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900 text-sm">{partner.rating.toFixed(2)}</span>
                </div>
                <span className="text-xs text-slate-600">({partner.reviewCount} peer reviews)</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-600">{partner.totalMinutesPracticed} mins practiced</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Bio & Voice Intro */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">About Me</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{partner.bio}</p>

            {/* Audio Bio Preview Card */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePlayVoiceBio}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isPlayingAudio
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm'
                  }`}
                  aria-label="Listen to voice bio"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    {isPlayingAudio ? 'Playing Voice Introduction...' : 'Listen to Voice Bio'}
                  </div>
                  <div className="text-xs text-slate-500 italic mt-0.5 max-w-md line-clamp-1">
                    &ldquo;{partner.voiceBio.transcript}&rdquo;
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500">{partner.voiceBio.duration}</span>
            </div>
          </div>

          {/* Topics & Endorsed Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Conversation Topics</h4>
              <div className="flex flex-wrap gap-1.5">
                {partner.topics.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 text-xs font-medium bg-white text-slate-700 border border-slate-200 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                Peer Endorsed Badges
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {partner.badges.map((b) => (
                  <span
                    key={b}
                    className="px-2.5 py-1 text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200 rounded-md flex items-center gap-1"
                  >
                    <span>★</span>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ratings & Breakdown */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Partner Ratings & Feedback Breakdown</h3>
              <button
                onClick={() => onOpenFeedback(partner)}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 underline flex items-center gap-1"
              >
                + Leave a Review
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Big Score */}
              <div className="sm:col-span-4 text-center sm:border-r border-slate-100 sm:pr-4">
                <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {partner.rating.toFixed(2)}
                </div>
                <div className="flex items-center justify-center gap-1 my-1.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= Math.round(partner.rating) ? 'fill-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Based on {partner.reviewCount} verified speaking sessions
                </p>
              </div>

              {/* Bar Graph */}
              <div className="sm:col-span-8 space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = partner.ratingDistribution[stars as 1 | 2 | 3 | 4 | 5] || 0;
                  const percentage = Math.round((count / totalReviews) * 100);
                  return (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-8 text-slate-600 font-medium">{stars} ★</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-slate-600 font-mono">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Individual Reviews Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Reviews & Feedback from Learners</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {filteredReviews.length}
                </span>
              </h3>

              <div className="flex items-center gap-1 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setReviewFilter('all')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    reviewFilter === 'all' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('5')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    reviewFilter === '5' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  5 Stars
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('with_comments')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    reviewFilter === 'with_comments' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  With Notes
                </button>
              </div>
            </div>

            {filteredReviews.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">No reviews found matching the selected filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReviews.map((rev: PartnerReview) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.authorAvatar}
                          alt={rev.authorName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{rev.authorName}</div>
                          <div className="text-[11px] text-slate-600">
                            Learner level: {rev.authorLevel} · Topic: {rev.topicDiscussed}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-600">{rev.date}</span>
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

                    {/* Feedback Tags */}
                    <div className="space-y-1.5 pt-1 text-[11px]">
                      {rev.tags.communicationStyle.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-slate-600 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-sky-600" />
                            Style:
                          </span>
                          {rev.tags.communicationStyle.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-100"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {rev.tags.helpfulness.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-slate-600 flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3 text-emerald-600" />
                            Helpfulness:
                          </span>
                          {rev.tags.helpfulness.map((h) => (
                            <span
                              key={h}
                              className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      )}

                      {rev.tags.improvementAreas.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-slate-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            Area for Improvement:
                          </span>
                          {rev.tags.improvementAreas.map((imp) => (
                            <span
                              key={imp}
                              className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200"
                            >
                              {imp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{partner.availability}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenFeedback(partner)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Rate Partner
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartCall(partner);
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Practice Speaking Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
