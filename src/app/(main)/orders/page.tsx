'use client';

import { useEffect, useState } from 'react';

interface OrderItem {
  id: number;
  proQuantity: number;
  perProTotalPrice: string;
  product: {
    productName: string;
  };
}

interface Order {
  id: number;
  customerAddress: string;
  overallPrice: string;
  orderDate: string;
  status: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        <h2 style={{ marginBottom: 'var(--space-6)' }}>📦 My Orders</h2>

        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="card text-center" style={{ padding: 'var(--space-16)' }}>
            <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>📦</div>
            <h3>No orders yet</h3>
            <p>You haven&apos;t placed any orders yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {orders.map((order) => (
              <div key={order.id} className="card" style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <div>
                    <h5 style={{ margin: 0 }}>Order #{order.id}</h5>
                    <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                      Date: {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`badge ${order.status === 'DELIVERED' ? 'badge-success' : 'badge-warning'}`}>
                    {order.status}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                  {order.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                      <span>{item.product.productName} × {item.proQuantity}</span>
                      <span style={{ fontWeight: 600 }}>৳{parseFloat(item.perProTotalPrice).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-4)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    Address: {order.customerAddress}
                  </span>
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--primary)' }}>
                    Total: ৳{parseFloat(order.overallPrice).toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
