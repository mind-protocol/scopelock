'use client';

import { useState } from 'react';
import styles from './styles.module.css';

export default function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      wallet: formData.get('wallet') as string,
      email: formData.get('email') as string,
      telegram: formData.get('telegram') as string,
      commitment: formData.get('commitment') as string,
      source: formData.get('source') as string,
    };

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage("✅ You're on the list! Check your email for confirmation.");
        form.reset();
      } else {
        setStatus('error');
        setMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.waitlistFormContainer}>
      <form onSubmit={handleSubmit} className={styles.waitlistForm}>
        <div className={styles.formGroup}>
          <label htmlFor="wallet">Solana Wallet Address *</label>
          <input
            type="text"
            id="wallet"
            name="wallet"
            placeholder="9xQeWvG816bUx9EPjHmaT23yfAS2Zo1pEZGfSPqYrGtX"
            required
            pattern="^[1-9A-HJ-NP-Za-km-z]{32,44}$"
            className={styles.formInput}
            disabled={isSubmitting}
          />
          <div className={styles.formHint}>Your Solana wallet for token delivery</div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            required
            className={styles.formInput}
            disabled={isSubmitting}
          />
          <div className={styles.formHint}>For launch notification</div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="telegram">Telegram Username (Optional)</label>
          <input
            type="text"
            id="telegram"
            name="telegram"
            placeholder="@username"
            className={styles.formInput}
            disabled={isSubmitting}
          />
          <div className={styles.formHint}>For AI partner onboarding when ready</div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="commitment">Expected Commitment Amount (Optional)</label>
          <select
            id="commitment"
            name="commitment"
            className={styles.formSelect}
            disabled={isSubmitting}
          >
            <option value="">Just exploring</option>
            <option value="100-500">$100 - $500 SOL</option>
            <option value="500-1000">$500 - $1,000 SOL</option>
            <option value="1000-5000">$1,000 - $5,000 SOL</option>
            <option value="5000+">$5,000+ SOL</option>
          </select>
          <div className={styles.formHint}>Not binding, just curious about demand</div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="source">How did you hear about Mind Protocol?</label>
          <select
            id="source"
            name="source"
            className={styles.formSelect}
            disabled={isSubmitting}
          >
            <option value="">Select one</option>
            <option value="twitter">Twitter</option>
            <option value="telegram">Telegram</option>
            <option value="venice">Venice Community</option>
            <option value="github">GitHub</option>
            <option value="friend">Friend/Referral</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Joining...' : 'Join Waitlist →'}
        </button>

        {status !== 'idle' && (
          <div className={`${styles.formStatus} ${styles[status]}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
