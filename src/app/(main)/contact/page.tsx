'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      });
      setSubmitted(true);
    } catch {
      alert('Failed to send message');
    }
    setLoading(false);
  }

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div className="text-center" style={{ marginBottom: 'var(--space-10)' }}>
            <h2>📧 Contact Us</h2>
            <p style={{ fontSize: 'var(--text-lg)' }}>
              Have questions or feedback? We&apos;d love to hear from you.
            </p>
          </div>

          {submitted ? (
            <div className="card-gradient text-center" style={{ padding: 'var(--space-12)' }}>
              <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>✅</div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <div className="card-elevated" style={{ padding: 'var(--space-8)' }}>
              <form onSubmit={handleSubmit}>
                <div className="input-group" style={{ marginBottom: 'var(--space-5)' }}>
                  <label htmlFor="name">Your Name</label>
                  <input id="name" name="name" type="text" className="input" placeholder="John Doe" required />
                </div>

                <div className="input-group" style={{ marginBottom: 'var(--space-5)' }}>
                  <label htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" className="input" placeholder="you@example.com" required />
                </div>

                <div className="input-group" style={{ marginBottom: 'var(--space-6)' }}>
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" name="message" className="input" placeholder="Write your message here..." required />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          )}

          {/* Contact Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', marginTop: 'var(--space-12)' }}>
            <div className="card text-center">
              <div style={{ fontSize: '28px', marginBottom: 'var(--space-2)' }}>📍</div>
              <h6>Location</h6>
              <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>Dhaka, Bangladesh</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '28px', marginBottom: 'var(--space-2)' }}>📧</div>
              <h6>Email</h6>
              <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>info@educationworld.com</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '28px', marginBottom: 'var(--space-2)' }}>📱</div>
              <h6>Phone</h6>
              <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>+880 1626-644761</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
