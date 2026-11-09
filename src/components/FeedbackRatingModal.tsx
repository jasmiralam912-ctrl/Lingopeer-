import React, { useState } from 'react';
import { Star, Check, Sparkles, MessageSquare, ThumbsUp, Heart, AlertCircle, X, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SpeakingPartner, PartnerReview, EnglishLevel } from '../types';

interface FeedbackRatingModalProps {
  partner: SpeakingPartner;
  topicTitle?: string;
  sessionDurationMinutes?: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: PartnerReview, updatedPartner: SpeakingPartner) => void;
}

const COMMUNICATION_STYLE_OPTIONS = [
  'Clear pronunciation',
  'Paced speech (easy to follow)',
  'Active listener',
  'Friendly & encouraging',
  'Warm & welcoming',
  'Great conversational rhythm',
];

const HELPFULNESS_OPTIONS = [
  'Helpful grammar corrections',
  'Rich vocabulary shared',
  'Kept conversation flowing',
  'Patient with hesitations',
  'Shared cultural context',
  'Suggested natural idioms',
];

const IMPROVEMENT_AREAS_OPTIONS = [
  'Spoke a bit too fast at times',
  'Frequent interruptions',
  'Background noise / audio echo',
  'Could balance speaking time more',
  'Hesitant to ask follow-up questions',
  'Difficulty staying on topic',
];

const BADGE_OPTIONS = [
  'Fluency Champion',
  'Grammar Guide',
  'Pronunciation Star',
  'Patient Listener',
  'Cultural Explorer',
  'Engaging Conversationalist',
];

const STAR_LABELS: Record<number, string> = {
  1: 'Needs Improvement',
  2: 'Fair Practice',
  3: 'Good Conversation',
  4: 'Very Good Partner',
  5: 'Outstanding Speaking Partner!',
};

