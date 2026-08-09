'use client';

import { useEffect, useState, useCallback } from 'react';
import { GlobalUniversity, getCountryFlag } from '@/lib/universitySearchEngine';
import StudyAbroadConsultationModal from '@/components/features/StudyAbroadConsultationModal';

const featuredCountries = [
  { key: '', label: '🌐 All Countries' },
  { key: 'United States', label: '🇺🇸 USA' },
  { key: 'Canada', label: '🇨🇦 Canada' },
  { key: 'United Kingdom', label: '🇬🇧 UK' },
  { key: 'Australia', label: '🇦🇺 Australia' },
  { key: 'Germany', label: '🇩🇪 Germany' },
  { key: 'Japan', label: '🇯🇵 Japan' },
  { key: 'Sweden', label: '🇸🇪 Sweden' },
  { key: 'France', label: '🇫🇷 France' },
  { key: 'Netherlands', label: '🇳🇱 Netherlands' },
  { key: 'Malaysia', label: '🇲🇾 Malaysia' },
];

export default function StudyAbroadPage() {
  const [universities, setUniversities] = useState<GlobalUniversity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCountry, setActiveCountry] = useState('');
  const [search, setSearch] = useState('');

  // Student Eligibility Filters
  const [userCgpa, setUserCgpa] = useState<string>('');
  const [userIelts, setUserIelts] = useState<string>('');
  const [onlyEligible, setOnlyEligible] = useState(false);

  // Modals & Toast
  const [selectedUni, setSelectedUni] = useState<GlobalUniversity | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [toast, setToast] = useState('');

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (activeCountry) params.set('country', activeCountry);

    try {
      const res = await fetch(`/api/abroad/search?${params.toString()}`);
      const data = await res.json();
      setUniversities(data.universities || []);
    } catch {
      setUniversities([]);
    }
    setLoading(false);
  }, [search, activeCountry]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUniversities();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchUniversities]);

  // Eligibility Matcher logic
  const filteredUniversities = universities.filter((uni) => {
    if (!onlyEligible) return true;

    const cgpaReq = parseFloat(uni.requiredCgpa) || 3.0;
    const ieltsReq = parseFloat(uni.requiredIelts) || 6.5;

    const myCgpa = parseFloat(userCgpa);
    const myIelts = parseFloat(userIelts);

    if (!isNaN(myCgpa) && myCgpa < cgpaReq) return false;
    if (!isNaN(myIelts) && myIelts < ieltsReq) return false;

    return true;
  });

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
        <StudyAbroadConsultationModal
          isOpen={isConsultationOpen}
          targetUniversity={
            selectedUni
              ? {
                  id: 1,
                  university: selectedUni.name,
                  countryName: selectedUni.country,
                  courseOffer: 'Master / Bachelor Degree',
                  rankUni: '1',
                  tuitionFee: selectedUni.estimatedTuition,
                  livingCost: selectedUni.estimatedLivingCost,
                  fund: selectedUni.scholarshipInfo,
                  engPro: 'IELTS',
                  score: selectedUni.requiredIelts,
                  cgpa: selectedUni.requiredCgpa,
                  createdAt: new Date().toISOString(),
                }
              : null
          }
          onClose={() => setIsConsultationOpen(false)}
          onSuccess={() => {
            setToast('🎉 Consultation request submitted! A study advisor will contact you soon.');
            setTimeout(() => setToast(''), 4000);
          }}
        />

        {/* Hero Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          <div>
            <h2>🌐 Global University Search Engine</h2>
            <p style={{ fontSize: 'var(--text-lg)', maxWidth: '640px' }}>
              Search over <strong>10,000+ top universities worldwide</strong> across 200+ countries. Instantly check tuition fees, scholarships, and minimum CGPA/IELTS requirements.
            </p>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              setSelectedUni(null);
              setIsConsultationOpen(true);
            }}
          >
            📋 Free Counseling Request
          </button>
        </div>

        {/* Student Eligibility Matcher Tool Bar */}
        <div className="card-elevated" style={{
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-2xl)',
          marginBottom: 'var(--space-8)',
          background: 'linear-gradient(135deg, var(--surface-cool) 0%, var(--surface-cream) 100%)',
        }}>
          <h5 style={{ marginBottom: 'var(--space-4)', color: 'var(--primary-dark)' }}>
            🎯 Student Eligibility Matcher
          </h5>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr', gap: 'var(--space-4)', alignItems: 'center' }}>
            <div className="input-group">
              <label htmlFor="userCgpa" style={{ fontSize: 'var(--text-xs)' }}>Your CGPA / GPA (out of 4.0)</label>
              <input
                id="userCgpa"
                type="number"
                step="0.01"
                className="input"
                placeholder="e.g. 3.45"
                value={userCgpa}
                onChange={(e) => setUserCgpa(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="userIelts" style={{ fontSize: 'var(--text-xs)' }}>Your IELTS Score</label>
              <input
                id="userIelts"
                type="number"
                step="0.5"
                className="input"
                placeholder="e.g. 7.0"
                value={userIelts}
                onChange={(e) => setUserIelts(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingTop: 'var(--space-5)' }}>
              <input
                id="onlyEligible"
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="onlyEligible" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', margin: 0 }}>
                Show Only Eligible Universities
              </label>
            </div>

            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', paddingTop: 'var(--space-5)' }}>
              Enter your CGPA and IELTS score to highlight universities matching your academic profile.
            </div>
          </div>
        </div>

        {/* Global Live Search Bar */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <input
            type="search"
            className="input"
            placeholder="🔎 Search 10,000+ universities by name, city, or discipline (e.g. Harvard, Munich, Toronto, Oxford, Tokyo, Berlin, Sydney)..."
            style={{ height: '54px', fontSize: 'var(--text-base)', borderRadius: 'var(--radius-xl)' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Country Filter Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
          {featuredCountries.map((c) => (
            <button
              key={c.key}
              className={`btn ${activeCountry === c.key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveCountry(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h4 style={{ margin: 0 }}>
            Found <span className="text-gradient">{filteredUniversities.length}</span> Universities
          </h4>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Live Global Database (Updated Automatically)
          </span>
        </div>

        {/* University Cards Grid */}
        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : filteredUniversities.length === 0 ? (
          <div className="card text-center" style={{ padding: 'var(--space-16)' }}>
            <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>🔍</div>
            <h3>No universities found</h3>
            <p>Try searching for a different university name, city, or clear your eligibility filters.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filteredUniversities.map((uni, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                    <span className="badge badge-info">{uni.rankEstimate}</span>
                    <span className="badge badge-primary">
                      {getCountryFlag(uni.country)} {uni.country}
                    </span>
                  </div>

                  <h4 style={{ marginBottom: 'var(--space-2)', lineHeight: 'var(--leading-snug)' }}>
                    {uni.name}
                  </h4>

                  {/* Financial & Requirement Breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Estimated Tuition</span>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{uni.estimatedTuition}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Living Expenses</span>
                      <span>{uni.estimatedLivingCost}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Scholarships / Aid</span>
                      <span style={{ color: 'var(--secondary-dark)', fontWeight: 600 }}>🎁 {uni.scholarshipInfo}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Req. IELTS</span>
                      <span>{uni.requiredIelts}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Req. CGPA</span>
                      <span>{uni.requiredCgpa} / 4.00</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <a
                    href={uni.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
                  >
                    🌐 Official Site
                  </a>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setSelectedUni(uni);
                      setIsConsultationOpen(true);
                    }}
                  >
                    ✈️ Counseling
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
