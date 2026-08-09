'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  productName: string;
  writerName: string;
  productPrice: number;
  discount: number;
  levelScClgUni: string;
  stockProduct: number;
  img: string | null;
}

const levels = [
  { key: '', label: 'All Books' },
  { key: 'school', label: '🏫 School' },
  { key: 'college', label: '🎓 College' },
  { key: 'university', label: '🏛️ University' },
  { key: 'kids', label: '🧸 Kids' },
  { key: 'others', label: '📖 Others' },
];

export default function BooksPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeLevel, setActiveLevel] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [activeLevel, search, sort]);

  async function fetchProducts() {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeLevel) params.set('level', activeLevel);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }

  async function handleAddToCart(productId: number) {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        setToast('✨ Added to cart!');
        setTimeout(() => setToast(''), 2500);
      } else {
        const data = await res.json();
        setToast(`⚠️ ${data.error || 'Failed to add'}`);
        setTimeout(() => setToast(''), 2500);
      }
    } catch {
      setToast('⚠️ Failed to add to cart');
      setTimeout(() => setToast(''), 2500);
    }
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

        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h2>📚 Education World Bookstore</h2>
          <p style={{ fontSize: 'var(--text-lg)' }}>
            Curated textbooks, guidebooks, and storybooks for school, college, and university students.
          </p>
        </div>

        {/* Controls Bar */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-4)',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
        }}>
          {/* Level Filter Tabs */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {levels.map((level) => (
              <button
                key={level.key}
                className={`btn ${activeLevel === level.key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setActiveLevel(level.key)}
              >
                {level.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <input
              type="search"
              className="input"
              placeholder="Search books or authors..."
              style={{ width: '240px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="input"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="">Sort by: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="card text-center" style={{ padding: 'var(--space-16)' }}>
            <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>📭</div>
            <h3>No books found</h3>
            <p>Try searching for a different title or select another category tab above.</p>
          </div>
        ) : (
          <div className="grid grid-4">
            {products.map((product) => {
              const price = product.productPrice;
              const discount = product.discount;
              const discountedPrice = price - (price * discount / 100);

              return (
                <div key={product.id} className="book-card card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Image */}
                  <Link href={`/books/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                      height: '210px',
                      background: 'linear-gradient(135deg, var(--surface-cool), var(--surface-warm))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '64px',
                      position: 'relative',
                    }}>
                      {product.img ? (
                        <img src={product.img} alt={product.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        '📖'
                      )}
                      {discount > 0 && (
                        <span className="badge badge-danger" style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)' }}>
                          -{discount}%
                        </span>
                      )}
                      <span className="badge badge-primary" style={{ position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)', textTransform: 'capitalize' }}>
                        {product.levelScClgUni}
                      </span>
                    </div>
                  </Link>

                  {/* Content */}
                  <div style={{ padding: 'var(--space-5)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <Link href={`/books/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h6 style={{ marginBottom: 'var(--space-1)', lineHeight: 'var(--leading-snug)' }}>
                          {product.productName}
                        </h6>
                      </Link>
                      <p style={{ fontSize: 'var(--text-xs)', margin: '0 0 var(--space-3)', color: 'var(--text-muted)' }}>
                        by {product.writerName}
                      </p>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 'var(--text-xl)' }}>
                          ৳{discountedPrice.toFixed(0)}
                        </span>
                        {discount > 0 && (
                          <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                            ৳{price.toFixed(0)}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Link
                          href={`/books/${product.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          View
                        </Link>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => handleAddToCart(product.id)}
                          disabled={product.stockProduct <= 0}
                        >
                          {product.stockProduct > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
