'use client';

import { useState } from 'react';

interface PostTuitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PostTuitionModal({ isOpen, onClose, onSuccess }: PostTuitionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      class: formData.get('class') as string,
      dayTime: formData.get('dayTime') as string,
      slClgUn: formData.get('slClgUn') as string,
      subject: formData.get('subject') as string,
      designation: formData.get('designation') as string,
      salary: formData.get('salary') as string,
      version: formData.get('version') as string,
    };

    try {
      const res = await fetch('/api/tuition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit post');
      }
    } catch {
      setError('An unexpected error occurred');
    }
    setLoading(false);
  }

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal active" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ margin: 0 }}>🎓 Register Tutor / Post Tuition</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ fontSize: '20px' }}>
            ✕
          </button>
        </div>

        {error && (
          <div style={{
            padding: 'var(--space-3) var(--space-4)',
            background: '#FFE6E6',
            color: 'var(--accent-coral)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-4)',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div className="input-group">
              <label htmlFor="designation">I am a...</label>
              <select id="designation" name="designation" className="input" defaultValue="teacher">
                <option value="teacher">👨‍🏫 Teacher / Tutor looking for tuition</option>
                <option value="student">👨‍🎓 Student / Guardian looking for tutor</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" className="input" placeholder="e.g. Tanvir Hossain" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" className="input" placeholder="tanvir@gmail.com" required />
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="tel" className="input" placeholder="+880 17XX-XXXXXX" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div className="input-group">
              <label htmlFor="subject">Subject(s)</label>
              <input id="subject" name="subject" type="text" className="input" placeholder="e.g. Physics & Higher Math" required />
            </div>

            <div className="input-group">
              <label htmlFor="class">Target Class / Level</label>
              <input id="class" name="class" type="text" className="input" placeholder="e.g. Class 9 - 12 (HSC)" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div className="input-group">
              <label htmlFor="address">Location / Address</label>
              <input id="address" name="address" type="text" className="input" placeholder="e.g. Dhanmondi, Dhaka" required />
            </div>

            <div className="input-group">
              <label htmlFor="salary">Monthly Salary / Budget</label>
              <input id="salary" name="salary" type="text" className="input" placeholder="e.g. 8,000 / month" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <div className="input-group">
              <label htmlFor="slClgUn">School / College / University</label>
              <input id="slClgUn" name="slClgUn" type="text" className="input" placeholder="e.g. BUET / DU / Ideal College" required />
            </div>

            <div className="input-group">
              <label htmlFor="version">Medium / Version</label>
              <select id="version" name="version" className="input" defaultValue="Bangla Medium">
                <option value="Bangla Medium">Bangla Medium</option>
                <option value="English Version">English Version</option>
                <option value="English Medium (Edexcel/Cambridge)">English Medium (O/A Level)</option>
              </select>
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--space-6)' }}>
            <label htmlFor="dayTime">Days per Week & Preferred Time</label>
            <input id="dayTime" name="dayTime" type="text" className="input" placeholder="e.g. 3 Days/Week (5:00 PM - 7:00 PM)" required />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
