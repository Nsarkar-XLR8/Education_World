'use client';

import { useEffect, useState } from 'react';
import PostTuitionModal from '@/components/features/PostTuitionModal';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  class: string;
  dayTime: string;
  slClgUn: string;
  subject: string;
  designation: 'student' | 'teacher';
  salary: string;
  version: string;
  img: string | null;
}

export default function TuitionPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [filter, search]);

  async function fetchStudents() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter) params.set('designation', filter);
    if (search) params.set('search', search);

    try {
      const res = await fetch(`/api/tuition?${params.toString()}`);
      const data = await res.json();
      setStudents(data.students || []);
    } catch {
      setStudents([]);
    }
    setLoading(false);
  }

  function handleConnect(student: Student) {
    setToast(`✨ Request sent to ${student.name}! They will contact you at ${student.phone}`);
    setTimeout(() => setToast(''), 4000);
  }

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
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

        {/* Modal */}
        <PostTuitionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setToast('🎉 Tuition post submitted successfully!');
            setTimeout(() => setToast(''), 3000);
            fetchStudents();
          }}
        />

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          <div>
            <h2>🎓 Tuition Matching Platform</h2>
            <p style={{ fontSize: 'var(--text-lg)' }}>
              Connect directly with verified tutors and students across Bangladesh.
            </p>
          </div>

          <button className="btn btn-primary btn-lg" onClick={() => setIsModalOpen(true)}>
            ➕ Post Tuition / Register Tutor
          </button>
        </div>

        {/* Controls Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          {/* Designation Tabs */}
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              className={`btn ${filter === '' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setFilter('')}
            >
              All Listings
            </button>
            <button
              className={`btn ${filter === 'teacher' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setFilter('teacher')}
            >
              👨‍🏫 Tutors Available
            </button>
            <button
              className={`btn ${filter === 'student' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setFilter('student')}
            >
              👨‍🎓 Students Needing Tutor
            </button>
          </div>

          {/* Search Bar */}
          <input
            type="search"
            className="input"
            placeholder="Search location, subject, or class..."
            style={{ width: '280px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : students.length === 0 ? (
          <div className="card text-center" style={{ padding: 'var(--space-16)' }}>
            <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>🔍</div>
            <h3>No tuition listings found</h3>
            <p style={{ marginBottom: 'var(--space-6)' }}>Be the first to post a tuition request or register as a tutor!</p>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              Post Tuition Request
            </button>
          </div>
        ) : (
          <div className="grid grid-3">
            {students.map((student) => (
              <div key={student.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-full)',
                      background: student.designation === 'teacher' ? '#E6FFF9' : 'var(--primary-50)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      flexShrink: 0,
                    }}>
                      {student.designation === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
                    </div>
                    <div>
                      <h5 style={{ margin: 0 }}>{student.name}</h5>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
                        <span className={`badge ${student.designation === 'teacher' ? 'badge-success' : 'badge-primary'}`}>
                          {student.designation === 'teacher' ? 'Tutor Available' : 'Tuition Request'}
                        </span>
                        <span className="badge badge-info">{student.version}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Subject</span>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{student.subject}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Target Class</span>
                      <span style={{ fontWeight: 600 }}>{student.class}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Institution</span>
                      <span>{student.slClgUn}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Location</span>
                      <span>📍 {student.address}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Schedule</span>
                      <span>{student.dayTime}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-light)', paddingTop: 'var(--space-2)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Salary / Budget</span>
                      <span style={{ fontWeight: 800, color: 'var(--secondary-dark)' }}>৳{student.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleConnect(student)}
                  >
                    ⚡ Apply / Connect
                  </button>
                  <a
                    href={`tel:${student.phone}`}
                    className="btn btn-secondary btn-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    📞 Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
