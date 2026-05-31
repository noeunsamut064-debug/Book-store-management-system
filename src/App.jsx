// import React from 'react';
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Link
// } from 'react-router-dom';

// import Home from './pages/Home';
// import About from './pages/About';
// import Books from './pages/Books';
// import Contact from './pages/Contact';
// import Login from './pages/Login';
// import AddToCart from './pages/AddToCart';

// function App() {
//   return (
//     <BrowserRouter>

//       {/* Navbar */}
//       <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
//         <div className="container">
//           <Link className="navbar-brand fw-bold fs-3 text-warning" to="/">
//             📚 Book Store
//           </Link>

//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav ms-auto align-items-center gap-5">

//               <li className="nav-item">
//                 <Link className="nav-link text-white fw-semibold" to="/">
//                   Home
//                 </Link>
//               </li>

//               <li className="nav-item">
//                 <Link className="nav-link text-white fw-semibold" to="/about">
//                   About
//                 </Link>
//               </li>

//               <li className="nav-item">
//                 <Link className="nav-link text-white fw-semibold" to="/books">
//                   Books
//                 </Link>
//               </li>

//               <li className="nav-item">
//                 <Link className="nav-link text-white fw-semibold" to="/contact">
//                   Contact
//                 </Link>
//               </li>

//               <li className="nav-item">
//                 <Link className="nav-link text-white fw-semibold" to="/cart">
//                   🛒 Cart
//                 </Link>
//               </li>

//               <li className="nav-item ms-2">
//                 <Link className="btn btn-warning rounded-pill px-4 fw-bold" to="/login">
//                   Login
//                 </Link>
//               </li>
              
               
//             </ul>
//  <div
//                   className="rounded-circle bg-secondary"
//                   style={{ width: '42px', height: '42px', cursor: 'pointer', flexShrink: 0,marginLeft: '225px',marginRight: '-300px' }}
//                 />
//           </div>

//         </div>
//       </nav>

//       {/* Pages */}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/books" element={<Books />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/cart" element={<AddToCart />} />
//         <Route path="/login" element={<Login />} />
//       </Routes>

//     </BrowserRouter>
//   );
// }

// export default App;
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Books from './pages/Books';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AddToCart from './pages/AddToCart';

import PrivateRoute from './PrivateRoute';

function App() {

  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
        <div className="container">

          <Link className="navbar-brand fw-bold fs-3 text-warning" to="/">
            📚 Book Store
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">

            <ul className="navbar-nav ms-auto align-items-center gap-4">

              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold" to="/about">
                  About
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold" to="/books">
                  Books
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold" to="/contact">
                  Contact
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold" to="/cart">
                  🛒 Cart
                </Link>
              </li>

              {!user ? (
                <li className="nav-item">
                  <Link
                    className="btn btn-warning rounded-pill px-4 fw-bold"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
              ) : (
                <>
                  <li className="nav-item text-white fw-bold">
                    {user.username}
                  </li>

                  <li className="nav-item">
                    <button
                      className="btn btn-danger rounded-pill px-4 fw-bold"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}

            </ul>

          </div>
        </div>
      </nav>

      {/* Pages */}
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/books" element={<Books />} />

        <Route path="/contact" element={<Contact />} />
        
        <Route path="/cart" element={<AddToCart />} />

        <Route path="/login" element={<Login />} />

        {/* Protected Route */}
        {/* <Route
          path="/cart"
          element={
            <PrivateRoute>
              <AddToCart />
            </PrivateRoute>
          }
        />*/}

      </Routes> 

    </BrowserRouter>
  );
}

export default App;