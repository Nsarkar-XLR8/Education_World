'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  productName: string;
  writerName: string;
  productPrice: number;
  discount: number;
  levelScClgUni: string;
  stockProduct: number;
  img: string | null;
  description?: string;
  publisher?: string;
}

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/products?id=${resolvedParams.id}`);
        const data = await res.json();
        setProduct(data.product || null);
      } catch {
        setProduct(null);
      }
      setLoading(false);
    }
    fetchBook();
  }, [resolvedParams.id]);

  async function handleAddToCart() {
    if (!product) return;
    setAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      if (res.ok) {
        setToast('✨ Added to cart successfully!');
        setTimeout(() => setToast(''), 3000);
      } else {
        const data = await res.json();
        setToast(`⚠️ ${data.error || 'Failed to add to cart'}`);
        setTimeout(() => setToast(''), 3000);
      }
    } catch {
      setToast('⚠️ Failed to add to cart');
      setTimeout(() => setToast(''), 3000);
    }
    setAdding(false);
  }

  async function handleBuyNow() {
    await handleAddToCart();
    router.push('/cart');
  }

  if (loading) {
    return <div className="loading-page"><div className="spinner" /></div>;
  }

  if (!product) {
    return (
      <div className="section">
        <div className="container text-center" style={{ padding: 'var(--space-16)' }}>
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>📖</div>
          <h3>Book Not Found</h3>
          <p style={{ marginBottom: 'var(--space-6)' }}>The requested book could not be found.</p>
          <Link href="/books" className="btn btn-primary">
            Back to Bookstore
          </Link>
        </div>
      </div>
    );
  }

  const price = product.productPrice;
  const discount = product.discount;
  const discountedPrice = price - (price * discount / 100);

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

        {/* Back link */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link href="/books" className="btn btn-ghost btn-sm">
            ← Back to Bookstore
          </Link>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'start' }}>
          {/* Left: Book Cover Preview */}
          <div className="card-elevated text-center" style={{
            padding: 'var(--space-12)',
            borderRadius: 'var(--radius-2xl)',
            background: 'linear-gradient(135deg, var(--surface-cool) 0%, var(--surface-cream) 100%)',
          }}>
            <div style={{
              width: '100%',
              height: '340px',
              borderRadius: 'var(--radius-xl)',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '120px',
              boxShadow: 'var(--shadow-md)',
            }}>
              {product.img ? (
                <img src={product.img} alt={product.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                '📖'
              )}
            </div>
          </div>

          {/* Right: Book Details */}
          <div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                {product.levelScClgUni} Category
              </span>
              {discount > 0 && (
                <span className="badge badge-danger">
                  Save {discount}% Off
                </span>
              )}
            </div>

            <h2 style={{ marginBottom: 'var(--space-2)' }}>{product.productName}</h2>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
              by <strong style={{ color: 'var(--text-primary)' }}>{product.writerName}</strong>
            </p>

            {/* Price section */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--space-4)',
              padding: 'var(--space-4) var(--space-6)',
              background: 'var(--surface-warm)',
              borderRadius: 'var(--radius-xl)',
              marginBottom: 'var(--space-6)',
            }}>
              <span style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                ৳{discountedPrice.toFixed(0)}
              </span>
              {discount > 0 && (
                <span style={{ fontSize: 'var(--text-lg)', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  ৳{price.toFixed(0)}
                </span>
              )}
              <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                {product.stockProduct > 0 ? `In Stock (${product.stockProduct} left)` : 'Out of Stock'}
              </span>
            </div>

            {/* Overview / Specs */}
            <h5 style={{ marginBottom: 'var(--space-2)' }}>Book Overview</h5>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
              {product.description || 'Comprehensive educational textbook designed to provide students with deep subject understanding, board question practice, and essential exam prep.'}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-3)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-8)',
              borderTop: '1px solid var(--border-light)',
              paddingTop: 'var(--space-4)',
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Publisher: </span>
                <span style={{ fontWeight: 600 }}>{product.publisher || 'Education World Press'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Target Level: </span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{product.levelScClgUni}</span>
              </div>
            </div>

            {/* Quantity Selector & Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ borderRadius: 0 }}
                >
                  -
                </button>
                <span style={{ padding: '0 var(--space-4)', fontWeight: 700 }}>{quantity}</span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setQuantity((q) => Math.min(product.stockProduct, q + 1))}
                  style={{ borderRadius: 0 }}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-secondary btn-lg"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                disabled={adding || product.stockProduct <= 0}
              >
                {adding ? 'Adding...' : '🛒 Add to Cart'}
              </button>

              <button
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                onClick={handleBuyNow}
                disabled={adding || product.stockProduct <= 0}
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
