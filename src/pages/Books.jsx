import React, { useEffect, useState } from 'react';
import localProducts from '../data/products';

function Books() {

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [source, setSource] = useState('api');
  const [localCart, setLocalCart] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(window.localStorage.getItem('localCart') || '[]');
    } catch {
      return [];
    }
  });

  const genres = [
    ['Art', 'Music'], ['Adult', 'Mystery'], ['Biography', 'Nonfiction'],
    ['Business', 'Paranormal'], ['Chick lit', 'Philosophy'], ["Children's", 'Poetry'],
    ['Classics', 'Psychology'], ['Comics', 'Religions'], ['Contemporary', 'Romance'],
    ['Cookbooks', 'Science'], ['Crime', 'Science Fiction'], ['Ebooks', 'Sports'],
    ['Fantasy', 'Thriller'], ['Fiction', 'Travel'], ['Graphic Novels', 'Young Adult'],
    ['Historical Fiction'], ['History'], ['Horror'], ['Humor and Comedy'],
    ['Lovecraftian'], ['Manga'], ['Memoir'],
  ];

  // FIX: Extract array from paginated response { count, next, results: [...] }
  const extractArray = (data) => Array.isArray(data) ? data : (data?.results || []);

  // Fetch categories
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.json())
      .then(data => setCategories(extractArray(data)))  // FIX: was setCategories(data)
      .catch(() => console.log('Categories fetch failed'));
  }, []);

  // Fetch books
  useEffect(() => {
    let url = 'http://127.0.0.1:8000/api/books/?';
    if (selectedCategory) url += `category=${selectedCategory}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const arr = extractArray(data);  // FIX: was using data directly
        if (arr.length > 0) {
          setBooks(arr);
          setSource('api');
        } else {
          setBooks(localProducts);
          setSource('local');
        }
      })
      .catch(() => {
        setBooks(localProducts);
        setSource('local');
      });
  }, [selectedCategory, search]);

  const API_BASE = 'http://127.0.0.1:8000';
  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x320?text=No+Image';

  const getImage = (book) => {
    if (!book?.image) return PLACEHOLDER_IMAGE;
    const image = String(book.image).trim();
    if (image.startsWith('http')) return image;
    if (image.startsWith('/')) return `${API_BASE}${image}`;
    return `${API_BASE}/${image}`;
  };

  // FIX: categories is now guaranteed to be an array, so .find() is safe
  const findCategory = (genreName) =>
    categories.find(cat => cat.name.toLowerCase() === genreName.toLowerCase());

  const showMessage = (msg) => {
    setCartMessage(msg);
    setTimeout(() => setCartMessage(''), 3000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('localCart', JSON.stringify(localCart));
    }
  }, [localCart]);

  const handleBuyNow = async (book) => {
    if (source === 'local') {
      setLocalCart(prev => {
        const exists = prev.find(item => item.id === book.id);
        if (exists) {
          return prev.map(item =>
            item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [
          ...prev,
          {
            id: book.id,
            book_title: book.title,
            book_author: book.author,
            book_price: book.price,
            book_image: book.image,
            book_category: book.category_name,
            quantity: 1,
          },
        ];
      });
      setBooks(prev => prev.map(b =>
        b.id === book.id ? { ...b, stock: Math.max(0, b.stock - 1) } : b
      ));
      showMessage(`✅ "${book.title}" added to cart!`);
      return;
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/api/cart/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book: book.id, quantity: 1 }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(`✅ "${book.title}" added to cart!`);
        setBooks(prev => prev.map(b =>
          b.id === book.id ? { ...b, stock: data.remaining_stock } : b
        ));
      } else {
        showMessage(`❌ ${data.error}`);
      }
    } catch {
      showMessage('❌ Failed to connect to server.');
    }
  };

  const handleDelete = async (book) => {
    if (source === 'local') {
      setBooks(prev => prev.filter(b => b.id !== book.id));
      showMessage(`🗑️ "${book.title}" removed.`);
      return;
    }
    if (!window.confirm(`Delete "${book.title}" permanently?`)) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/books/${book.id}/delete/`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setBooks(prev => prev.filter(b => b.id !== book.id));
        showMessage(`🗑️ "${book.title}" deleted from database.`);
      } else {
        showMessage(`❌ ${data.error}`);
      }
    } catch {
      showMessage('❌ Failed to delete.');
    }
  };

  const displayedBooks = source === 'local'
    ? localProducts.filter(b => {
        const matchSearch = search ? b.title.toLowerCase().includes(search.toLowerCase()) : true;
        const matchCat = selectedCategory ? b.category_name.toLowerCase() === selectedCategory.toLowerCase() : true;
        return matchSearch && matchCat;
      })
    : books;

  return (
    <div className="bg-light min-vh-100">

      {/* NAVBAR */}
      <nav className="navbar px-4 py-3" style={{ background: '#2c1e12' }}>
        <span className="navbar-brand text-white fw-bold fs-4 mb-0">LOGO</span>
        <input
          type="text"
          placeholder="Search books and authors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control rounded-pill px-4 w-50"
        />
        <div
          className="rounded-circle bg-secondary"
          style={{ width: '42px', height: '42px', cursor: 'pointer', flexShrink: 0 }}
        />
      </nav>

      {/* TOAST */}
      {cartMessage && (
        <div
          className="position-fixed top-0 end-0 m-3 alert shadow"
          style={{
            zIndex: 9999,
            minWidth: '280px',
            background: cartMessage.startsWith('✅') ? '#d4edda'
              : cartMessage.startsWith('🗑️') ? '#fff3cd'
              : '#f8d7da',
            border: 'none',
            borderRadius: '12px'
          }}
        >
          {cartMessage}
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="d-flex">

        {/* SIDEBAR */}
        <div
          className="bg-white border-end p-4"
          style={{ width: '260px', minHeight: 'calc(100vh - 63px)', flexShrink: 0 }}
        >
          <h6 className="fw-bold text-uppercase mb-2">Genre</h6>
          <hr />

          <button
            onClick={() => setSelectedCategory('')}
            className="btn btn-sm w-100 text-start mb-1 rounded-2"
            style={{
              background: selectedCategory === '' ? '#2c1e12' : 'transparent',
              color: selectedCategory === '' ? 'white' : 'black',
              border: 'none',
              fontSize: '13px'
            }}
          >
            All Categories
          </button>

          {genres.map((row, i) => (
            <div key={i} className="d-flex justify-content-between mb-1">
              {row.map(genre => {
                const matched = findCategory(genre);
                const isActive = selectedCategory === genre || (matched && selectedCategory === String(matched.id));
                return (
                  <button
                    key={genre}
                    onClick={() => setSelectedCategory(isActive ? '' : (matched ? String(matched.id) : genre))}
                    className="btn btn-sm text-start rounded-2"
                    style={{
                      background: isActive ? '#2c1e12' : 'transparent',
                      color: isActive ? 'white' : '#333',
                      border: 'none',
                      fontSize: '13px',
                      padding: '3px 6px',
                    }}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-grow-1 p-4">

          {source === 'local' && (
            <div className="alert alert-warning py-2 mb-3">
              ⚠️ Showing local sample data — backend not connected.
            </div>
          )}

          {/* RECOMMENDATIONS */}
          <h5 className="fw-bold text-decoration-underline mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            Recommendations
          </h5>
          <hr />
          <div className="d-flex gap-3 overflow-auto pb-3 mb-5">
            {displayedBooks.slice(0, 5).map(book => (
              <div key={book.id} style={{ minWidth: '160px', cursor: 'pointer' }}>
                <img
                  src={getImage(book)}
                  alt={book.title}
                  className="rounded"
                  onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                  style={{ width: '160px', height: '220px', objectFit: 'cover', display: 'block' }}
                />
                <p className="fw-bold text-uppercase mt-2 mb-0" style={{ fontSize: '12px' }}>{book.title}</p>
                <p className="text-muted" style={{ fontSize: '12px' }}>{book.author}</p>
              </div>
            ))}
          </div>

          {/* ALL BOOKS */}
          <h5 className="fw-bold text-decoration-underline mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            All Books
          </h5>
          <hr />

          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            {displayedBooks.map(book => (
              <div key={book.id} className="col">
                <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">

                  <img
                    src={getImage(book)}
                    alt={book.title}
                    className="card-img-top"
                    onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                    style={{ height: '240px', objectFit: 'cover' }}
                  />

                  <div className="card-body d-flex flex-column p-3">
                    <h6 className="fw-bold mb-1">{book.title}</h6>
                    <p className="text-muted small mb-1">by {book.author}</p>
                    <span
                      className="badge rounded-pill mb-2"
                      style={{ background: '#eee', color: '#555', width: 'fit-content', fontSize: '11px' }}
                    >
                      {book.category_name}
                    </span>
                    <p className="small mb-2">
                      {book.stock > 0
                        ? <span className="text-success">✔ In Stock ({book.stock})</span>
                        : <span className="text-danger">✘ Out of Stock</span>
                      }
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-auto gap-1">
                      <span className="fw-bold" style={{ color: '#8b0000' }}>${book.price}</span>

                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm rounded-pill text-white"
                          style={{
                            background: book.stock > 0 ? '#2c1e12' : '#aaa',
                            cursor: book.stock > 0 ? 'pointer' : 'not-allowed',
                            fontSize: '11px'
                          }}
                          onClick={() => handleBuyNow(book)}
                          disabled={book.stock === 0}
                        >
                          Buy
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          style={{ fontSize: '11px' }}
                          onClick={() => handleDelete(book)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayedBooks.length === 0 && (
            <p className="text-muted mt-4">No books found.</p>
          )}

        </div>
      </div>
    </div>
  );
}

export default Books;

