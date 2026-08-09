'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    students: 0,
    abroad: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [pRes, oRes, aRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/abroad'),
        ]);

        const [pData, oData, aData] = await Promise.all([
          pRes.json(),
          oRes.json(),
          aRes.json(),
        ]);

        setStats({
          products: pData.pagination?.total || pData.products?.length || 0,
          orders: oData.orders?.length || 0,
          students: 0,
          abroad: aData.universities?.length || 0,
        });
      } catch {
        // Fallback stats
      }
      setLoading(false);
    }

    fetchStats();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h2>📊 Admin Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Overview of platform statistics and management options</p>
      </div>

      {loading ? (
        <div className="loading-page"><div className="spinner" /></div>
      ) : (
        <div className="grid grid-4" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="card-elevated" style={{ padding: 'var(--space-6)' }}>
            <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>📚</div>
            <h3 style={{ fontSize: 'var(--text-3xl)', margin: 0, color: 'var(--primary)' }}>{stats.products}</h3>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Total Products</span>
          </div>

          <div className="card-elevated" style={{ padding: 'var(--space-6)' }}>
            <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>📦</div>
            <h3 style={{ fontSize: 'var(--text-3xl)', margin: 0, color: 'var(--secondary-dark)' }}>{stats.orders}</h3>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Total Orders</span>
          </div>

          <div className="card-elevated" style={{ padding: 'var(--space-6)' }}>
            <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>✈️</div>
            <h3 style={{ fontSize: 'var(--text-3xl)', margin: 0, color: 'var(--accent-coral)' }}>{stats.abroad}</h3>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Study Abroad Listings</span>
          </div>

          <div className="card-elevated" style={{ padding: 'var(--space-6)' }}>
            <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>🛡️</div>
            <h3 style={{ fontSize: 'var(--text-3xl)', margin: 0, color: 'var(--accent-warm)' }}>Active</h3>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>System Status</span>
          </div>
        </div>
      )}

      {/* Quick Management Links */}
      <h4 style={{ marginBottom: 'var(--space-4)' }}>Management Modules</h4>
      <div className="grid grid-3">
        <Link href="/admin/products" className="card" style={{ textDecoration: 'none' }}>
          <h5>📚 Products Management</h5>
          <p style={{ fontSize: 'var(--text-sm)' }}>Add, update, or remove books and products from the store.</p>
        </Link>
        <Link href="/admin/orders" className="card" style={{ textDecoration: 'none' }}>
          <h5>📦 Orders Management</h5>
          <p style={{ fontSize: 'var(--text-sm)' }}>View customer orders and update delivery status.</p>
        </Link>
        <Link href="/admin/abroad" className="card" style={{ textDecoration: 'none' }}>
          <h5>✈️ Study Abroad Management</h5>
          <p style={{ fontSize: 'var(--text-sm)' }}>Manage university rankings, courses, and scholarship info.</p>
        </Link>
      </div>
    </div>
  );
}
