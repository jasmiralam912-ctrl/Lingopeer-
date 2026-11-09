import React, { useState } from 'react';
import { 
  User, Globe, Target, Heart, Edit3, Check, X, 
  Award, Flame, Clock, Star, Sparkles, Plus, Save 
} from 'lucide-react';
import { UserProfile, EnglishLevel } from '../types';

interface UserProfileModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

const COMMON_NATIVE_LANGUAGES = [
  'Spanish',
  'Japanese',
  'French',
  'Arabic',
  'Mandarin Chinese',
  'Hindi',
  'Portuguese',
  'German',
  'Italian',
  'Korean',
  'Vietnamese',
  'Turkish',
  'Russian',
  'Polish',
  'Indonesian',
];

const PRESET_GOALS = [
  'Conversational fluency',
  'Business English & interview prep',
  'Exam preparation (IELTS / TOEFL)',
  'Accent & pronunciation refinement',
  'Travel & cultural exchange',
  'Academic writing & presentations',
];

const PRESET_INTERESTS = [
  'Movies & Cinema',
  'Sports & Fitness',
  'Technology & AI',
  'Travel & Adventure',
  'Books & Literature',
  'Music & Podcasts',
  'Cooking & Gastronomy',
  'Gaming & Esports',
  'Entrepreneurship & Startups',
  'Photography',
  'Philosophy & Psychology',
  'Science & Nature',
];

const CEFR_LEVELS: EnglishLevel[] = [
  'A1 Beginner',
  'A2 Elementary',
  'B1 Intermediate',
  'B2 Upper-Intermediate',
  'C1 Advanced',
  'C2 Proficient / Native',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSaveProfile,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [newCustomInterest, setNewCustomInterest] = useState<string>('');
  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleGoal = (goal: string) => {
    if (formData.learningGoals.includes(goal)) {
      setFormData({
        ...formData,
        learningGoals: formData.learningGoals.filter((g) => g !== goal),
      });
    } else {
      setFormData({
        ...formData,
        learningGoals: [...formData.learningGoals, goal],
      });
    }
  };

  const toggleInterest = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== interest),
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      });
    }
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCustomInterest.trim();
    if (!trimmed || formData.interests.includes(trimmed)) return;
    setFormData({
      ...formData,
      interests: [...formData.interests, trimmed],
    });
    setNewCustomInterest('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsEditing(false);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Learner Speaking Profile</h2>
              <p className="text-xs text-slate-300">
                Manage how speaking partners discover and connect with you
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
              >
                Cancel
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {savedNotification && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully! Speaking partners will see your latest goals and interests.</span>
            </div>
          )}

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* Basic Info (Username, Full Name, Native Language) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Username (Unique Handle)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs">@</span>
                    <input
                      type="text"
                      required
                      value={formData.username.replace('@', '')}
                      onChange={(e) =>
                        setFormData({ ...formData, username: `@${e.target.value.replace('@', '')}` })
                      }
                      className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Native Language & Current Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-sky-600" />
                    Native Language
                  </label>
                  <select
                    value={formData.nativeLanguage}
                    onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {COMMON_NATIVE_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-purple-600" />
                    Target English Level
                  </label>
                  <select
                    value={formData.currentLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, currentLevel: e.target.value as EnglishLevel })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {CEFR_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* English Learning Goals */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-rose-600" />
                    English Learning Goals
                  </label>
                  <span className="text-[11px] text-slate-600">Select all that apply</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_GOALS.map((goal) => {
                    const active = formData.learningGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          active
                            ? 'bg-rose-50 border-rose-300 text-rose-800 font-semibold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interests & Conversation Passions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-amber-600" />
                    Interests (Topics You Love Discussing)
                  </label>
                  <span className="text-[11px] text-slate-600">
                    {formData.interests.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_INTERESTS.map((interest) => {
                    const active = formData.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                          active
                            ? 'bg-sky-50 border-sky-300 text-sky-800 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {active ? '✓ ' : ''}
                        {interest}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Interest input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newCustomInterest}
                    onChange={(e) => setNewCustomInterest(e.target.value)}
                    placeholder="Add custom interest (e.g., Chess, Scuba Diving, K-Drama)..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomInterest}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Bio & Intro Note for Partners */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-800">
                  Self-Introduction Bio for Speaking Partners
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell potential speaking partners a bit about yourself, how you like to practice, and when you are usually free..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              {/* Profile Card Lockup */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 text-2xl">
                    {profile.countryFlag}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{profile.fullName}</h3>
                    <span className="text-xs text-slate-500 font-mono">{profile.username}</span>
                  </div>

                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 mt-1">
                    <span>Native: <strong>{profile.nativeLanguage}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>English Target: <strong className="text-sky-700">{profile.currentLevel}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>{profile.country}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {profile.bio || 'No bio written yet. Click "Edit Profile" to introduce yourself!'}
                  </p>
                </div>
              </div>

              {/* Learning Progress Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="text-lg font-extrabold text-slate-900 font-mono">
                      {profile.speakingStreakDays}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Day Streak</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white text-center">
                  <div className="flex items-center justify-center gap-1 text-sky-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-lg font-extrabold text-slate-900 font-mono">
                      {profile.totalMinutesPracticed}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Mins Practiced</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-extrabold text-slate-900 font-mono">
                      {profile.partnerRatingAverage.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Partner Rating</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white text-center">
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-lg font-extrabold text-slate-900 font-mono">
                      {profile.badgesEarned.length}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Badges Earned</span>
                </div>
              </div>

              {/* English Learning Goals */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-rose-600" />
                  Learning Goals & Motivation
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.learningGoals.map((goal) => (
                    <span
                      key={goal}
                      className="px-3 py-1 text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 rounded-lg"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests & Conversation Passions */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-amber-600" />
                  Interests & Conversation Passions
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 text-xs font-medium bg-sky-50 text-sky-800 border border-sky-100 rounded-lg"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Badges Earned */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Community Endorsements
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.badgesEarned.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200 rounded-lg flex items-center gap-1"
                    >
                      <span>★</span>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
