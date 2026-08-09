'use client';

import { AbroadRecord } from '@/lib/abroadStore';

interface UniversityDetailModalProps {
  university: AbroadRecord | null;
  onClose: () => void;
  onRequestConsultation: (uni: AbroadRecord) => void;
}

export default function UniversityDetailModal({ university, onClose, onRequestConsultation }: UniversityDetailModalProps) {
  if (!university) return null;

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal active" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
          <div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span className="badge badge-info">World Rank #{university.rankUni}</span>
              <span className="badge badge-primary">{university.countryName}</span>
            </div>
            <h3 style={{ margin: 0 }}>{university.university}</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ fontSize: '20px' }}>
            ✕
          </button>
        </div>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          {university.description || 'Top international academic institution providing state-of-the-art research laboratories, global industry connections, and high-impact degree programs.'}
        </p>

        {/* Offered Degree */}
        <div style={{
          padding: 'var(--space-4) var(--space-6)',
          background: 'var(--primary-50)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--space-6)',
        }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
            Offered Degree / Program
          </span>
          <h5 style={{ margin: 'var(--space-1) 0 0', color: 'var(--primary-dark)' }}>
            🎓 {university.courseOffer}
          </h5>
        </div>

        {/* Detailed Breakdown Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          fontSize: 'var(--text-sm)',
        }}>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>Annual Tuition Fee</span>
            <h5 style={{ margin: 'var(--space-1) 0 0', color: 'var(--primary)' }}>{university.tuitionFee}</h5>
          </div>

          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>Estimated Living Cost</span>
            <h5 style={{ margin: 'var(--space-1) 0 0' }}>{university.livingCost}</h5>
          </div>

          <div className="card" style={{ padding: 'var(--space-4)', gridColumn: 'span 2' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>Funding / Scholarships</span>
            <h5 style={{ margin: 'var(--space-1) 0 0', color: 'var(--secondary-dark)' }}>🎁 {university.fund}</h5>
          </div>

          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>English Requirement</span>
            <p style={{ margin: 'var(--space-1) 0 0', fontWeight: 600 }}>{university.engPro}: {university.score}</p>
          </div>

          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>Minimum CGPA</span>
            <p style={{ margin: 'var(--space-1) 0 0', fontWeight: 600 }}>{university.cgpa}</p>
          </div>
        </div>

        {/* Assistantships & Contact */}
        <div style={{
          fontSize: 'var(--text-xs)',
          borderTop: '1px solid var(--border-light)',
          paddingTop: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>TA/RA Assistantship: </span>
            <span style={{ fontWeight: 600 }}>{university.taRaGa || 'Available upon research advisor matching'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Internship Co-op: </span>
            <span style={{ fontWeight: 600 }}>{university.internship || 'Industrial partnerships available'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Admissions Contact: </span>
            <span style={{ fontWeight: 600 }}>{university.contact || 'admissions@university.edu'}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onRequestConsultation(university);
            }}
          >
            ✈️ Request Free Counseling
          </button>
        </div>
      </div>
    </div>
  );
}
