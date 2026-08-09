'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartItem {
  id: number;
  productId: number;
  productQuantity: number;
  eachProPrice: string;
  totalPrice: string;
  product: {
    productName: string;
    img: string | null;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCartItems(data.cartItems || []);
      setTotal(data.total || 0);
    } catch {
      setCartItems([]);
    }
    setLoading(false);
  }

  async function handleRemove(id: number) {
    try {
      const res = await fetch(`/api/cart?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCart();
      }
    } catch {
      alert('Failed to remove item');
    }
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    setCheckingOut(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      if (res.ok) {
        alert('Order placed successfully!');
        fetchCart();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to place order');
      }
    } catch {
      alert('Checkout failed');
    }
    setCheckingOut(false);
  }

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        <h2 style={{ marginBottom: 'var(--space-6)' }}>🛒 Shopping Cart</h2>

        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : cartItems.length === 0 ? (
          <div className="card text-center" style={{ padding: 'var(--space-16)' }}>
            <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>🛒</div>
            <h3>Your cart is empty</h3>
            <p style={{ marginBottom: 'var(--space-6)' }}>Explore our collection of books and resources.</p>
            <Link href="/books" className="btn btn-primary btn-lg">
              Browse Bookstore
            </Link>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
            {/* Item List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {cartItems.map((item) => (
                <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--surface-cool)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                    }}>
                      {item.product.img ? (
                        <img src={item.product.img} alt={item.product.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : '📖'}
                    </div>
                    <div>
                      <h5 style={{ margin: 0 }}>{item.product.productName}</h5>
                      <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                        Quantity: {item.productQuantity} × ৳{parseFloat(item.eachProPrice).toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      ৳{parseFloat(item.totalPrice).toFixed(0)}
                    </span>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary / Checkout Form */}
            <div className="card-elevated" style={{ height: 'fit-content', padding: 'var(--space-6)' }}>
              <h4 style={{ marginBottom: 'var(--space-4)' }}>Summary</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                <span>Total Amount:</span>
                <span className="text-gradient">৳{total.toFixed(0)}</span>
              </div>

              <form onSubmit={handleCheckout}>
                <div className="input-group" style={{ marginBottom: 'var(--space-6)' }}>
                  <label htmlFor="address">Delivery Address</label>
                  <textarea
                    id="address"
                    className="input"
                    placeholder="Enter full delivery address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={checkingOut}>
                  {checkingOut ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
