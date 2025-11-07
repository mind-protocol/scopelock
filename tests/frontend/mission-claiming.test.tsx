/**
 * Frontend Tests: Mission Claiming UI Flow (T6)
 * Maps to: AC.md F4, F5 (Mission listing, claiming, completion)
 * Mission: mission-deck-compensation
 * Framework: Vitest + React Testing Library
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MissionCard } from '@/components/compensation/MissionCard';
import { MissionList } from '@/components/compensation/MissionList';
import { MissionFundBalance } from '@/components/compensation/MissionFundBalance';
import userEvent from '@testing-library/user-event';


describe('Mission Claiming UI Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Test: Mission card displays correctly
   * Maps to: VALIDATION.md T6.1, AC.md F4
   */
  it('test_mission_card_displays_correctly', () => {
    // Setup
    const mockMission = {
      id: 'mission-1',
      title: 'Write proposal for AI Analytics Dashboard',
      payment: 1.00,
      missionType: 'proposal',
      status: 'available'
    };

    // Render
    render(<MissionCard mission={mockMission} member={{ totalInteractions: 10 }} />);

    // Assertions
    expect(screen.getByText(/Write proposal for AI Analytics Dashboard/)).toBeInTheDocument();
    expect(screen.getByText(/\$1\.00/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /claim mission/i })).toBeInTheDocument();
  });

  /**
   * Test: Claim button disabled if insufficient interactions
   * Maps to: VALIDATION.md T6.2, AC.md F4
   */
  it('test_claim_button_disabled_if_insufficient_interactions', () => {
    // Setup
    const mockMission = {
      id: 'mission-1',
      title: 'Write proposal',
      payment: 1.00,
      status: 'available'
    };

    const member = {
      totalInteractions: 3  // Need 5+
    };

    // Render
    render(<MissionCard mission={mockMission} member={member} />);

    // Assertions
    const button = screen.getByRole('button', { name: /claim mission/i });
    expect(button).toBeDisabled();
    expect(screen.getByText(/need 5\+ interactions/i)).toBeInTheDocument();
  });

  /**
   * Test: Claim button triggers confirmation modal
   * Maps to: VALIDATION.md T6.3
   */
  it('test_claim_button_triggers_modal', async () => {
    // Setup
    const mockMission = {
      id: 'mission-1',
      title: 'Write proposal',
      payment: 1.00,
      status: 'available'
    };

    const member = {
      totalInteractions: 10  // Sufficient
    };

    // Render
    render(<MissionCard mission={mockMission} member={member} />);

    // Action: Click claim button
    const button = screen.getByRole('button', { name: /claim mission/i });
    fireEvent.click(button);

    // Assertion: Modal opens
    await waitFor(() => {
      expect(screen.getByText(/Claim this mission for \$1\.00\?/)).toBeInTheDocument();
    });
  });

  /**
   * Test: Claimed mission shows "Mark Complete" button
   * Maps to: VALIDATION.md T6.4, AC.md F4
   */
  it('test_claimed_mission_shows_mark_complete_button', () => {
    // Setup
    const mockMission = {
      id: 'mission-1',
      title: 'Post about ScopeLock on X',
      payment: 2.00,
      status: 'claimed',
      claimedBy: 'member_a'
    };

    const member = {
      id: 'member_a',
      totalInteractions: 10
    };

    // Render
    render(<MissionCard mission={mockMission} member={member} />);

    // Assertions
    expect(screen.getByText(/Claimed by You/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mark complete/i })).toBeInTheDocument();
  });

  /**
   * Test: Mark complete requires proof upload
   * Maps to: VALIDATION.md T6.5, AC.md F5
   */
  it('test_mark_complete_requires_proof_upload', async () => {
    // Setup
    const mockMission = {
      id: 'mission-1',
      title: 'Post about ScopeLock on X',
      payment: 2.00,
      status: 'claimed',
      claimedBy: 'member_a'
    };

    const member = {
      id: 'member_a',
      totalInteractions: 10
    };

    const mockOnComplete = vi.fn().mockRejectedValue(
      new Error('Proof required')
    );

    // Render
    render(
      <MissionCard
        mission={mockMission}
        member={member}
        onComplete={mockOnComplete}
      />
    );

    // Action: Click "Mark Complete"
    const button = screen.getByRole('button', { name: /mark complete/i });
    fireEvent.click(button);

    // Modal opens
    await waitFor(() => {
      expect(screen.getByText(/Mark Mission Complete/)).toBeInTheDocument();
    });

    // Submit without proof
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Assertion: Error shown
    await waitFor(() => {
      expect(screen.getByText(/proof required/i)).toBeInTheDocument();
    });
  });

  /**
   * Test: Mission completion shows pending approval status
   * Maps to: VALIDATION.md T6.6, AC.md F5
   */
  it('test_mission_completion_shows_pending_approval', async () => {
    // Setup
    const mockMission = {
      id: 'mission-1',
      title: 'Write proposal',
      payment: 1.00,
      status: 'claimed',
      claimedBy: 'member_a'
    };

    const member = {
      id: 'member_a',
      totalInteractions: 10
    };

    const mockOnComplete = vi.fn().mockResolvedValue({
      status: 'pending_approval'
    });

    // Render
    const { rerender } = render(
      <MissionCard
        mission={mockMission}
        member={member}
        onComplete={mockOnComplete}
      />
    );

    // Action: Complete with proof
    fireEvent.click(screen.getByRole('button', { name: /mark complete/i }));

    await waitFor(() => {
      expect(screen.getByTestId('proof-url-input')).toBeInTheDocument();
    });

    const proofInput = screen.getByTestId('proof-url-input');
    await userEvent.type(proofInput, 'https://upwork.com/job/123/proposal');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Re-render with updated status
    const updatedMission = { ...mockMission, status: 'pending_approval' };
    rerender(
      <MissionCard
        mission={updatedMission}
        member={member}
        onComplete={mockOnComplete}
      />
    );

    // Assertion: Status badge shows pending
    await waitFor(() => {
      expect(screen.getByText(/pending approval/i)).toBeInTheDocument();
    });
  });

  /**
   * Test: Mission fund balance displays correctly
   * Maps to: AC.md F8
   */
  it('test_mission_fund_balance_displays_correctly', () => {
    // Setup
    const mockFundData = {
      balance: 150.00,
      sources: [
        { jobTitle: 'Build Chatbot', contribution: 75.00 },
        { jobTitle: 'Landing Page', contribution: 40.00 },
        { jobTitle: 'Dashboard', contribution: 35.00 }
      ],
      spent: 25.00
    };

    // Render
    render(<MissionFundBalance fundData={mockFundData} />);

    // Assertions
    expect(screen.getByText(/Mission Fund: \$150\.00 available/)).toBeInTheDocument();
  });

  /**
   * Test: Mission fund low balance warning
   * Maps to: AC.md F8
   */
  it('test_mission_fund_low_balance_warning', () => {
    // Setup
    const mockFundData = {
      balance: 8.00,  // < $10 triggers warning
      sources: []
    };

    // Render
    render(<MissionFundBalance fundData={mockFundData} />);

    // Assertions
    expect(screen.getByTestId('low-balance-warning')).toBeInTheDocument();
    expect(screen.getByText(/Low balance - complete jobs to increase fund/)).toBeInTheDocument();
  });

  /**
   * Test: Mission fund tooltip shows sources
   * Maps to: AC.md F8
   */
  it('test_mission_fund_tooltip_shows_sources', async () => {
    // Setup
    const mockFundData = {
      balance: 150.00,
      sources: [
        { jobTitle: 'Build Chatbot', contribution: 75.00 },
        { jobTitle: 'Landing Page', contribution: 40.00 },
        { jobTitle: 'Dashboard', contribution: 35.00 }
      ]
    };

    // Render
    const { container } = render(<MissionFundBalance fundData={mockFundData} />);

    // Hover over fund balance
    const balanceElement = container.querySelector('[data-testid="fund-balance"]');
    fireEvent.mouseEnter(balanceElement!);

    // Assertion: Tooltip shows sources
    await waitFor(() => {
      expect(screen.getByText(/From: Build Chatbot \(\$75\)/)).toBeInTheDocument();
      expect(screen.getByText(/Landing Page \(\$40\)/)).toBeInTheDocument();
      expect(screen.getByText(/Dashboard \(\$35\)/)).toBeInTheDocument();
    });
  });

  /**
   * Test: Mission list displays all missions
   * Maps to: AC.md F4
   */
  it('test_mission_list_displays_all_missions', () => {
    // Setup
    const mockMissions = [
      {
        id: 'mission-1',
        title: 'Write proposal for AI Analytics',
        payment: 1.00,
        status: 'available'
      },
      {
        id: 'mission-2',
        title: 'Post about ScopeLock on X',
        payment: 2.00,
        status: 'available'
      },
      {
        id: 'mission-3',
        title: 'Recruit new team member',
        payment: 10.00,
        status: 'available'
      }
    ];

    const member = { totalInteractions: 10 };

    // Render
    render(<MissionList missions={mockMissions} member={member} />);

    // Assertions
    expect(screen.getByText(/Write proposal for AI Analytics/)).toBeInTheDocument();
    expect(screen.getByText(/Post about ScopeLock on X/)).toBeInTheDocument();
    expect(screen.getByText(/Recruit new team member/)).toBeInTheDocument();
  });

  /**
   * Test: Mission claimed by another member shows status
   * Maps to: AC.md F4
   */
  it('test_mission_claimed_by_another_member', () => {
    // Setup
    const mockMission = {
      id: 'mission-1',
      title: 'Write proposal',
      payment: 1.00,
      status: 'claimed',
      claimedBy: 'member_b'
    };

    const member = {
      id: 'member_a',  // Different member
      totalInteractions: 10
    };

    // Render
    render(<MissionCard mission={mockMission} member={member} />);

    // Assertions
    expect(screen.getByText(/Claimed by member_b/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /claim mission/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /mark complete/i })).not.toBeInTheDocument();
  });

  /**
   * Test: Mission proof upload accepts URL
   * Maps to: AC.md F5
   */
  it('test_mission_proof_upload_accepts_url', async () => {
    // Setup
    const mockMission = {
      id: 'mission-1',
      title: 'Post on X',
      payment: 2.00,
      status: 'claimed',
      claimedBy: 'member_a'
    };

    const member = {
      id: 'member_a',
      totalInteractions: 10
    };

    const mockOnComplete = vi.fn().mockResolvedValue({ success: true });

    // Render
    render(
      <MissionCard
        mission={mockMission}
        member={member}
        onComplete={mockOnComplete}
      />
    );

    // Open completion modal
    fireEvent.click(screen.getByRole('button', { name: /mark complete/i }));

    await waitFor(() => {
      expect(screen.getByTestId('proof-url-input')).toBeInTheDocument();
    });

    // Enter proof URL
    const proofInput = screen.getByTestId('proof-url-input');
    await userEvent.type(proofInput, 'https://twitter.com/user/status/12345');

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Assertion: onComplete called with proof
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          proofUrl: 'https://twitter.com/user/status/12345'
        })
      );
    });
  });
});
