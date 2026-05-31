import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function AddToCart() {

  const getSavedCart = () => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(window.localStorage.getItem('localCart') || '[]');
    } catch {
      return [];
    }
  };

  const [localCart, setLocalCart] = useState(getSavedCart);
  const [useLocalCart, setUseLocalCart] = useState(() => getSavedCart().length > 0);
  const [cartItems, setCartItems] = useState(getSavedCart);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    fetch('http://127.0.0.1:8000/api/cart/')
      .then(res => {
        if (!res.ok) throw new Error('Fetch failed');
        return res.json();
      })
      .then(data => {
        if (!useLocalCart) {
          setCartItems(data);
          setUseLocalCart(false);
        }
      })
      .catch(() => {
        const saved = loadLocalCart();
        if (saved.length === 0) {
          setMessage('❌ Failed to load cart.');
        } else {
          showMessage('⚠️ Backend unavailable — showing saved cart.');
        }
      });
  };

  const getImage = (item) => {
    const image = item.book_image;
    if (!image) return 'https://via.placeholder.com/100x130?text=No+Image';
    if (String(image).startsWith('http')) return image;
    return `http://127.0.0.1:8000${image}`;
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('localCart', JSON.stringify(localCart));
    }
  }, [localCart]);

  const loadLocalCart = () => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = JSON.parse(window.localStorage.getItem('localCart') || '[]');
      setLocalCart(saved);
      setCartItems(saved);
      setUseLocalCart(true);
      return saved;
    } catch {
      return [];
    }
  };

  const handleIncrease = async (item) => {
    if (useLocalCart) {
      const updated = cartItems.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      setCartItems(updated);
      setLocalCart(updated);
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/cart/${item.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: item.quantity + 1 }),
      });
      if (res.ok) fetchCart();
    } catch {
      showMessage('❌ Failed to update quantity.');
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity === 1) {
      handleRemove(item);
      return;
    }
    if (useLocalCart) {
      const updated = cartItems.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
      );
      setCartItems(updated);
      setLocalCart(updated);
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/cart/${item.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: item.quantity - 1 }),
      });
      if (res.ok) fetchCart();
    } catch {
      showMessage('❌ Failed to update quantity.');
    }
  };

  const handleRemove = async (item) => {
    if (useLocalCart) {
      const updated = cartItems.filter(c => c.id !== item.id);
      setCartItems(updated);
      setLocalCart(updated);
      showMessage(`🗑️ "${item.book_title}" removed from cart.`);
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/cart/${item.id}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCartItems(prev => prev.filter(c => c.id !== item.id));
        showMessage(`🗑️ "${item.book_title}" removed from cart.`);
      }
    } catch {
      showMessage('❌ Failed to remove item.');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from cart?')) return;
    if (useLocalCart) {
      setCartItems([]);
      setLocalCart([]);
      showMessage('🗑️ Cart cleared.');
      return;
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/api/cart/clear/', {
        method: 'DELETE',
      });
      if (res.ok) {
        setCartItems([]);
        showMessage('🗑️ Cart cleared.');
      }
    } catch {
      showMessage('❌ Failed to clear cart.');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showMessage('⚠️ Your cart is empty.');
      return;
    }
    if (useLocalCart) {
      setCartItems([]);
      setLocalCart([]);
      showMessage('✅ Order placed successfully!');
      return;
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/api/cart/checkout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems([]);
        showMessage('✅ Order placed successfully!');
      } else {
        showMessage(`❌ ${data.error}`);
      }
    } catch {
      showMessage('❌ Checkout failed.');
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.book_price * item.quantity, 0
  );

  return (
    <div className="bg-light min-vh-100">

      {/* NAVBAR */}
      {/* <nav className="navbar px-4 py-3" style={{ background: '#2c1e12' }}>
        <span className="navbar-brand text-white fw-bold fs-4 mb-0">LOGO</span>
        <span className="text-white">🛒 My Cart</span>
        <div
          className="rounded-circle bg-secondary"
          style={{ width: '42px', height: '42px', cursor: 'pointer' }}
        />
      </nav> */}

      {/* TOAST */}
      {message && (
        <div
          className="position-fixed top-0 end-0 m-3 alert shadow"
          style={{
            zIndex: 9999,
            minWidth: '280px',
            background: message.startsWith('✅') ? '#d4edda'
              : message.startsWith('🗑️') ? '#fff3cd'
              : '#f8d7da',
            border: 'none',
            borderRadius: '12px'
          }}
        >
          {message}
        </div>
      )}

      <div className="container py-5">
        <div className="row">

          {/* CART ITEMS */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ fontFamily: 'Georgia, serif' }}>
                Shopping Cart ({cartItems.length} items)
              </h5>
              {cartItems.length > 0 && (
                <button
                  className="btn btn-sm btn-outline-danger rounded-pill"
                  onClick={handleClearCart}
                >
                  Clear All
                </button>
              )}
            </div>
            <hr />

            {cartItems.length === 0 ? (
              <div className="text-center py-5">
                <p className="fs-1">🛒</p>
                <p className="text-muted">Your cart is empty.</p>
                <Link
                  to="/books"
                  className="btn rounded-pill text-white px-4"
                  style={{ background: '#2c1e12' }}
                >
                  Browse Books
                </Link>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="card border-0 shadow-sm rounded-3 mb-3 p-3">
                  <div className="d-flex gap-3 align-items-center">

                    {/* Book Image */}
                    <img
                      src={getImage(item)}
                      alt={item.book_title}
                      className="rounded-2"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100x130?text=No+Image'; }}
                      style={{ width: '80px', height: '110px', objectFit: 'cover', flexShrink: 0 }}
                    />

                    {/* Book Info */}
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{item.book_title}</h6>
                      <p className="text-muted small mb-1">by {item.book_author}</p>
                      <p className="text-muted small mb-2">{item.book_category}</p>
                      <span className="fw-bold" style={{ color: '#8b0000' }}>
                        ${item.book_price}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="d-flex flex-column align-items-center gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-circle"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          onClick={() => handleDecrease(item)}
                        >
                          −
                        </button>
                        <span className="fw-bold">{item.quantity}</span>
                        <button
                          className="btn btn-sm rounded-circle text-white"
                          style={{ width: '32px', height: '32px', padding: 0, background: '#2c1e12' }}
                          onClick={() => handleIncrease(item)}
                        >
                          +
                        </button>
                      </div>

                      <small className="text-muted">
                        Subtotal: <strong>${(item.book_price * item.quantity).toFixed(2)}</strong>
                      </small>

                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill"
                        style={{ fontSize: '11px' }}
                        onClick={() => handleRemove(item)}
                      >
                        🗑️ Remove
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-3 p-4">
              <h5 className="fw-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Order Summary
              </h5>
              <hr />

              {cartItems.map(item => (
                <div key={item.id} className="d-flex justify-content-between mb-2 small">
                  <span className="text-muted">{item.book_title} × {item.quantity}</span>
                  <span>${(item.book_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between fw-bold mb-4">
                <span>Total</span>
                <span style={{ color: '#8b0000' }}>${totalPrice.toFixed(2)}</span>
              </div>

              <button
                className="btn w-100 rounded-pill text-white fw-bold"
                style={{ background: '#2c1e12' }}
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                ✅ Checkout
              </button>

              <Link
                to="/books"
                className="btn w-100 btn-outline-secondary rounded-pill mt-2"
              >
                ← Continue Shopping
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddToCart;