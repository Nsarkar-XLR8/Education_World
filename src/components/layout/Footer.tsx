import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <h4 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
              📖 Education World
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 'var(--leading-relaxed)', maxWidth: '360px' }}>
              One platform. All resources. Zero hassle. Bringing education, convenience,
              and technology together for learners of every age.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <li><Link href="/books">Bookstore</Link></li>
              <li><Link href="/tuition">Find Tuition</Link></li>
              <li><Link href="/kids">Kids Zone</Link></li>
              <li><Link href="/study-abroad">Study Abroad</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4>Account</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/signup">Sign Up</Link></li>
              <li><Link href="/account">My Account</Link></li>
              <li><Link href="/orders">My Orders</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4>Contact Us</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <li><Link href="/contact">Get in Touch</Link></li>
              <li style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-sm)' }}>
                📍 Dhaka, Bangladesh
              </li>
              <li style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-sm)' }}>
                📧 info@educationworld.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Education World. All rights reserved.</span>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
            </a>
            <a href="https://google.com" target="_blank" rel="noopener noreferrer" aria-label="Google">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
