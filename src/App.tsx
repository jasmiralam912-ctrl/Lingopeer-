import React, { useState, useEffect } from 'react';
import { 
  Search, Star, Sparkles, Phone, MessageSquare, 
  User, CheckCircle2, SlidersHorizontal, BookOpen, 
  ArrowRight, Heart
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { PartnerCard } from './components/PartnerCard';
import { PartnerProfileModal } from './components/PartnerProfileModal';
import { FeedbackRatingModal } from './components/FeedbackRatingModal';
import { LiveSpeakingRoom } from './components/LiveSpeakingRoom';
import { TopicGenerator } from './components/TopicGenerator';
import { AISpeakingCoach } from './components/AISpeakingCoach';
import { MyReviewsView } from './components/MyReviewsView';
import { InstantMatchModal } from './components/InstantMatchModal';
import { UserProfileModal } from './components/UserProfileModal';
import { INITIAL_PARTNERS, TOPIC_CARDS } from './data/mockPartners';
import { SpeakingPartner, PartnerReview, UserProfile, TopicCard } from './types';
import { GeneratedTopic } from './data/mockTopics';

const DEFAULT_USER_PROFILE: UserProfile = {
  username: '@alex_english',
  fullName: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
  nativeLanguage: 'Spanish',
  country: 'Spain / Mexico',
  countryFlag: '🇪🇸',
  currentLevel: 'B2 Upper-Intermediate',
  learningGoals: [
    'Conversational fluency',
    'Business English & interview prep',
    'Accent & pronunciation refinement',
  ],
  interests: [
    'Technology & AI',
    'Travel & Adventure',
    'Movies & Cinema',
    'Cooking & Gastronomy',
    'Entrepreneurship & Startups',
  ],
  bio: "Hi everyone! I'm Alex. I've been learning English for 3 years. I love discussing tech, travel, and cultural traditions. Looking for patient partners for 15-30 minute speaking exchanges!",
  dailySpeakingTargetMinutes: 20,
  speakingStreakDays: 8,
  totalMinutesPracticed: 210,
  partnerRatingAverage: 4.96,
  badgesEarned: [
    'Fluency Champion',
    'Engaging Conversationalist',
    'Active Listener',
    'Consistent Learner',
  ],
};

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'partners' | 'topics' | 'ai_coach' | 'my_reviews'>('partners');

  // Stored state for partners and user profile
  const [partners, setPartners] = useState<SpeakingPartner[]>(() => {
    const saved = localStorage.getItem('lingopeer_partners');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PARTNERS;
      }
    }
    return INITIAL_PARTNERS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lingopeer_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USER_PROFILE;
      }
    }
    return DEFAULT_USER_PROFILE;
  });

  const [userReviewsGiven, setUserReviewsGiven] = useState<PartnerReview[]>(() => {
    const saved = localStorage.getItem('lingopeer_reviews_given');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Default initial review left for partner-1
    return [
      {
        id: 'rev-seed-1',
        partnerId: 'partner-1',
        authorName: 'Alex Rivera (You)',
        authorAvatar: DEFAULT_USER_PROFILE.avatar,
        authorLevel: 'B2 Upper-Intermediate',
        rating: 5,
        date: '3 days ago',
        comment: 'Sarah was wonderful! Super clear British accent, asked great follow-up questions, and suggested natural idioms for workplace conversation.',
        tags: {
          communicationStyle: ['Clear pronunciation', 'Paced speech (easy to follow)', 'Friendly & encouraging'],
          helpfulness: ['Helpful grammar corrections', 'Rich vocabulary shared', 'Kept conversation flowing'],
          improvementAreas: [],
        },
        endorsedBadges: ['Fluency Champion', 'Grammar Guide'],
        wouldPracticeAgain: true,
        topicDiscussed: 'Daily Life & Workplace Culture',
      },
    ];
  });

  // Partner filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'minutes'>('rating');

  // Modals & active sessions
  const [selectedPartnerForProfile, setSelectedPartnerForProfile] = useState<SpeakingPartner | null>(null);
  const [feedbackPartner, setFeedbackPartner] = useState<SpeakingPartner | null>(null);
  const [feedbackSessionDuration, setFeedbackSessionDuration] = useState<number>(15);
  const [activeCallPartner, setActiveCallPartner] = useState<SpeakingPartner | null>(null);
  const [activeTopicForCall, setActiveTopicForCall] = useState<TopicCard>(TOPIC_CARDS[0]);
  const [isInstantMatchOpen, setIsInstantMatchOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('lingopeer_partners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('lingopeer_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('lingopeer_reviews_given', JSON.stringify(userReviewsGiven));
  }, [userReviewsGiven]);

  // Handlers
  const handleOpenPartnerProfile = (partner: SpeakingPartner) => {
    setSelectedPartnerForProfile(partner);
  };

  const handleStartCall = (partner: SpeakingPartner, topic?: TopicCard) => {
    setSelectedPartnerForProfile(null);
    setActiveTopicForCall(topic || TOPIC_CARDS[0]);
    setActiveCallPartner(partner);
  };

  const handleEndCall = (durationMinutes: number) => {
    if (!activeCallPartner) return;
    const finishedPartner = activeCallPartner;
    setActiveCallPartner(null);
    setFeedbackSessionDuration(durationMinutes);
    // Transition straight to rating & feedback modal
    setFeedbackPartner(finishedPartner);
  };

  const handleOpenFeedback = (partner: SpeakingPartner) => {
    setSelectedPartnerForProfile(null);
    setFeedbackPartner(partner);
  };

  const handleSubmitReview = (newReview: PartnerReview, updatedPartner: SpeakingPartner) => {
    // Update partner in local state
    setPartners((prev) =>
      prev.map((p) => (p.id === updatedPartner.id ? updatedPartner : p))
    );
    // Add to user reviews given list
    setUserReviewsGiven((prev) => [newReview, ...prev]);
    // Close modal
    setFeedbackPartner(null);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  const handleSelectGeneratedTopicForPractice = (topic: GeneratedTopic) => {
    // Create a TopicCard format
    const converted: TopicCard = {
      id: topic.id,
      category: topic.category as any,
      title: topic.title,
      prompt: topic.description,
      questions: topic.questions,
      suggestedVocab: topic.vocabulary.map((v) => ({
        word: v.word,
        ipa: v.ipa,
        definition: v.meaning,
        example: v.exampleSentence,
      })),
    };
    setActiveTopicForCall(converted);
    // Automatically match with online partner or open instant match
    setIsInstantMatchOpen(true);
  };

  // Filter and sort partners
  const filteredPartners = partners
    .filter((partner) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        partner.name.toLowerCase().includes(q) ||
        partner.country.toLowerCase().includes(q) ||
        partner.nativeLanguage.toLowerCase().includes(q) ||
        partner.bio.toLowerCase().includes(q) ||
        partner.topics.some((t) => t.toLowerCase().includes(q));

      const matchesLevel =
        levelFilter === 'All' ||
        partner.level.toLowerCase().includes(levelFilter.toLowerCase());

      const matchesTopic =
        topicFilter === 'All' ||
        partner.topics.some((t) => t.toLowerCase().includes(topicFilter.toLowerCase()));

      return matchesSearch && matchesLevel && matchesTopic;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'minutes') return b.totalMinutesPracticed - a.totalMinutesPracticed;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Top Bar Contract Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenInstantMatch={() => setIsInstantMatchOpen(true)}
      />

      {/* User Status Strip & Quick Profile Trigger */}
      <div className="bg-slate-100/80 border-b border-slate-200/80 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-slate-600">
            <button
              type="button"
              onClick={() => setIsUserProfileOpen(true)}
              className="flex items-center gap-2 hover:text-slate-900 group"
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.fullName}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-slate-300"
              />
              <span className="font-semibold text-slate-900 group-hover:underline">
                {userProfile.fullName}
              </span>
              <span className="text-slate-400">({userProfile.username})</span>
            </button>

            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="hidden sm:inline">
              Native: <strong>{userProfile.nativeLanguage}</strong>
            </span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="hidden sm:inline">
              Goal: <strong className="text-sky-700">{userProfile.currentLevel}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsUserProfileOpen(true)}
              className="font-semibold text-sky-700 hover:text-sky-800 hover:underline flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit My Profile</span>
            </button>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{userProfile.partnerRatingAverage.toFixed(2)} rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Viewports */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab 1: Find Speaking Partners */}
        {activeTab === 'partners' && (
          <div className="space-y-8">
            {/* Hero Split Section */}
            <div className="relative rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Column (Col 7): Hero Copy & Match CTA */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 mb-2">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>Global Peer Language Exchange</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
                    Find Friendly English Speaking Partners & Practice Live
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed max-w-xl">
                    Connect with fellow learners and native volunteers worldwide. Practice engaging conversation topics, build real fluency, and receive constructive post-session feedback.
                  </p>
                </div>

                {/* 3 Value Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Ratings</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      1-5 star reviews on communication style & helpfulness.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                      <span>Topic Cards</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Built-in discussion prompts, questions, and vocab.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>AI Warmup Coach</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Practice 24/7 with Gemini to overcome hesitation.
                    </p>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInstantMatchOpen(true)}
                    className="px-6 py-3 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-sm flex items-center gap-2 group"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Instant Partner Match</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('topics')}
                    className="px-5 py-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-xl transition-colors"
                  >
                    Browse Topic Generator
                  </button>
                </div>
              </div>

              {/* Right Column (Col 5): Photographic Asset */}
              <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full">
                <img
                  src="/src/assets/images/hero_speaking_partners_1794185941798.jpg"
                  alt="Students practicing English conversation"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover lg:absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:hidden" />
                <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/20 text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span>Active Community</span>
                  </div>
                  <div className="text-[11px] text-slate-200 mt-0.5">
                    Over 1,200 learners practicing speaking daily across 45+ countries.
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, country, native language, or interests (e.g. 'Japan', 'Tech', 'IELTS')..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>

                {/* Sort control */}
                <div className="flex items-center gap-2 text-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="rating">Highest Rated (★ 4.9+)</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="minutes">Most Minutes Practiced</option>
                  </select>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                {/* Level selector */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
                  <span className="text-slate-600 font-medium mr-1 whitespace-nowrap">Level:</span>
                  {['All', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Native'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        levelFilter === lvl
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                {/* Topic selector */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
                  <span className="text-slate-600 font-medium mr-1 whitespace-nowrap">Topic:</span>
                  {['All', 'Casual', 'IELTS', 'Tech', 'Business', 'Travel'].map((top) => (
                    <button
                      key={top}
                      type="button"
                      onClick={() => setTopicFilter(top)}
                      className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        topicFilter === top
                          ? 'bg-sky-600 text-white font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {top}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Speaking Partner Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Available Speaking Partners ({filteredPartners.length})
                </span>
                <span className="text-slate-500">Click any partner to view feedback or practice</span>
              </div>

              {filteredPartners.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <Search className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">No speaking partners matched your filter</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try clearing your search keyword or switching the target level filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setLevelFilter('All');
                      setTopicFilter('All');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-sky-700 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredPartners.map((partner) => (
                    <PartnerCard
                      key={partner.id}
                      partner={partner}
                      onOpenProfile={handleOpenPartnerProfile}
                      onStartCall={handleStartCall}
                      onOpenFeedback={handleOpenFeedback}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Topic Generator */}
        {activeTab === 'topics' && (
          <TopicGenerator
            onSelectTopicForPractice={handleSelectGeneratedTopicForPractice}
          />
        )}

        {/* Tab 3: AI Speaking Coach */}
        {activeTab === 'ai_coach' && <AISpeakingCoach />}

        {/* Tab 4: Ratings & Feedback Dossier */}
        {activeTab === 'my_reviews' && (
          <MyReviewsView
            userReviewsGiven={userReviewsGiven}
            partners={partners}
            onOpenPartnerProfile={handleOpenPartnerProfile}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">LingoPeer</span>
            <span>· English Speaking Practice & Partner Exchange</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Level Calibration: CEFR A1 - C2</span>
            <span>·</span>
            <span>Safe & Verified Learning Community</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      {/* 1. Partner Detailed Profile & Rating Dossier Modal */}
      <PartnerProfileModal
        partner={selectedPartnerForProfile}
        isOpen={Boolean(selectedPartnerForProfile)}
        onClose={() => setSelectedPartnerForProfile(null)}
        onStartCall={(p) => handleStartCall(p)}
        onOpenFeedback={(p) => handleOpenFeedback(p)}
      />

      {/* 2. Feedback & Rating System Modal */}
      {feedbackPartner && (
        <FeedbackRatingModal
          partner={feedbackPartner}
          topicTitle={activeTopicForCall.title}
          sessionDurationMinutes={feedbackSessionDuration}
          isOpen={Boolean(feedbackPartner)}
          onClose={() => setFeedbackPartner(null)}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* 3. Live Speaking Room Interface */}
      {activeCallPartner && (
        <LiveSpeakingRoom
          partner={activeCallPartner}
          initialTopic={activeTopicForCall}
          isOpen={Boolean(activeCallPartner)}
          onEndCall={handleEndCall}
        />
      )}

      {/* 4. Instant Partner Match Modal */}
      <InstantMatchModal
        isOpen={isInstantMatchOpen}
        onClose={() => setIsInstantMatchOpen(false)}
        partners={partners}
        onStartSession={(partner, topic) => handleStartCall(partner, topic)}
      />

      {/* 5. User Profile System Modal */}
      <UserProfileModal
        profile={userProfile}
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
