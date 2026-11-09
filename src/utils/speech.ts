// Web Speech API utility for interactive speaking practice

export function speakEnglish(text: string, voiceType: 'british' | 'american' = 'british'): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly measured for English learners
    utterance.pitch = 1.0;

    // Try to find matching accent voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    
    let preferredVoice = englishVoices.find(v => 
      voiceType === 'british' ? v.lang.includes('GB') : v.lang.includes('US')
    ) || englishVoices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export interface SpeechRecognizerWrapper {
  start: () => void;
  stop: () => void;
  isSupported: boolean;
}

export function createSpeechRecognizer(
  onTranscript: (transcript: string, isFinal: boolean) => void,
  onError?: (error: string) => void
): SpeechRecognizerWrapper {
  if (typeof window === 'undefined') {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }
    if (final) {
      onTranscript(final.trim(), true);
    } else if (interim) {
      onTranscript(interim.trim(), false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    if (onError && event.error !== 'no-speech') {
      onError(event.error);
    }
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch {
        // already started
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch {
        // already stopped
      }
    },
    isSupported: true,
  };
}