export const FeedbackRatingModal: React.FC<FeedbackRatingModalProps> = ({
  partner,
  topicTitle = 'Casual Daily Conversation',
  sessionDurationMinutes = 12,
  isOpen,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    'Clear pronunciation',
    'Friendly & encouraging',
  ]);
  const [selectedHelpfulness, setSelectedHelpfulness] = useState<string[]>([
    'Patient with hesitations',
    'Kept conversation flowing',
  ]);
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['Patient Listener']);
  const [comment, setComment] = useState<string>('');
  const [wouldPracticeAgain, setWouldPracticeAgain] = useState<boolean>(true);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const addCommentStarter = (starter: string) => {
    setComment((prev) => (prev ? `${prev} ${starter}` : starter));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#059669', '#f59e0b', '#8b5cf6'],
      });
    } catch {
      // Ignore if confetti context fails
    }

    const newReview: PartnerReview = {
      id: `rev-${Date.now()}`,
      partnerId: partner.id,
      authorName: 'Alex Rivera (You)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      authorLevel: 'B2 Upper-Intermediate' as EnglishLevel,
      rating,
      date: 'Just now',
      comment: comment.trim() || 'A wonderful practice session! Really enjoyed our conversation.',
      tags: {
        communicationStyle: selectedStyles,
        helpfulness: selectedHelpfulness,
        improvementAreas: selectedImprovements,
      },
      endorsedBadges: selectedBadges,
      wouldPracticeAgain,
      topicDiscussed: topicTitle,
    };

    // Calculate updated partner rating & distribution
    const newRatingDistribution = { ...partner.ratingDistribution };
    const rKey = rating as 1 | 2 | 3 | 4 | 5;
    newRatingDistribution[rKey] = (newRatingDistribution[rKey] || 0) + 1;

    const newReviewCount = partner.reviewCount + 1;
    const currentTotalPoints = partner.rating * partner.reviewCount;
    const newAverage = Number(((currentTotalPoints + rating) / newReviewCount).toFixed(2));

    // Merge endorsed badges
    const updatedBadges = Array.from(new Set([...partner.badges, ...selectedBadges]));

    const updatedPartner: SpeakingPartner = {
      ...partner,
      rating: newAverage,
      reviewCount: newReviewCount,
      ratingDistribution: newRatingDistribution,
      totalMinutesPracticed: partner.totalMinutesPracticed + sessionDurationMinutes,
      badges: updatedBadges,
      reviews: [newReview, ...partner.reviews],
    };

    setSubmitted(true);
    setTimeout(() => {
      onSubmitReview(newReview, updatedPartner);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Rate Speaking Session</h2>
              <p className="text-xs text-slate-300">
                Help {partner.name} grow and build our trusted learning community
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Confirmation Success View */
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Feedback Submitted!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Thank you for supporting <strong>{partner.name}</strong>. Your ratings and feedback will help learners around the globe connect with the right speaking partners.
            </p>
            <div className="pt-4 flex justify-center gap-2">
              <div className="flex items-center gap-1 text-amber-500 font-semibold text-lg">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                  />
                ))}
                <span className="ml-2 text-slate-700 text-sm font-medium">({STAR_LABELS[rating]})</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Session Summary Card */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <img
                src={partner.avatar}
                alt={partner.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 truncate">{partner.name}</h3>
                  <span className="text-base">{partner.flag}</span>
                  <span className="text-xs text-slate-500">· {partner.level}</span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap gap-x-2">
                  <span>Topic: <strong className="text-slate-800">{topicTitle}</strong></span>
                  <span>·</span>
                  <span>Duration: <strong>{sessionDurationMinutes} minutes</strong></span>
                </div>
              </div>
            </div>

            {/* 1. Star Rating Section */}
            <div className="space-y-2 text-center py-2">
              <label className="block text-sm font-semibold text-slate-900">
                How would you rate your conversation with {partner.name}?
              </label>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = (hoverRating || rating) >= starValue;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starValue)}
                      className="p-1 rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      aria-label={`${starValue} Stars`}
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'text-slate-300 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-sm font-medium text-slate-700 min-h-[1.25rem]">
                {STAR_LABELS[hoverRating || rating]}
              </p>
            </div>

            {/* 2. Communication Style Tags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  Communication Style
                </label>
                <span className="text-xs text-slate-600">Select what was notable</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {COMMUNICATION_STYLE_OPTIONS.map((tag) => {
                  const active = selectedStyles.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleItem(selectedStyles, setSelectedStyles, tag)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        active
                          ? 'bg-sky-50 border-sky-300 text-sky-800 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {active ? '✓ ' : ''}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Helpfulness & Knowledge Sharing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  Helpfulness & Support
                </label>
                <span className="text-xs text-slate-600">What helped your learning?</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {HELPFULNESS_OPTIONS.map((tag) => {
                  const active = selectedHelpfulness.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleItem(selectedHelpfulness, setSelectedHelpfulness, tag)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        active
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {active ? '✓ ' : ''}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Areas for Improvement (Constructive) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Areas for Improvement (Constructive Feedback)
                </label>
                <span className="text-xs text-slate-600">Optional</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {IMPROVEMENT_AREAS_OPTIONS.map((tag) => {
                  const active = selectedImprovements.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleItem(selectedImprovements, setSelectedImprovements, tag)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        active
                          ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {active ? '✓ ' : ''}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Endorse Badges */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                Endorse Partner Badges
              </label>
              <div className="flex flex-wrap gap-2">
                {BADGE_OPTIONS.map((badge) => {
                  const active = selectedBadges.includes(badge);
                  return (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => toggleItem(selectedBadges, setSelectedBadges, badge)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        active
                          ? 'bg-purple-50 border-purple-300 text-purple-800 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {active ? '★ ' : '+ '}
                      {badge}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Written Review Comment */}
            <div className="space-y-2">
              <label htmlFor="feedback-comment" className="block text-sm font-semibold text-slate-900">
                Leave a personal note or review for {partner.name}
              </label>
              <div className="flex flex-wrap gap-1.5 mb-1 text-xs text-slate-500">
                <span className="text-slate-600">Quick starters:</span>
                <button
                  type="button"
                  onClick={() => addCommentStarter('Super patient and gave great tips on pronunciation.')}
                  className="hover:text-sky-600 underline"
                >
                  "Super patient..."
                </button>
                <button
                  type="button"
                  onClick={() => addCommentStarter('Loved discussing culture and shared clear examples.')}
                  className="hover:text-sky-600 underline"
                >
                  "Loved discussing..."
                </button>
                <button
                  type="button"
                  onClick={() => addCommentStarter('Kept the conversation engaging and lively throughout.')}
                  className="hover:text-sky-600 underline"
                >
                  "Kept the conversation..."
                </button>
              </div>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder={`Share specific highlights about ${partner.name}'s communication style, how they helped you practice, or tips for future sessions...`}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder:text-slate-600 resize-none"
              />
            </div>

            {/* 7. Repeat Partner & Privacy Preference */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Would you practice speaking with {partner.name} again?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWouldPracticeAgain(true)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                      wouldPracticeAgain
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Yes, definitely!
                  </button>
                  <button
                    type="button"
                    onClick={() => setWouldPracticeAgain(false)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                      !wouldPracticeAgain
                        ? 'bg-slate-200 border-slate-400 text-slate-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Maybe later
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="publicReview"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <label htmlFor="publicReview" className="text-xs text-slate-600 cursor-pointer">
                  Display this review publicly on {partner.name}&apos;s profile to help other learners
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Skip For Now
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-sm hover:shadow flex items-center gap-2"
              >
                Submit Feedback & Rating
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
