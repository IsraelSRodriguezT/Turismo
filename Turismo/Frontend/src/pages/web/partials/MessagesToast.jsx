import React, { useEffect } from 'react';

export default function MessagesToast({ messages = [], onClear }) {
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        if (onClear) onClear();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [messages, onClear]);

  if (!messages.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg font-body-md text-body-md ${
            msg.tags === 'error'
              ? 'bg-error-container text-on-error-container border-error/20'
              : 'bg-primary-fixed text-on-primary-fixed border-primary/20'
          }`}
        >
          <span className={`material-symbols-outlined ${msg.tags === 'error' ? 'text-error' : 'text-primary'}`}>
            {msg.tags === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="flex-1">{msg.text}</span>
          <button onClick={onClear} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
