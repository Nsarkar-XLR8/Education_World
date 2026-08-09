'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  productName: string;
  writerName: string;
  productPrice: string;
  discount: string;
  img: string | null;
}

export default function KidsBooksPage() {
  const [books, setBooks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKidsBooks() {
      try {
        const res = await fetch('/api/products?level=kids');
        const data = await res.json();
        setBooks(data.products || []);
      } catch {
        setBooks([]);
      }
      setLoading(false);
    }
    fetchKidsBooks();
  }, []);

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <Link href="/kids" className="btn btn-ghost btn-sm">
            ← Back to Kids Zone
          </Link>
          <h2>📚 Kids Storybooks</h2>
        </div>

        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : books.length === 0 ? (
          <div className="card text-center" style={{ padding: 'var(--space-16)' }}>
            <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>📖</div>
            <h3>Storybooks Catalog</h3>
            <p>Check out our main bookstore for all available children&apos;s storybooks!</p>
            <Link href="/books" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
              Go to Bookstore
            </Link>
          </div>
        ) : (
          <div className="grid grid-4">
            {books.map((book) => (
              <div key={book.id} className="card">
                <div style={{ height: '160px', background: 'var(--surface-cool)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-3)' }}>
                  📖
                </div>
                <h5>{book.productName}</h5>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>by {book.writerName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
