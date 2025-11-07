/**
 * Frontend Tests: Real-Time Earnings UI Updates (T5)
 * Maps to: AC.md F1, F3 (Job tracking, Total potential earnings display)
 * Mission: mission-deck-compensation
 * Framework: Vitest + React Testing Library
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { EarningsBanner } from '@/components/compensation/EarningsBanner';
import { JobCard } from '@/components/compensation/JobCard';


describe('Real-Time Earnings UI Updates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Test: Earnings banner displays total correctly
   * Maps to: VALIDATION.md T5.1
   */
  it('test_earnings_banner_displays_total', () => {
    // Setup
    const mockEarnings = {
      jobs: 164.00,
      missions: 5.00,
      total: 169.00
    };

    // Render
    render(<EarningsBanner earnings={mockEarnings} />);

    // Assertions
    expect(screen.getByText(/YOUR TOTAL POTENTIAL EARNINGS/i)).toBeInTheDocument();
    expect(screen.getByText(/\$169\.00/)).toBeInTheDocument();
  });

  /**
   * Test: Earnings update when new interaction added
   * Maps to: VALIDATION.md T5.2, AC.md NF1 (< 500ms update)
   */
  it('test_earnings_update_on_new_interaction', async () => {
    // Setup
    const { rerender } = render(<EarningsBanner earnings={{ total: 164.00 }} />);

    // Verify initial value
    expect(screen.getByText(/\$164\.00/)).toBeInTheDocument();

    // Simulate interaction event (new earnings)
    const newEarnings = { total: 166.50 };
    rerender(<EarningsBanner earnings={newEarnings} />);

    // Assertion: Updates within 500ms
    await waitFor(() => {
      expect(screen.getByText(/\$166\.50/)).toBeInTheDocument();
    }, { timeout: 500 });
  });

  /**
   * Test: Job card shows interaction count correctly
   * Maps to: VALIDATION.md T5.3, AC.md F1
   */
  it('test_job_card_shows_interaction_count', () => {
    // Setup
    const mockJob = {
      id: 'job-1',
      title: 'Build Chatbot',
      value: 1500,
      teamPool: 450,
      yourInteractions: 20,
      totalInteractions: 100,
      potentialEarning: 90.00,
      status: 'active'
    };

    // Render
    render(<JobCard job={mockJob} />);

    // Assertions
    expect(screen.getByText(/Your interactions: 20/)).toBeInTheDocument();
    expect(screen.getByText(/Team total: 100/)).toBeInTheDocument();
  });

  /**
   * Test: Job card shows potential earning correctly
   * Maps to: VALIDATION.md T5.4, AC.md F1
   */
  it('test_job_card_shows_potential_earning', () => {
    // Setup
    const mockJob = {
      id: 'job-1',
      title: 'Build Chatbot - TherapyKin',
      value: 1500,
      teamPool: 450,
      yourInteractions: 20,
      totalInteractions: 100,
      potentialEarning: 90.00,
      status: 'active'
    };

    // Render
    render(<JobCard job={mockJob} />);

    // Assertions
    expect(screen.getByText(/Earning at job completion: \$90\.00/)).toBeInTheDocument();
  });

  /**
   * Test: Loading state displayed during update
   * Maps to: VALIDATION.md T5.5, AC.md F1
   */
  it('test_loading_state_during_update', async () => {
    // Setup
    const mockJob = {
      id: 'job-1',
      title: 'Test Job',
      value: 1000,
      teamPool: 300,
      yourInteractions: 10,
      totalInteractions: 20,
      potentialEarning: 150.00,
      status: 'active',
      isUpdating: true  // Loading state
    };

    // Render
    render(<JobCard job={mockJob} />);

    // Assertion: Loading spinner visible
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Simulate update complete
    const { rerender } = render(<JobCard job={mockJob} />);
    const updatedJob = { ...mockJob, isUpdating: false };
    rerender(<JobCard job={updatedJob} />);

    // Wait for loading to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  /**
   * Test: Error message shown on failed update
   * Maps to: VALIDATION.md T5.6, AC.md F1
   */
  it('test_error_message_on_failed_update', () => {
    // Setup: Simulate API error
    const mockJob = {
      id: 'job-1',
      title: 'Test Job',
      value: 1000,
      teamPool: 300,
      yourInteractions: 10,
      totalInteractions: 20,
      potentialEarning: 150.00,
      status: 'active',
      error: 'Failed to track interaction'
    };

    // Render
    render(<JobCard job={mockJob} />);

    // Assertion: Error message displayed
    expect(screen.getByText(/Failed to track interaction\. Retry\?/)).toBeInTheDocument();
  });

  /**
   * Test: Earnings banner tooltip shows breakdown
   * Maps to: AC.md F3
   */
  it('test_earnings_banner_tooltip_shows_breakdown', async () => {
    // Setup
    const mockEarnings = {
      jobs: 164.00,
      missions: 5.00,
      total: 169.00,
      jobsCount: 3,
      missionsCount: 2
    };

    // Render
    const { container } = render(<EarningsBanner earnings={mockEarnings} />);

    // Hover over banner
    const banner = container.querySelector('[data-testid="earnings-banner"]');
    fireEvent.mouseEnter(banner!);

    // Assertion: Tooltip appears
    await waitFor(() => {
      expect(screen.getByText(/From 3 active jobs \+ 2 completed missions/)).toBeInTheDocument();
    });
  });

  /**
   * Test: Real-time update performance (< 500ms)
   * Maps to: AC.md NF1 (Performance)
   */
  it('test_earnings_update_performance', async () => {
    // Setup
    const { rerender } = render(<EarningsBanner earnings={{ total: 100.00 }} />);

    // Measure update time
    const start = performance.now();

    // Trigger update
    rerender(<EarningsBanner earnings={{ total: 105.00 }} />);

    // Wait for update
    await waitFor(() => {
      expect(screen.getByText(/\$105\.00/)).toBeInTheDocument();
    });

    const duration = performance.now() - start;

    // Assertion: Update completes in < 500ms
    expect(duration).toBeLessThan(500);
  });

  /**
   * Test: Multiple job cards update independently
   * Maps to: AC.md F1
   */
  it('test_multiple_job_cards_update_independently', async () => {
    // Setup
    const job1 = {
      id: 'job-1',
      title: 'Chatbot',
      value: 1500,
      teamPool: 450,
      yourInteractions: 20,
      totalInteractions: 100,
      potentialEarning: 90.00,
      status: 'active'
    };

    const job2 = {
      id: 'job-2',
      title: 'Dashboard',
      value: 800,
      teamPool: 240,
      yourInteractions: 5,
      totalInteractions: 50,
      potentialEarning: 24.00,
      status: 'active'
    };

    // Render both
    const { rerender } = render(
      <>
        <JobCard job={job1} />
        <JobCard job={job2} />
      </>
    );

    // Update only job1
    const updatedJob1 = { ...job1, yourInteractions: 21, potentialEarning: 94.50 };

    rerender(
      <>
        <JobCard job={updatedJob1} />
        <JobCard job={job2} />
      </>
    );

    // Assertions
    await waitFor(() => {
      expect(screen.getByText(/Your interactions: 21/)).toBeInTheDocument(); // job1 updated
      expect(screen.getByText(/Your interactions: 5/)).toBeInTheDocument();  // job2 unchanged
    });
  });

  /**
   * Test: Earnings format with thousand separator
   * Maps to: AC.md F3
   */
  it('test_earnings_format_with_thousand_separator', () => {
    // Setup
    const mockEarnings = {
      jobs: 1245.50,
      missions: 25.00,
      total: 1270.50
    };

    // Render
    render(<EarningsBanner earnings={mockEarnings} />);

    // Assertion: Formatted correctly
    expect(screen.getByText(/\$1,270\.50/)).toBeInTheDocument();
  });
});
