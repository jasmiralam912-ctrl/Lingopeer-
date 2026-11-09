import React, { useState } from 'react';
import { 
  Sparkles, Shuffle, Volume2, Copy, Check, MessageSquare, 
  Lightbulb, BookOpen, Compass, Play, Plus, X, 
  Clock, ArrowRight, ArrowLeft, VolumeX 
} from 'lucide-react';
import { TOPIC_DATABASE, GeneratedTopic } from '../data/mockTopics';
import { speakEnglish, stopSpeaking } from '../utils/speech';

interface TopicGeneratorProps {
  onSelectTopicForPractice: (topic: GeneratedTopic) => void;
}

export const TopicGenerator: React.FC<TopicGeneratorProps> = ({ onSelectTopicForPractice }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [currentTopic, setCurrentTopic] = useState<GeneratedTopic>(TOPIC_DATABASE[0]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [showAddCustom, setShowAddCustom] = useState<boolean>(false);

  // Quick 60-second practice timer
  const [turnTimerSeconds, setTurnTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Custom Topic Form state
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<'Travel Experiences' | 'Favorite Hobbies' | 'Current Events' | 'Dream Jobs'>('Travel Experiences');
  const [customLevel, setCustomLevel] = useState<'Beginner (A1-A2)' | 'Intermediate (B1-B2)' | 'Advanced (C1-C2)'>('Beginner (A1-A2)');
  const [customQuestions, setCustomQuestions] = useState('');

  const categories = [
    'All',
    'Travel Experiences',
    'Favorite Hobbies',
    'Current Events',
    'Dream Jobs',
    'IELTS Prep',
  ];

  const levels = [
    'All',
    'Beginner (A1-A2)',
    'Intermediate (B1-B2)',
    'Advanced (C1-C2)',
  ];

  const filteredTopics = TOPIC_DATABASE.filter((t) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || t.level === selectedLevel;
    return matchesCategory && matchesLevel;
  });

  const handleShuffle = () => {
    setIsShuffling(true);
    stopSpeaking();
    setIsSpeaking(false);
    setIsTimerRunning(false);
    setTurnTimerSeconds(60);
    setActiveQuestionIdx(0);

    const pool = filteredTopics.length > 0 ? filteredTopics : TOPIC_DATABASE;
    let nextTopic = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && nextTopic.id === currentTopic.id) {
      const remaining = pool.filter((t) => t.id !== currentTopic.id);
      nextTopic = remaining[Math.floor(Math.random() * remaining.length)];
    }

    setTimeout(() => {
      setCurrentTopic(nextTopic);
      setIsShuffling(false);
    }, 200);
  };

  const handleReadQuestions = async () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    const textToRead = `${currentTopic.title}. Question: ${currentTopic.questions[activeQuestionIdx % currentTopic.questions.length]}`;
    await speakEnglish(textToRead, 'british');
    setIsSpeaking(false);
  };

  const handleCopy = () => {
    const fullText = `Conversation Topic: ${currentTopic.title} (${currentTopic.level})\n\nQuestions:\n${currentTopic.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nIcebreaker: ${currentTopic.icebreaker}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const qList = customQuestions
      .split('\n')
      .map((q) => q.trim())
      .filter(Boolean);

    const newTopic: GeneratedTopic = {
      id: `custom-${Date.now()}`,
      category: customCategory,
      level: customLevel,
      title: customTitle.trim(),
      description: 'Custom discussion topic crafted by learner.',
      questions: qList.length > 0 ? qList : ['What is your primary perspective on this topic?'],
      vocabulary: [
        { word: 'perspective', ipa: '/pəˈspek.tɪv/', meaning: 'a particular attitude toward or way of regarding something', exampleSentence: 'Everyone brings a distinct perspective to the table.' },
      ],
      icebreaker: 'What inspired your interest in this subject?',
      speakingTip: 'Remember to ask your partner follow-up questions to keep the discussion interactive.',
    };

    setCurrentTopic(newTopic);
    setShowAddCustom(false);
    setCustomTitle('');
    setCustomQuestions('');
    setActiveQuestionIdx(0);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700">
            <Compass className="w-4 h-4 text-sky-600" />
            <span>Interactive Conversation Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Conversation Topic Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Level-calibrated speaking prompts with example questions for <strong>travel experiences</strong>, <strong>favorite hobbies</strong>, <strong>current events</strong>, and <strong>dream jobs</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddCustom(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom</span>
          </button>

          <button
            type="button"
            onClick={handleShuffle}
            disabled={isShuffling}
            className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-sm flex items-center gap-2 group active:scale-95"
          >
            <Shuffle className={`w-4 h-4 transition-transform duration-300 ${isShuffling ? 'rotate-180' : 'group-hover:rotate-45'}`} />
            <span>Shuffle New Topic</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Category Tabs */}
        <div className="md:col-span-8 flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level Selector */}
        <div className="md:col-span-4 flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl">
          {levels.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevel(lvl)}
              className={`flex-1 px-2 py-1.5 text-[11px] font-medium rounded-lg whitespace-nowrap text-center transition-colors ${
                selectedLevel === lvl
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lvl.replace(' (A1-A2)', '').replace(' (B1-B2)', '').replace(' (C1-C2)', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Showcase Topic Card */}
      <div className={`p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6 transition-all duration-200 ${
        isShuffling ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'
      }`}>
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5">
              <span className="font-semibold text-sky-700">{currentTopic.category}</span>
              <span aria-hidden="true">·</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                {currentTopic.level}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentTopic.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {currentTopic.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReadQuestions}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                isSpeaking
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
              <span>{isSpeaking ? 'Playing Audio...' : 'Listen Pronunciation'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5"
              title="Copy topic & questions"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Icebreaker Warmup */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
              1-Minute Icebreaker Warmup
            </div>
            <p className="text-sm font-medium text-amber-950 mt-0.5">
              &ldquo;{currentTopic.icebreaker}&rdquo;
            </p>
          </div>
        </div>

        {/* Featured Interactive Question Spotlight */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Focus Question #{activeQuestionIdx + 1} of {currentTopic.questions.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveQuestionIdx((prev) =>
                    prev === 0 ? currentTopic.questions.length - 1 : prev - 1
                  )
                }
                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Previous Question"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-300">
                {activeQuestionIdx + 1}/{currentTopic.questions.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveQuestionIdx((prev) => (prev + 1) % currentTopic.questions.length)
                }
                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Next Question"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-lg sm:text-xl font-bold text-slate-100 py-1">
            &ldquo;{currentTopic.questions[activeQuestionIdx % currentTopic.questions.length]}&rdquo;
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Suggested speaking time: <strong>1 to 2 minutes per person</strong></span>
            </div>

            <button
              type="button"
              onClick={handleReadQuestions}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold underline flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Hear native pronunciation</span>
            </button>
          </div>
        </div>

        {/* All Example Discussion Questions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-sky-600" />
              All Example Questions for this Topic ({currentTopic.questions.length})
            </h4>
            <span className="text-xs text-slate-600">Click any question to highlight</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentTopic.questions.map((q, idx) => {
              const isSelected = idx === activeQuestionIdx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveQuestionIdx(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-sky-50/80 border-sky-400 shadow-xs'
                      : 'border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <p className={`text-sm leading-snug ${isSelected ? 'font-semibold text-sky-950' : 'text-slate-800'}`}>
                    {q}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Target Vocabulary & Idioms */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Key Vocabulary, Phrasal Verbs & Collocations
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentTopic.vocabulary.map((v) => (
              <div
                key={v.word}
                className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{v.word}</span>
                  <span className="text-xs font-mono text-slate-400">{v.ipa}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{v.meaning}</p>
                <div className="text-[11px] text-sky-700 italic bg-sky-50 p-2 rounded-md border border-sky-100">
                  &ldquo;{v.exampleSentence}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Speaking Strategy Tip & Practice CTA */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Coach Speaking Tip
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {currentTopic.speakingTip}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectTopicForPractice(currentTopic)}
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Practice This Topic with a Partner</span>
          </button>
        </div>
      </div>

      {/* Custom Topic Modal */}
      {showAddCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Add Your Own Conversation Topic</h3>
              <button
                onClick={() => setShowAddCustom(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Topic Title</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., Solo Travel Adventures or Favorite Video Game Lore"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="Travel Experiences">Travel Experiences</option>
                    <option value="Favorite Hobbies">Favorite Hobbies</option>
                    <option value="Current Events">Current Events</option>
                    <option value="Dream Jobs">Dream Jobs</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Target Level</label>
                  <select
                    value={customLevel}
                    onChange={(e) => setCustomLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="Beginner (A1-A2)">Beginner (A1-A2)</option>
                    <option value="Intermediate (B1-B2)">Intermediate (B1-B2)</option>
                    <option value="Advanced (C1-C2)">Advanced (C1-C2)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Example Discussion Questions (One per line)
                </label>
                <textarea
                  rows={4}
                  value={customQuestions}
                  onChange={(e) => setCustomQuestions(e.target.value)}
                  placeholder="Where was the most fascinating place you explored?&#10;What was an unexpected challenge you overcame?&#10;How did the experience shape your perspective?"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
                >
                  Save & Load Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
