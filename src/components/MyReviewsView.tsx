import React, { useState } from 'react';
import { Star, Award, MessageSquare, ThumbsUp, AlertCircle, Heart, UserCheck, ShieldCheck } from 'lucide-react';
import { PartnerReview, SpeakingPartner } from '../types';

interface MyReviewsViewProps {
  userReviewsGiven: PartnerReview[];
  partners: SpeakingPartner[];
  onOpenPartnerProfile: (partner: SpeakingPartner) => void;
}

export const MyReviewsView: React.FC<MyReviewsViewProps> = ({
  userReviewsGiven,
  partners,
  onOpenPartnerProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'given' | 'received'>('given');

  // Simulated reviews received by the user on their own profile
  const reviewsReceived = [
    {
      id: 'rec-1',
      authorName: 'Sarah Jenkins',
      authorAvatar: '/src/assets/images/avatar_partner_sarah_1794185941878.jpg',
      rating: 5,
      date: '3 days ago',
      topic: 'Hometowns & Hidden Gems',
      comment: 'Alex was such a delight to speak with! Super curious about London life, spoke clearly, and wasn’t afraid to test out advanced idioms. Keep it up!',
      tags: {
        communicationStyle: ['Active listener', 'Friendly & encouraging'],
        helpfulness: ['Kept conversation flowing'],
        improvementAreas: [],
      },
      badges: ['Fluency Champion', 'Active Listener'],
    },
    {
      id: 'rec-2',
      authorName: 'Kenji Sato',
      authorAvatar: '/src/assets/images/avatar_partner_kenji_1794185941995.jpg',
      rating: 5,
      date: '1 week ago',
      topic: 'AI & The Future of Work',
      comment: 'Very balanced conversation. Alex gave me plenty of time to share my engineering background in Tokyo. Great pronunciation.',
      tags: {
        communicationStyle: ['Clear pronunciation', 'Paced speech (easy to follow)'],
        helpfulness: ['Shared cultural context'],
        improvementAreas: [],
      },
      badges: ['Engaging Conversationalist'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Reputation Metrics */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-700">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Community Trust & Feedback Dossier</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Ratings, Feedback & Endorsements
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Review history from speaking practice sessions and your community reputation score.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('given')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'given'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reviews Given ({userReviewsGiven.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('received')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'received'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Feedback Received ({reviewsReceived.length})
            </button>
          </div>
        </div>

        {/* Reputation Score Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 font-medium">Your Partner Rating</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-1 font-mono">
              <span>5.0</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">100% positive peer reviews</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 font-medium">Sessions Rated</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
              {userReviewsGiven.length}
            </div>
            <span className="text-[11px] text-slate-600">Feedback submitted</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 font-medium">Badges Endorsed</div>
            <div className="text-2xl font-extrabold text-purple-700 mt-1 font-mono">
              {userReviewsGiven.reduce((acc, r) => acc + (r.endorsedBadges?.length || 0), 0) + 4}
            </div>
            <span className="text-[11px] text-slate-600">Peer skill tags</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 font-medium">Repeat Rate</div>
            <div className="text-2xl font-extrabold text-rose-600 mt-1 flex items-center gap-1 font-mono">
              <span>100%</span>
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <span className="text-[11px] text-slate-600">Wants to practice again</span>
          </div>
        </div>
      </div>

      {/* Tab 1: Reviews Given */}
      {activeTab === 'given' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Feedback & Ratings You Left for Speaking Partners
          </h3>

          {userReviewsGiven.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-800 text-sm">No reviews submitted yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Complete a speaking session with a partner and leave your rating to help fellow English learners.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userReviewsGiven.map((review) => {
                const partner = partners.find((p) => p.id === review.partnerId);
                return (
                  <div
                    key={review.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Partner lockup */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={partner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                            alt={partner?.name || 'Partner'}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                          />
                          <div>
                            <div className="font-bold text-sm text-slate-900">
                              {partner?.name || 'Speaking Partner'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {review.date} · Topic: <strong>{review.topicDiscussed}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="text-xs text-slate-700 mt-3 leading-relaxed">
                        &ldquo;{review.comment}&rdquo;
                      </p>

                      {/* Tags */}
                      <div className="space-y-1.5 mt-3 text-[11px]">
                        {review.tags.communicationStyle.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {review.tags.communicationStyle.map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-100"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {review.tags.helpfulness.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {review.tags.helpfulness.map((h) => (
                              <span
                                key={h}
                                className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        )}

                        {review.tags.improvementAreas.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {review.tags.improvementAreas.map((imp) => (
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

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Practice again: <strong className="text-rose-600">{review.wouldPracticeAgain ? 'Yes' : 'No'}</strong>
                      </span>
                      {partner && (
                        <button
                          type="button"
                          onClick={() => onOpenPartnerProfile(partner)}
                          className="font-semibold text-sky-600 hover:text-sky-700 underline"
                        >
                          View Partner
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Feedback Received */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Feedback & Endorsements Other Learners Left for You
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewsReceived.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rec.authorAvatar}
                      alt={rec.authorName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900">{rec.authorName}</div>
                      <div className="text-[11px] text-slate-500">
                        {rec.date} · Topic: <strong>{rec.topic}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  &ldquo;{rec.comment}&rdquo;
                </p>

                <div className="flex flex-wrap gap-1 text-[11px] pt-1">
                  {rec.tags.communicationStyle.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-100"
                    >
                      {s}
                    </span>
                  ))}
                  {rec.badges.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1"
                    >
                      <span>★</span>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
