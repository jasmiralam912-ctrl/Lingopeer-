import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, PhoneOff, Volume2, Sparkles, Send, 
  BookOpen, Clock, MessageSquare, Plus, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { SpeakingPartner, TopicCard, SessionMessage, SessionNote } from '../types';
import { TOPIC_CARDS } from '../data/mockPartners';
import { speakEnglish, stopSpeaking, createSpeechRecognizer, SpeechRecognizerWrapper } from '../utils/speech';

interface LiveSpeakingRoomProps {
  partner: SpeakingPartner;
  initialTopic?: TopicCard;
  isOpen: boolean;
  onEndCall: (durationMinutes: number) => void;
}

export const LiveSpeakingRoom: React.FC<LiveSpeakingRoomProps> = ({
  partner,
  initialTopic = TOPIC_CARDS[0],
  isOpen,
  onEndCall,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isPartnerSpeaking, setIsPartnerSpeaking] = useState<boolean>(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);
  const [activeTopic, setActiveTopic] = useState<TopicCard>(initialTopic);
  const [topicIndex, setTopicIndex] = useState<number>(0);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  
  // Real-time transcribed text
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [typedMessage, setTypedMessage] = useState<string>('');
  
  // Messages & Live Notes
  const [messages, setMessages] = useState<SessionMessage[]>([
    {
      id: 'msg-0',
      sender: 'system',
      speakerName: 'LingoPeer Session',
      text: `Connected with ${partner.name}. Recommended format: 5 minutes Speaker A, 5 minutes Speaker B. Feel free to use the topic questions!`,
      timestamp: '00:00',
    },
    {
      id: 'msg-1',
      sender: 'partner',
      speakerName: partner.name,
      text: `Hi there! So great to connect with you. How is your day going? We can start with "${initialTopic.title}".`,
      timestamp: '00:05',
    },
  ]);

  const [notes, setNotes] = useState<SessionNote[]>([
    {
      id: 'note-1',
      author: partner.name,
      type: 'idea',
      note: 'Good job using "furthermore" to connect your arguments!',
      timestamp: '01:10',
    },
  ]);

  const [newNoteInput, setNewNoteInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognizerRef = useRef<SpeechRecognizerWrapper | null>(null);

  // Timer interval
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Initial partner speech greeting
  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(() => {
      handlePartnerSpeak(
        `Hi there! Great to meet you. Let's discuss "${activeTopic.title}". Whenever you are ready, feel free to answer the first question!`
      );
    }, 1200);
    return () => clearTimeout(timeout);
  }, [isOpen, activeTopic.title]);

  // Speech Recognition setup
  useEffect(() => {
    if (!isOpen) return;

    const recognizer = createSpeechRecognizer((transcript, isFinal) => {
      setLiveTranscript(transcript);
      setIsUserSpeaking(true);
      if (isFinal) {
        setIsUserSpeaking(false);
        // Automatically add user speech to transcript
        const newMsg: SessionMessage = {
          id: `msg-${Date.now()}`,
          sender: 'me',
          speakerName: 'You',
          text: transcript,
          timestamp: formatTime(secondsElapsed),
        };
        setMessages((prev) => [...prev, newMsg]);
        setLiveTranscript('');

        // Trigger simulated partner conversational reply after 1.8 seconds
        triggerPartnerReply(transcript);
      }
    });

    recognizerRef.current = recognizer;
    if (isMicOn && recognizer.isSupported) {
      recognizer.start();
    }

    return () => {
      recognizer.stop();
      stopSpeaking();
    };
  }, [isOpen, isMicOn, secondsElapsed]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveTranscript]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const toggleMic = () => {
    if (isMicOn) {
      recognizerRef.current?.stop();
      setIsMicOn(false);
      setIsUserSpeaking(false);
    } else {
      recognizerRef.current?.start();
      setIsMicOn(true);
    }
  };

  const handlePartnerSpeak = async (text: string) => {
    setIsPartnerSpeaking(true);
    await speakEnglish(text, partner.country === 'United Kingdom' ? 'british' : 'american');
    setIsPartnerSpeaking(false);
  };

  const triggerPartnerReply = (userSpokenText: string) => {
    setTimeout(() => {
      const partnerReplies = [
        `That is such a thoughtful perspective! In fact, when I think about ${activeTopic.title.toLowerCase()}, I notice a similar thing. What advice would you give someone in that situation?`,
        `I love that phrase you used. Your pronunciation was super clear. By the way, how does that compare to what people usually do in your country?`,
        `Really interesting point! Let's check question #${(questionIndex % activeTopic.questions.length) + 1}: "${activeTopic.questions[questionIndex % activeTopic.questions.length]}"`,
      ];
      const reply = partnerReplies[Math.floor(Math.random() * partnerReplies.length)];

      const partnerMsg: SessionMessage = {
        id: `msg-${Date.now()}`,
        sender: 'partner',
        speakerName: partner.name,
        text: reply,
        timestamp: formatTime(secondsElapsed + 2),
      };

      setMessages((prev) => [...prev, partnerMsg]);
      handlePartnerSpeak(reply);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsg: SessionMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      speakerName: 'You',
      text: typedMessage.trim(),
      timestamp: formatTime(secondsElapsed),
    };
    setMessages((prev) => [...prev, newMsg]);
    const sentText = typedMessage;
    setTypedMessage('');
    triggerPartnerReply(sentText);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    setNotes((prev) => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        author: 'You',
        type: 'correction',
        note: newNoteInput.trim(),
        timestamp: formatTime(secondsElapsed),
      },
    ]);
    setNewNoteInput('');
  };

  const handleNextTopic = () => {
    const nextIdx = (topicIndex + 1) % TOPIC_CARDS.length;
    setTopicIndex(nextIdx);
    setActiveTopic(TOPIC_CARDS[nextIdx]);
    setQuestionIndex(0);
    const switchMsg: SessionMessage = {
      id: `msg-${Date.now()}`,
      sender: 'system',
      speakerName: 'Topic Switched',
      text: `New Topic: "${TOPIC_CARDS[nextIdx].title}" (${TOPIC_CARDS[nextIdx].category})`,
      timestamp: formatTime(secondsElapsed),
    };
    setMessages((prev) => [...prev, switchMsg]);
  };

  const handleNextQuestion = () => {
    const nextQ = (questionIndex + 1) % activeTopic.questions.length;
    setQuestionIndex(nextQ);
  };

  const handleEndSession = () => {
    stopSpeaking();
    recognizerRef.current?.stop();
    const durationMinutes = Math.max(1, Math.round(secondsElapsed / 60));
    onEndCall(durationMinutes);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Session Control Header */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{partner.name}</span>
              <span className="text-base">{partner.flag}</span>
              <span className="text-xs text-slate-400">· {partner.level}</span>
            </div>
            <div className="text-xs text-slate-400">
              Active Topic: <span className="text-sky-400 font-medium">{activeTopic.title}</span>
            </div>
          </div>
        </div>

        {/* Live Call Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono font-medium">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span>{formatTime(secondsElapsed)}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleNextTopic}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <span>Next Topic Card</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleEndSession}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End & Rate Session</span>
          </button>
        </div>
      </div>

      {/* Main Split Body: Video/Audio Cards (Left) & Conversation Tools (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Stage (Col 7): The Speaking Stage */}
        <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
          {/* Dual Participant Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 items-stretch">
            {/* 1. Speaking Partner Video/Audio Card */}
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 shadow-xl">
              <div className="relative mb-3">
                <img
                  src={partner.avatar}
                  alt={partner.name}
                  referrerPolicy="no-referrer"
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 transition-all duration-300 ${
                    isPartnerSpeaking ? 'border-sky-500 scale-105 shadow-lg shadow-sky-500/20' : 'border-slate-700'
                  }`}
                />
                <span className="absolute bottom-1 right-1 text-2xl drop-shadow-sm">{partner.flag}</span>
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-bold text-white text-base">{partner.name}</h3>
                <p className="text-xs text-slate-400">{partner.nativeLanguage} · {partner.role}</p>
              </div>

              {/* Live Audio Visualizer Bars */}
              <div className="flex items-center gap-1 mt-4 h-6">
                {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isPartnerSpeaking
                        ? 'bg-sky-400 animate-pulse'
                        : 'bg-slate-700 h-2'
                    }`}
                    style={{
                      height: isPartnerSpeaking ? `${Math.sin(bar * 0.9 + secondsElapsed * 3) * 12 + 14}px` : '6px',
                    }}
                  />
                ))}
              </div>

              <span className={`mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                isPartnerSpeaking ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-500'
              }`}>
                {isPartnerSpeaking ? 'Partner Speaking...' : 'Listening attentively'}
              </span>
            </div>

            {/* 2. Learner ("You") Audio/Video Card */}
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 shadow-xl">
              <div className="relative mb-3">
                <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-800 border-4 flex items-center justify-center transition-all duration-300 ${
                  isUserSpeaking ? 'border-emerald-500 scale-105 shadow-lg shadow-emerald-500/20' : 'border-slate-700'
                }`}>
                  <span className="text-3xl font-bold text-slate-300">YOU</span>
                </div>
                <span className="absolute bottom-1 right-1 text-2xl drop-shadow-sm">🇺🇸</span>
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-bold text-white text-base">You (Learner)</h3>
                <p className="text-xs text-slate-400">Target Level: B2 / C1 English</p>
              </div>

              {/* Live Audio Visualizer Bars */}
              <div className="flex items-center gap-1 mt-4 h-6">
                {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isUserSpeaking
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-slate-700 h-2'
                    }`}
                    style={{
                      height: isUserSpeaking ? `${Math.sin(bar * 0.8 + secondsElapsed * 4) * 12 + 14}px` : '6px',
                    }}
                  />
                ))}
              </div>

              <span className={`mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                !isMicOn
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : isUserSpeaking
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-500'
              }`}>
                {!isMicOn ? 'Microphone Muted' : isUserSpeaking ? 'Speaking Now...' : 'Mic Active (Speak in English)'}
              </span>
            </div>
          </div>

          {/* Active Conversation Prompt Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Discussion Prompt #{questionIndex + 1}
              </span>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="text-slate-400 hover:text-white underline text-xs"
              >
                Next question ({questionIndex + 1}/{activeTopic.questions.length})
              </button>
            </div>
            <p className="text-sm font-medium text-slate-100">
              &ldquo;{activeTopic.questions[questionIndex % activeTopic.questions.length]}&rdquo;
            </p>
          </div>

          {/* Real-Time Live Speech Transcription Box */}
          {liveTranscript && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="italic">&ldquo;{liveTranscript}...&rdquo;</span>
            </div>
          )}

          {/* Bottom Floating Mic & Interaction Toolbar */}
          <div className="flex items-center justify-center gap-4 py-2">
            <button
              type="button"
              onClick={toggleMic}
              className={`p-4 rounded-2xl transition-all shadow-lg flex items-center gap-2 ${
                isMicOn
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              <span className="text-xs font-bold">{isMicOn ? 'Mic Live' : 'Mic Off'}</span>
            </button>

            <button
              type="button"
              onClick={() => handlePartnerSpeak(activeTopic.questions[questionIndex % activeTopic.questions.length])}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-sky-400" />
              <span>Partner Reads Question</span>
            </button>
          </div>
        </div>

        {/* Right Stage (Col 5): Live Transcript, Topic Vocabulary, and Correction Pad */}
        <div className="lg:col-span-5 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden">
          {/* Tabs / Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span>Conversation & Corrections</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {messages.length} messages
            </span>
          </div>

          {/* Vocabulary Card Preview */}
          <div className="p-3 bg-slate-950/70 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Topic Vocabulary ({activeTopic.title})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeTopic.suggestedVocab.map((v) => (
                <div
                  key={v.word}
                  className="px-2 py-1 rounded-md bg-slate-800 text-[11px] border border-slate-700 hover:border-slate-600 group relative cursor-help"
                >
                  <span className="font-semibold text-slate-200">{v.word}</span>{' '}
                  <span className="text-slate-400 font-mono text-[10px]">{v.ipa}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat & Live Dialogue Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => {
              const isMe = msg.sender === 'me';
              const isSys = msg.sender === 'system';
              if (isSys) {
                return (
                  <div key={msg.id} className="text-center py-1">
                    <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full">
                      {msg.text}
                    </span>
                  </div>
                );
              }
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                    <span>{msg.speakerName}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-sky-600 text-white rounded-br-xs'
                        : 'bg-slate-800 text-slate-200 rounded-bl-xs border border-slate-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Partner Notes & Corrections */}
            {notes.length > 0 && (
              <div className="pt-2 border-t border-slate-800/60 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-time Corrections & Notes:</span>
                </div>
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-200 space-y-0.5"
                  >
                    <div className="font-semibold text-amber-300">From {n.author}:</div>
                    <div>{n.note}</div>
                  </div>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Note input (Partner feedback / correction) */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
            <form onSubmit={handleAddNote} className="flex items-center gap-2">
              <input
                type="text"
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="Drop a note / correction (e.g. 'say I agree instead of I am agree')..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
                title="Add Note"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Chat text message fallback */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Or type a message to your partner..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-colors shadow-sm"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
