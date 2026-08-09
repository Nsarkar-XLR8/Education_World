'use client';

import { useEffect, useState } from 'react';
import { AbroadRecord } from '@/lib/abroadStore';

export default function AdminAbroadPage() {
  const [universities, setUniversities] = useState<AbroadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchUniversities();
  }, []);

  async function fetchUniversities() {
    setLoading(true);
    try {
      const res = await fetch('/api/abroad');
      const data = await res.json();
      setUniversities(data.universities || []);
    } catch {
      setUniversities([]);
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      rankUni: formData.get('rankUni') as string,
      university: formData.get('university') as string,
      courseOffer: formData.get('courseOffer') as string,
      tuitionFee: formData.get('tuitionFee') as string,
      livingCost: formData.get('livingCost') as string,
      fund: formData.get('fund') as string,
      countryName: formData.get('countryName') as string,
      engPro: formData.get('engPro') as string,
      score: formData.get('score') as string,
      cgpa: formData.get('cgpa') as string,
    };

    try {
      const res = await fetch('/api/abroad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setToast('✨ University added successfully!');
        setShowAddModal(false);
        fetchUniversities();
      } else {
        alert('Failed to create entry');
      }
    } catch {
      alert('Error creating entry');
    }
    setSubmitting(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this university?')) return;

    try {
      const res = await fetch(`/api/abroad?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToast('🗑️ University removed');
        fetchUniversities();
      }
    } catch {
      alert('Failed to delete entry');
    }
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 'var(--space-6)',
          right: 'var(--space-6)',
          background: 'var(--text-primary)',
          color: 'white',
          padding: 'var(--space-3) var(--space-6)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h2>✈️ Study Abroad Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Add, edit, or remove global university listings</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          ➕ Add New University
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-page"><div className="spinner" /></div>
      ) : (
        <div className="card-elevated" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--surface-cool)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: 'var(--space-4)' }}>Rank</th>
                <th style={{ padding: 'var(--space-4)' }}>University Name</th>
                <th style={{ padding: 'var(--space-4)' }}>Country</th>
                <th style={{ padding: 'var(--space-4)' }}>Program Offer</th>
                <th style={{ padding: 'var(--space-4)' }}>Tuition Fee</th>
                <th style={{ padding: 'var(--space-4)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {universities.map((uni) => (
                <tr key={uni.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: 'var(--space-4)', fontWeight: 700 }}>#{uni.rankUni}</td>
                  <td style={{ padding: 'var(--space-4)', fontWeight: 600 }}>{uni.university}</td>
                  <td style={{ padding: 'var(--space-4)' }}>{uni.countryName}</td>
                  <td style={{ padding: 'var(--space-4)' }}>{uni.courseOffer}</td>
                  <td style={{ padding: 'var(--space-4)' }}>{uni.tuitionFee}</td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(uni.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add University Modal */}
      {showAddModal && (
        <div className="modal-backdrop active" onClick={() => setShowAddModal(false)}>
          <div className="modal active" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h3 style={{ margin: 0 }}>Add University Listing</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)} style={{ fontSize: '20px' }}>✕</button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div className="input-group">
                  <label htmlFor="rankUni">World Rank</label>
                  <input id="rankUni" name="rankUni" type="text" className="input" placeholder="e.g. 15" required />
                </div>
                <div className="input-group">
                  <label htmlFor="university">University Name</label>
                  <input id="university" name="university" type="text" className="input" placeholder="e.g. Stanford University" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div className="input-group">
                  <label htmlFor="countryName">Country</label>
                  <input id="countryName" name="countryName" type="text" className="input" placeholder="e.g. USA" required />
                </div>
                <div className="input-group">
                  <label htmlFor="courseOffer">Offered Program</label>
                  <input id="courseOffer" name="courseOffer" type="text" className="input" placeholder="e.g. M.Sc in AI & Data" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div className="input-group">
                  <label htmlFor="tuitionFee">Tuition Fee</label>
                  <input id="tuitionFee" name="tuitionFee" type="text" className="input" placeholder="e.g. $45,000 / year" required />
                </div>
                <div className="input-group">
                  <label htmlFor="livingCost">Living Cost</label>
                  <input id="livingCost" name="livingCost" type="text" className="input" placeholder="e.g. $1,200 / month" required />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label htmlFor="fund">Scholarship / Funding Info</label>
                <input id="fund" name="fund" type="text" className="input" placeholder="e.g. Full Free & TA/RA Available" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div className="input-group">
                  <label htmlFor="engPro">Test Type</label>
                  <input id="engPro" name="engPro" type="text" className="input" defaultValue="IELTS" required />
                </div>
                <div className="input-group">
                  <label htmlFor="score">Min Test Score</label>
                  <input id="score" name="score" type="text" className="input" placeholder="e.g. 7.0" required />
                </div>
                <div className="input-group">
                  <label htmlFor="cgpa">Min CGPA</label>
                  <input id="cgpa" name="cgpa" type="text" className="input" placeholder="e.g. 3.50" required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create University'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
