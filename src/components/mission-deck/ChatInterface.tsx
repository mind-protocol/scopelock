// ChatInterface Component
// Maps to: docs/missions/mission-deck/AC.md F4 (Rafael Workspace Chat)
// Implements: Chat with message list, code blocks with syntax highlighting, Copy Code button

'use client';

import { useState } from 'react';
import type { ChatMessage, CodeBlock } from '../../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue;
    setInputValue('');
    await onSendMessage(message);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Message list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                width: message.role === 'system' ? '100%' : 'auto',
                textAlign: message.role === 'system' ? 'center' : 'left',
                background: message.role === 'user' ? 'var(--slk-accent)' : 'var(--slk-surface)',
                color: message.role === 'user' ? 'var(--slk-bg)' : 'var(--slk-text)',
                borderRadius: '8px',
                padding: '16px'
              }}
            >
              {/* Role label (for assistant/system) */}
              {message.role !== 'user' && (
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--slk-accent)' }}>
                  {message.role === 'system' ? 'SYSTEM' : 'RAFAEL'}
                </div>
              )}

              {/* Message content */}
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
              </div>

              {/* Code blocks */}
              {message.code_blocks && message.code_blocks.length > 0 && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {message.code_blocks.map((block, index) => (
                    <CodeBlockDisplay key={index} block={block} />
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '8px' }}>
                {formatTime(message.created_at)}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'var(--slk-surface)', color: 'var(--slk-text)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--slk-accent)' }}>
                RAFAEL
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--slk-accent)', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ width: '8px', height: '8px', background: 'var(--slk-accent)', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out infinite 0.15s' }} />
                <div style={{ width: '8px', height: '8px', background: 'var(--slk-accent)', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out infinite 0.3s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{ borderTop: '1px solid var(--slk-border)', padding: '16px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Rafael for help..."
            style={{
              flex: 1,
              padding: '10px 16px',
              background: 'var(--slk-surface)',
              color: 'var(--slk-text)',
              border: '1px solid var(--slk-border)',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none'
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            style={{
              padding: '10px 16px',
              background: 'var(--slk-accent)',
              color: 'var(--slk-bg)',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: isLoading || !inputValue.trim() ? 0.5 : 1
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

function CodeBlockDisplay({ block }: { block: CodeBlock }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: 'var(--slk-bg)', borderRadius: '4px', overflow: 'hidden' }}>
      {/* Code header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--slk-surface-hover)', padding: '8px 12px', borderBottom: '1px solid var(--slk-border)' }}>
        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--slk-muted)' }}>{block.filename}</span>
        <button
          onClick={handleCopy}
          style={{ fontSize: '12px', color: 'var(--slk-accent)', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
        >
          {copied ? '✓ Copied' : 'Copy Code'}
        </button>
      </div>

      {/* Code content */}
      <div style={{ fontSize: '12px' }}>
        <SyntaxHighlighter
          language={block.language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
          }}
        >
          {block.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function formatTime(isoString: string | undefined): string {
  if (!isoString) return '';

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  } catch (error) {
    return '';
  }
}
