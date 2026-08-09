'use client';

import { useState } from 'react';
import { AbroadRecord } from '@/lib/abroadStore';

interface StudyAbroadConsultationModalProps {
  isOpen: boolean;
  targetUniversity?: AbroadRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudyAbroadConsultationModal({
  isOpen,
  targetUniversity,
  onClose,
  onSuccess,
}: StudyAbroadConsultationModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // Simulate sending lead consultation request
    await new Promise((resolve) => setTimeout(resolve, 600));

    onSuccess();
    onClose();
    setLoading(false);
  }

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal active" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ margin: 0 }}>✈️ Free Study Abroad Counseling</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ fontSize: '20px' }}>
            ✕
          </button>
        </div>

        {targetUniversity && (
          <div style={{
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--primary-50)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--space-4)',
            fontSize: 'var(--text-sm)',
          }}>
            Inquiring about: <strong style={{ color: 'var(--primary-dark)' }}>{targetUniversity.university}</strong> ({targetUniversity.countryName})
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div className="input-group">
              <label htmlFor="studentName">Your Full Name</label>
              <input id="studentName" name="studentName" type="text" className="input" placeholder="e.g. Rahul Hasan" required />
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="tel" className="input" placeholder="+880 17XX-XXXXXX" required />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" className="input" placeholder="rahul@example.com" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div className="input-group">
              <label htmlFor="country">Target Country</label>
              <select id="country" name="country" className="input" defaultValue={targetUniversity?.countryName || 'Canada'}>
                <option value="USA">USA 🇺🇸</option>
                <option value="Canada">Canada 🇨🇦</option>
                <option value="UK">UK 🇬🇧</option>
                <option value="Australia">Australia 🇦🇺</option>
                <option value="Germany">Germany 🇩🇪</option>
                <option value="Japan">Japan 🇯🇵</option>
                <option value="Sweden">Sweden 🇸🇪</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="degree">Degree Level</label>
              <select id="degree" name="degree" className="input" defaultValue="Masters">
                <option value="Bachelors">Bachelor&apos;s Degree</option>
                <option value="Masters">Master&apos;s Degree</option>
                <option value="PhD">Ph.D / Doctorate</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <div className="input-group">
              <label htmlFor="cgpa">Current CGPA / GPA</label>
              <input id="cgpa" name="cgpa" type="text" className="input" placeholder="e.g. 3.45 / 4.00" required />
            </div>

            <div className="input-group">
              <label htmlFor="ielts">IELTS / TOEFL Score</label>
              <input id="ielts" name="ielts" type="text" className="input" placeholder="e.g. IELTS 7.0 or Pending" required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting Request...' : 'Submit Consultation Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
