// EmmaWorkspace Component
// Maps to: docs/automation/04_emma_rss_auto_send.md
// Implements: Lead discovery, proposal generation, confidence-based auto-send

'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { ChatMessage, Lead, Proposal } from '../../types';
import { ChatInterface } from './ChatInterface';

interface EmmaWorkspaceProps {
  missionId: string;
}

export function EmmaWorkspace({ missionId }: EmmaWorkspaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [missionId]);

  const loadData = async () => {
    try {
      const [messagesData, leadsData, proposalsData] = await Promise.all([
        api.getMessages(missionId),
        api.getLeads(missionId),
        api.getProposals(missionId),
      ]);
      setMessages(messagesData);
      setLeads(leadsData);
      setProposals(proposalsData);
    } catch (error) {
      console.error('Failed to load Emma workspace data:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await api.sendMessage(missionId, message);
      // Reload messages to get updated chat history
      const updatedMessages = await api.getMessages(missionId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'var(--slk-success)';
    if (confidence >= 60) return 'var(--slk-warning)';
    return 'var(--slk-muted)';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'auto_sent': return 'var(--slk-success)';
      case 'pending_approval': return 'var(--slk-warning)';
      case 'rejected': return 'var(--slk-danger)';
      case 'approved': return 'var(--slk-accent)';
      default: return 'var(--slk-muted)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top panel: Leads Feed */}
      <div style={{ height: '30%', borderBottom: '1px solid var(--slk-border)', overflowY: 'auto' }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slk-text)' }}>
              Lead Discovery
            </h3>
            <span style={{ fontSize: '14px', color: 'var(--slk-muted)' }}>
              {leads.length} leads monitored
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leads.length === 0 && (
              <div style={{ color: 'var(--slk-muted)', fontSize: '14px', padding: '12px', background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px' }}>
                No leads discovered yet. Emma monitors RSS feeds automatically.
              </div>
            )}
            {leads.map((lead) => (
              <div
                key={lead.id}
                style={{ background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px', padding: '16px', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--slk-surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--slk-surface)'}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slk-text)', marginBottom: '4px' }}>
                      {lead.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--slk-muted)', lineHeight: '1.5' }}>
                      {lead.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', marginLeft: '12px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: getConfidenceColor(lead.confidence) }}>
                      {lead.confidence}%
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--slk-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      confidence
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--slk-muted)' }}>
                  <span>Source: {lead.source}</span>
                  <span>{formatTime(lead.discoveredAt)}</span>
                </div>
                {lead.reason && (
                  <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(30, 229, 184, 0.05)', borderLeft: '2px solid var(--slk-accent)', fontSize: '12px', color: 'var(--slk-muted)' }}>
                    {lead.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle panel: Proposals */}
      <div style={{ height: '30%', borderBottom: '1px solid var(--slk-border)', overflowY: 'auto' }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slk-text)' }}>
              Proposals
            </h3>
            <span style={{ fontSize: '14px', color: 'var(--slk-muted)' }}>
              {proposals.filter(p => p.status === 'auto_sent').length} auto-sent
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {proposals.length === 0 && (
              <div style={{ color: 'var(--slk-muted)', fontSize: '14px', padding: '12px', background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px' }}>
                No proposals generated yet
              </div>
            )}
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                style={{ background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px', padding: '16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slk-text)', marginBottom: '4px' }}>
                      {proposal.jobTitle}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--slk-muted)', lineHeight: '1.5', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {proposal.proposalText}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', marginLeft: '12px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: getConfidenceColor(proposal.confidence) }}>
                      {proposal.confidence}%
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: getStatusColor(proposal.status),
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '2px 6px',
                      background: `${getStatusColor(proposal.status)}15`,
                      borderRadius: '3px'
                    }}>
                      {proposal.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--slk-muted)', marginTop: '8px' }}>
                  <span>Budget: ${proposal.budget}</span>
                  <span>{formatTime(proposal.generatedAt)}</span>
                </div>
                {proposal.decision && (
                  <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(30, 229, 184, 0.05)', borderLeft: '2px solid var(--slk-accent)', fontSize: '12px', color: 'var(--slk-muted)' }}>
                    <strong>Decision:</strong> {proposal.decision}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom panel: Chat with Emma */}
      <div style={{ height: '40%' }}>
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
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
