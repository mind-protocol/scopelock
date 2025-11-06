'use client';

import { useState } from 'react';
import styles from './ContactForm.module.css';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    demo: '',
    problem: '',
    timeline: '',
    budget: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', demo: '', problem: '', timeline: '', budget: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <div className={styles.formIntro}>
        <p><strong>Request an Evidence Sprint</strong> — I'll build a 90-second demo to prove the concept works before you commit to the full build.</p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          disabled={status === 'submitting'}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your@email.com"
          disabled={status === 'submitting'}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="demo">What do you want to see working in 90 seconds?</label>
        <textarea
          id="demo"
          name="demo"
          value={formData.demo}
          onChange={handleChange}
          required
          placeholder="Example: 'User signs up with email, receives OTP code, logs in successfully'"
          rows={3}
          disabled={status === 'submitting'}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="problem">What problem does this solve?</label>
        <textarea
          id="problem"
          name="problem"
          value={formData.problem}
          onChange={handleChange}
          required
          placeholder="Example: 'Current signup takes 7 steps, we're losing 60% of users'"
          rows={3}
          disabled={status === 'submitting'}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="timeline">Timeline</label>
          <input
            type="text"
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            required
            placeholder="Example: 'Need in 1 week'"
            disabled={status === 'submitting'}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="budget">Budget Range</label>
          <input
            type="text"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            placeholder="Example: '$300-600'"
            disabled={status === 'submitting'}
          />
        </div>
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending...' : 'Request Evidence Sprint'}
      </button>

      {status === 'success' && (
        <div className={styles.successMessage}>
          Request received! I'll send you a detailed Evidence Sprint spec (what you'll see, timeline, price) within 6 hours. No call needed — approve via email to proceed.
        </div>
      )}

      {status === 'error' && (
        <div className={styles.errorMessage}>
          Something went wrong. Please try email instead: scopelock@mindprotocol.ai
        </div>
      )}
    </form>
  );
}
