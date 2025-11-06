// ChatInterface Component
// Maps to: docs/missions/mission-deck/AC.md F4 (Rafael Workspace Chat)
// Implements: Chat with message list, code blocks with syntax highlighting, Copy Code button

'use client';

import { useState } from 'react';
import type { ChatMessage, CodeBlock } from '../types';
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
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] ${
                message.role === 'system'
                  ? 'w-full text-center'
                  : message.role === 'user'
                  ? 'bg-accent text-background'
                  : 'bg-surface text-text'
              } rounded-lg p-4`}
            >
              {/* Role label (for assistant/system) */}
              {message.role !== 'user' && (
                <div className="text-xs font-semibold mb-2 text-accent">
                  {message.role === 'system' ? 'SYSTEM' : 'RAFAEL'}
                </div>
              )}

              {/* Message content */}
              <div className="whitespace-pre-wrap text-sm">
                {message.content}
              </div>

              {/* Code blocks */}
              {message.code_blocks && message.code_blocks.length > 0 && (
                <div className="mt-4 space-y-4">
                  {message.code_blocks.map((block, index) => (
                    <CodeBlockDisplay key={index} block={block} />
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <div className="text-xs opacity-60 mt-2">
                {formatTime(message.created_at)}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface text-text rounded-lg p-4">
              <div className="text-xs font-semibold mb-2 text-accent">
                RAFAEL
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-75" />
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-150" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Rafael for help..."
            className="flex-1 input"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="bg-background rounded-md overflow-hidden">
      {/* Code header */}
      <div className="flex items-center justify-between bg-surface-hover px-3 py-2 border-b border-border">
        <span className="text-xs font-mono text-muted">{block.filename}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-accent hover:text-accent/80 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy Code'}
        </button>
      </div>

      {/* Code content */}
      <div className="text-xs">
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

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
}
