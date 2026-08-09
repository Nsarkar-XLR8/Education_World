'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VoiceControl() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check SpeechRecognition support
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript.toLowerCase();
      setTranscript(text);

      if (text.includes('book')) {
        router.push('/books');
      } else if (text.includes('tuition')) {
        router.push('/tuition');
      } else if (text.includes('game') || text.includes('kids')) {
        router.push('/kids');
      } else if (text.includes('snake')) {
        router.push('/kids/snake');
      } else if (text.includes('abroad')) {
        router.push('/study-abroad');
      } else if (text.includes('cart')) {
        router.push('/cart');
      } else if (text.includes('dashboard') || text.includes('home')) {
        router.push('/dashboard');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, router]);

  return (
    <div>
      <button
        className={`voice-btn ${isListening ? 'listening' : ''}`}
        onClick={() => setIsListening(!isListening)}
        title="Voice Navigation (Web Speech API)"
      >
        🎙️
      </button>

      {isListening && transcript && (
        <div
          style={{
            position: 'fixed',
            bottom: 'var(--space-20)',
            right: 'var(--space-8)',
            background: 'var(--surface-white)',
            border: '1px solid var(--border)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 'var(--z-sticky)',
            fontSize: 'var(--text-sm)',
          }}
        >
          Listening: &quot;{transcript}&quot;
        </div>
      )}
    </div>
  );
}
