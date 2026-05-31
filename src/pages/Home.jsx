import React, { useState, useEffect } from 'react';

function Home() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        let url = 'http://127.0.0.1:8000/api/books/?';
        if (search) url += `search=${search}`;

        fetch(url)
            .then(res => res.json())
            // FIX: Django REST Framework returns paginated { count, next, results: [...] }
            // Extract the array from results, or fall back if API returns a plain array
            .then(data => setBooks(Array.isArray(data) ? data : (data.results || [])))
            .catch(err => console.error("API Fetch error:", err));
    }, [search]);

    const getBookImg = (imgUrl) => {
        if (!imgUrl) return 'https://via.placeholder.com/150x220?text=No+Cover';
        return String(imgUrl).startsWith('http') ? imgUrl : `http://127.0.0.1:8000${imgUrl}`;
    };

    return (
        <div className="min-vh-100" style={{ backgroundColor: '#FAF6F0', fontFamily: "'Georgia', serif", color: '#2c1e12' }}>

            {/* 1. HERO HEADER SECTION */}
            <div className="text-center pt-5 pb-3 px-3">
                <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem', letterSpacing: '-0.5px' }}>
                    Find your next favorite book
                </h1>
                <p className="text-muted small mb-4" style={{ fontFamily: 'sans-serif' }}>
                    Download, find online, or order a physical copy — all in one place.
                </p>

                <div className="d-flex justify-content-center gap-2 mb-4" style={{ fontFamily: 'sans-serif' }}>
                    <button className="btn text-white px-4 py-2 fw-medium btn-sm" style={{ backgroundColor: '#2D2219', borderRadius: '4px' }}>
                        Get Started
                    </button>
                    <button className="btn bg-white border px-4 py-2 fw-medium btn-sm" style={{ color: '#2D2219', borderRadius: '4px', borderColor: '#EAE5DD' }}>
                        Browse Books
                    </button>
                </div>

                {/* Carousel */}
                <div id="carouselExampleAutoplaying" className="carousel slide mx-auto mb-5" data-bs-ride="carousel" style={{ maxWidth: '90%' }}>
                    <div className="carousel-inner">

                        {/* Slide 1 */}
                        <div className="carousel-item active">
                            <div className="d-flex justify-content-center gap-2">
                                <img src="https://i.pinimg.com/736x/4e/92/3a/4e923a4b0ac5bbdc2e7270ac59bb316e.jpg" alt="Book Mini 1" style={{ width: '100%', height: '500px', borderRadius: '3px', objectFit: 'cover' }} />
                            </div>
                        </div>

                        {/* Slide 2 — FIX: was missing closing </div> for carousel-item */}
                        <div className="carousel-item">
                            <div className="d-flex justify-content-center gap-2">
                                <img src="https://i.pinimg.com/736x/4e/92/3a/4e923a4b0ac5bbdc2e7270ac59bb316e.jpg" alt="Book Mini 6" style={{ width: '100%', height: '500px', borderRadius: '3px', objectFit: 'cover' }} />
                            </div>
                        </div>

                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev" style={{ filter: 'invert(100%)' }}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next" style={{ filter: 'invert(100%)' }}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT WRAPPER */}
            <div className="container mx-auto px-4 pb-5" style={{ maxWidth: '93%' }}>

                {/* 2. FEATURED BOOKS HERO CARD */}
                <div className="p-4 p-md-5 mb-5 rounded-4 border d-flex flex-column flex-md-row align-items-center justify-content-between gap-4"
                    style={{ backgroundColor: '#FCFAF5', borderColor: '#E5DFD3' }}>
                    <div className="text-start" style={{ maxWidth: '300px' }}>
                        <h2 className="fw-bold display-6 mb-2">Featured Books</h2>
                        <p className="text-muted small mb-4" style={{ fontFamily: 'sans-serif' }}>
                            Hand-picked reads for every kind of readers
                        </p>
                        <button className="btn text-white px-3 py-2 btn-sm fw-medium" style={{ backgroundColor: '#423327', borderRadius: '4px', fontFamily: 'sans-serif' }}>
                            Discover more
                        </button>
                    </div>

                    <div className="d-flex gap-3 overflow-auto w-100 justify-content-md-end justify-content-center pt-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <img key={i} className="shadow-sm img-fluid"
                                src="https://i.pinimg.com/736x/4e/92/3a/4e923a4b0ac5bbdc2e7270ac59bb316e.jpg"
                                alt={`Featured ${i}`}
                                style={{ borderRadius: '6px', minWidth: '200px', height: '190px', objectFit: 'cover' }} />
                        ))}
                    </div>
                </div>

                {/* 3. SEARCH */}
                <div className="d-flex justify-content-center mb-5">
                    <div className="position-relative w-100" style={{ maxWidth: '500px', fontFamily: 'sans-serif' }}>
                        <input
                            type="text"
                            placeholder="Search books and authors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="form-control text-center py-2 px-4 shadow-sm"
                            style={{ borderRadius: '30px', border: '1px solid #E2DCD0', backgroundColor: '#FFF', fontSize: '0.9rem' }}
                        />
                    </div>
                </div>

                {/* 4. MOST READ THIS WEEK */}
                <div className="mb-5">
                    <h4 className="fw-bold mb-3" style={{ fontSize: '1.25rem' }}>Most read this week</h4>
                    <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
                        {books.slice(0, 5).map((book) => (
                            <div key={book.id} className="col">
                                <div className="border-0 bg-transparent h-100 d-flex flex-column text-start">
                                    <img
                                        src={getBookImg(book.image)}
                                        alt={book.title}
                                        className="img-fluid mb-2 shadow-sm"
                                        style={{ height: '210px', width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                    <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.9rem', color: '#1a110a' }}>{book.title}</h6>
                                    <p className="text-muted mb-1 text-truncate" style={{ fontSize: '0.75rem', fontFamily: 'sans-serif' }}>{book.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. NEW RELEASES */}
                <div className="mb-4">
                    <h4 className="fw-bold mb-3" style={{ fontSize: '1.25rem' }}>New releases</h4>
                    <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
                        {books.slice(5, 10).map((book) => (
                            <div key={book.id} className="col">
                                <div className="border-0 bg-transparent h-100 d-flex flex-column text-start">
                                    <img
                                        src={getBookImg(book.image)}
                                        alt={book.title}
                                        className="img-fluid mb-2 shadow-sm"
                                        style={{ height: '210px', width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                    <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.9rem', color: '#1a110a' }}>{book.title}</h6>
                                    <p className="text-muted mb-1 text-truncate" style={{ fontSize: '0.75rem', fontFamily: 'sans-serif' }}>{book.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* EMPTY STATE */}
                {books.length === 0 && (
                    <div className="text-center py-4">
                        <p className="text-muted small" style={{ fontFamily: 'sans-serif' }}>No books matching your query criteria found.</p>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Home;