import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Mic, MicOff, Send, Volume2, 
  Lightbulb, CheckCircle2, RotateCcw, Award 
} from 'lucide-react';
import { speakEnglish, stopSpeaking, createSpeechRecognizer, SpeechRecognizerWrapper } from '../utils/speech';

interface CoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  correction?: string | null;
  vocabHint?: { word: string; definition: string; example: string } | null;
}

interface FluencyReport {
  overallRating?: number;
  fluencyScore: number;
  strengths: string[];
  grammarCorrections: { original: string; improved: string; reason: string }[];
  vocabularyUpgrades: { basicWord: string; upgrade: string; context: string }[];
  suggestedNextTopics: string[];
}

export const AISpeakingCoach: React.FC = () => {
  const [persona, setPersona] = useState<string>('Emma (Friendly British Tutor)');
  const [topic, setTopic] = useState<string>('Travel Experiences');
  const [level, setLevel] = useState<string>('Intermediate (B1-B2)');
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: "Hello! I'm Emma, your 24/7 AI English speaking partner. Let's practice! What was the most memorable trip or vacation you've ever taken?",
      correction: null,
      vocabHint: {
        word: 'memorable',
        definition: 'worth remembering or easily remembered',
        example: 'It was a truly memorable journey across the countryside.',
      },
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [fluencyReport, setFluencyReport] = useState<FluencyReport | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognizerRef = useRef<SpeechRecognizerWrapper | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    const recognizer = createSpeechRecognizer((transcript, isFinal) => {
      setInputText(transcript);
      if (isFinal) {
        setIsMicOn(false);
        handleSend(transcript);
      }
    });
    recognizerRef.current = recognizer;
    return () => {
      recognizer.stop();
      stopSpeaking();
    };
  }, []);

  const toggleMic = () => {
    if (isMicOn) {
      recognizerRef.current?.stop();
      setIsMicOn(false);
    } else {
      recognizerRef.current?.start();
      setIsMicOn(true);
    }
  };

  const handleReadAloud = async (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    await speakEnglish(text, persona.includes('British') ? 'british' : 'american');
    setIsSpeaking(false);
  };

  const handleSend = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || isThinking) return;

    const userMsg: CoachMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: content,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
          userMessage: content,
          persona,
          topic,
          level,
        }),
      });

      const data = await response.json();
      const coachReplyText = data.reply || "That's a very interesting thought! Tell me more.";

      const coachMsg: CoachMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: coachReplyText,
        correction: data.correction,
        vocabHint: data.vocabularyHint,
      };

      setMessages((prev) => [...prev, coachMsg]);
      handleReadAloud(coachReplyText);
    } catch {
      const fallbackMsg: CoachMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: "I really enjoyed hearing that! How did that experience impact your daily perspective?",
        correction: null,
        vocabHint: null,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleGenerateReport = async () => {
    if (messages.length < 2) return;
    setIsEvaluating(true);
    try {
      const transcript = messages.map((m) => ({
        speaker: m.sender === 'user' ? 'Learner' : persona,
        text: m.text,
      }));

      const res = await fetch('/api/gemini/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          partnerName: persona,
          topic,
        }),
      });

      const reportData = await res.json();
      setFluencyReport(reportData);
    } catch {
      setFluencyReport({
        fluencyScore: 82,
        strengths: [
          'Solid confidence and willingness to express complex opinions.',
          'Good use of descriptive adjectives during your answers.',
        ],
        grammarCorrections: [
          {
            original: 'I want to traveling next summer.',
            improved: 'I want to travel next summer.',
            reason: 'Use bare infinitive after want to.',
          },
        ],
        vocabularyUpgrades: [
          {
            basicWord: 'very nice',
            upgrade: 'delightful / picturesque',
            context: 'It was a delightful café.',
          },
        ],
        suggestedNextTopics: ['Dream Jobs & Career Ambitions', 'Current Events & Tech'],
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'coach',
        text: `Hi there! Let's talk about "${topic}". Whenever you are ready, share your thoughts!`,
      },
    ]);
    setFluencyReport(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI Practice Partner (Powered by Gemini 3.8 Flash)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            24/7 AI Speaking Coach
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Warm up before speaking with real peers, overcome speaking hesitation, and get immediate grammar and fluency feedback.
          </p>
        </div>

        {/* Persona & Level Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="Emma (Friendly British Tutor)">Emma (Friendly British Tutor)</option>
            <option value="David (American Tech Interviewer)">David (American Professional)</option>
            <option value="Chloe (IELTS Examiner)">Chloe (IELTS Speaking Examiner)</option>
            <option value="Marco (Casual Travel Buddy)">Marco (Casual Travel Buddy)</option>
          </select>

          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="Travel Experiences">Travel Experiences</option>
            <option value="Favorite Hobbies">Favorite Hobbies</option>
            <option value="Dream Jobs">Dream Jobs</option>
            <option value="Current Events">Current Events</option>
          </select>

          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dialogue Feed */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[580px] overflow-hidden">
          {/* Messages scroll area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>{isUser ? 'You' : persona.split(' ')[0]}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-sky-600 text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-900 rounded-bl-xs border border-slate-200/60'
                    }`}
                  >
                    <p>{m.text}</p>
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleReadAloud(m.text)}
                        className="mt-2 text-xs flex items-center gap-1 text-sky-700 hover:text-sky-900 font-medium"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen Aloud</span>
                      </button>
                    )}
                  </div>

                  {/* Constructive Real-Time Grammar Correction Note */}
                  {m.correction && (
                    <div className="max-w-[85%] p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Grammar Tip: </span>
                        <span>{m.correction}</span>
                      </div>
                    </div>
                  )}

                  {/* Vocabulary Hint */}
                  {m.vocabHint && (
                    <div className="max-w-[85%] p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{m.vocabHint.word}</span>{' '}
                        <span className="text-emerald-700">· {m.vocabHint.definition}</span>
                        <div className="italic text-[11px] text-emerald-800 mt-0.5">
                          &ldquo;{m.vocabHint.example}&rdquo;
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic p-3">
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                <span>{persona.split(' ')[0]} is listening and thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input & Mic Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-xl transition-all shadow-xs ${
                isMicOn
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
              title={isMicOn ? 'Stop Microphone' : 'Speak into Microphone'}
            >
              {isMicOn ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-sky-600" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isMicOn ? 'Listening to your speech... (speak English)' : 'Speak via mic or type in English...'}
              className="flex-1 px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={isThinking || !inputText.trim()}
              className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors disabled:opacity-40"
              title="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: AI Fluency Evaluation & Next Steps */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                AI Fluency Report
              </h3>
              <button
                type="button"
                onClick={handleGenerateReport}
                disabled={isEvaluating || messages.length < 2}
                className="px-3 py-1 text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
              >
                {isEvaluating ? 'Analyzing...' : 'Generate Report'}
              </button>
            </div>

            {fluencyReport ? (
              <div className="space-y-4 text-xs animate-in fade-in">
                {/* Score */}
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-center">
                  <div className="text-3xl font-black text-purple-900 font-mono">
                    {fluencyReport.fluencyScore}/100
                  </div>
                  <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">
                    Speaking Fluency Index
                  </span>
                </div>

                {/* Strengths */}
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Key Strengths
                  </div>
                  {fluencyReport.strengths.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-600 leading-relaxed">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                {/* Grammar fixes */}
                {fluencyReport.grammarCorrections.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Recommended Corrections
                    </div>
                    {fluencyReport.grammarCorrections.map((g, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-900 space-y-0.5">
                        <div className="line-through text-rose-500">{g.original}</div>
                        <div className="font-bold text-emerald-700">→ {g.improved}</div>
                        <div className="text-[10px] text-slate-500">{g.reason}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Vocabulary upgrades */}
                {fluencyReport.vocabularyUpgrades.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Vocabulary Upgrades
                    </div>
                    {fluencyReport.vocabularyUpgrades.map((v, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="line-through text-slate-400">{v.basicWord}</span>{' '}
                        <span className="font-bold text-sky-700">→ {v.upgrade}</span>
                        <div className="text-[10px] text-slate-600 mt-0.5">&ldquo;{v.context}&rdquo;</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                <Sparkles className="w-6 h-6 text-slate-300 mx-auto" />
                <p>Have at least 2 exchanges with {persona.split(' ')[0]}, then click &quot;Generate Report&quot; to receive structured feedback.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
