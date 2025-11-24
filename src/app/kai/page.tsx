// Kai - The Orchestrator
// Full-page chat interface for ScopeLock's orchestrator AI

'use client';

import { useState, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';
import { api } from '../../lib/api';
import type { ChatMessage } from '../../types';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'system',
  content: 'Kai is online. I orchestrate the ScopeLock team - coordinating Emma, Inna, Rafael, Sofia, Maya, and Alexis to deliver your projects. How can I help?',
  created_at: new Date().toISOString(),
};

export default function KaiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load existing messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const existingMessages = await api.getMessages('kai');
        if (existingMessages.length > 0) {
          setMessages(existingMessages);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Keep welcome message if load fails
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message to Kai via backend API
      const response = await api.sendMessage('kai', userMessage.content);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        code_blocks: response.code_blocks,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Show error message to user
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message. Please try again.'}`,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--slk-bg)',
      color: 'var(--slk-text)',
    }}>
      {/* Header */}
      <header style={{
        padding: '12px 24px',
        borderBottom: '1px solid rgba(230, 234, 242, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--slk-surface)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: 'var(--slk-muted)', textDecoration: 'none', fontSize: '14px' }}>
            &larr; ScopeLock
          </Link>
          <div style={{ width: '1px', height: '20px', background: 'rgba(230, 234, 242, 0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--slk-accent) 0%, var(--slk-accent-2) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px',
              color: 'var(--slk-bg)',
            }}>
              K
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Kai</h1>
              <div style={{ fontSize: '12px', color: 'var(--slk-muted)' }}>The Orchestrator</div>
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          background: 'rgba(30, 229, 184, 0.1)',
          borderRadius: '20px',
          fontSize: '12px',
          color: 'var(--slk-accent)',
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--slk-accent)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          Online
        </div>
      </header>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '100%',
            }}
          >
            <div style={{
              maxWidth: message.role === 'system' ? '100%' : '75%',
              width: message.role === 'system' ? '100%' : 'auto',
            }}>
              {/* Role label */}
              {message.role !== 'user' && (
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  marginBottom: '6px',
                  color: message.role === 'system' ? 'var(--slk-muted)' : 'var(--slk-accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {message.role === 'system' ? 'System' : 'Kai'}
                </div>
              )}

              {/* Message bubble */}
              <div style={{
                padding: '14px 18px',
                borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: message.role === 'user'
                  ? 'var(--slk-accent)'
                  : message.role === 'system'
                    ? 'rgba(230, 234, 242, 0.05)'
                    : 'var(--slk-surface)',
                color: message.role === 'user' ? 'var(--slk-bg)' : 'var(--slk-text)',
                textAlign: message.role === 'system' ? 'center' : 'left',
              }}>
                <div style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '14px',
                  lineHeight: '1.6',
                }}>
                  {message.content}
                </div>

                {/* Code blocks */}
                {message.code_blocks && message.code_blocks.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {message.code_blocks.map((block, index) => (
                      <CodeBlock key={index} block={block} />
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div style={{
                  fontSize: '11px',
                  opacity: 0.5,
                  marginTop: '8px',
                  textAlign: message.role === 'user' ? 'right' : 'left',
                }}>
                  {formatTime(message.created_at)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                marginBottom: '6px',
                color: 'var(--slk-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Kai
              </div>
              <div style={{
                padding: '14px 18px',
                borderRadius: '16px 16px 16px 4px',
                background: 'var(--slk-surface)',
              }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--slk-accent)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--slk-accent)',
                    animation: 'pulse 1.5s ease-in-out infinite 0.15s',
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--slk-accent)',
                    animation: 'pulse 1.5s ease-in-out infinite 0.3s',
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '16px 24px 24px',
        borderTop: '1px solid rgba(230, 234, 242, 0.08)',
        background: 'var(--slk-surface)',
        flexShrink: 0,
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', maxWidth: '900px', margin: '0 auto' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message Kai..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '14px 20px',
              background: 'var(--slk-bg)',
              border: '1px solid rgba(230, 234, 242, 0.1)',
              borderRadius: '12px',
              color: 'var(--slk-text)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--slk-accent)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(230, 234, 242, 0.1)'}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            style={{
              padding: '14px 28px',
              background: isLoading || !inputValue.trim() ? 'rgba(30, 229, 184, 0.3)' : 'var(--slk-accent)',
              color: 'var(--slk-bg)',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Send
          </button>
        </form>
        <div style={{
          textAlign: 'center',
          marginTop: '12px',
          fontSize: '12px',
          color: 'var(--slk-muted)',
        }}>
          Kai coordinates Emma, Inna, Rafael, Sofia, Maya & Alexis
        </div>
      </div>

      {/* Pulse animation */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

function CodeBlock({ block }: { block: { language: string; code: string; filename?: string } }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: 'var(--slk-bg)',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: 'rgba(230, 234, 242, 0.05)',
        borderBottom: '1px solid rgba(230, 234, 242, 0.08)',
      }}>
        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--slk-muted)' }}>
          {block.filename || block.language}
        </span>
        <button
          onClick={handleCopy}
          style={{
            fontSize: '12px',
            color: 'var(--slk-accent)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div style={{ fontSize: '12px' }}>
        <SyntaxHighlighter
          language={block.language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '12px',
            background: 'transparent',
          }}
        >
          {block.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
