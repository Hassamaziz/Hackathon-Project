import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { auth } from '../../Config/Firebase';
import { useAuthContext } from '../../Contexts/AuthContext';
import { signOut } from 'firebase/auth';
import logo from '../../Assets/icon-512.png';
import {FaTable,FaPersonBooth,FaBook,FaLaptop,FaKey} from "react-icons/fa"

function Sidebar() {
  const [user, setUser] = useState();
  const { setIsAuthenticated, isAuthenticated } = useAuthContext();
  const [isMobileNavActive, setMobileNavActive] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavActive(!isMobileNavActive);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        window.toastify('User signOut Successfully!!', 'success');
        setUser({});
        setIsAuthenticated(false);
      })
      .catch((error) => {
        // An error happened.
        window.toastify(error.message, 'error');
      });
  };

  return (
    <>
      <header id="header">
        <div className="d-flex flex-column">
          <div className="profile">
            <img src={logo} alt="" className="img-fluid rounded-circle" />
            <h2 className="text-light text-center">
              <a href="index.html">Student Management</a>
            </h2>
          </div>

          {/* Responsive Sidebar Toggle Button */}
          <button
          type="button"
          className={`mobile-nav-toggle ${isMobileNavActive ? 'active' : ''}`}
          onClick={toggleMobileNav}
        >
         
        </button>
        <nav className={`nav-menu ${isMobileNavActive ? 'active' : ''}`}>
          
<ul>
<li>
  <Link to={'/'} className="nav-link scrollto">
    <i><FaTable className="icons "/></i> <span>Dashboard</span>
  </Link>
</li>
<li>
  <Link to={'/student'} className="nav-link scrollto">
    <i className="bx bx-user"> <FaPersonBooth className='icons'/></i> <span>Students</span>
  </Link>
</li>
<li>
  <Link to={'/course'} className="nav-link scrollto">
    <i className="bx bx-file-blank"> <FaBook className='icons' /> </i> <span>Courses</span>
  </Link>
</li>
<li>
<Link to={'/attendence'} className="nav-link scrollto">
  <i className="bx bx-file-blank"><FaLaptop/> </i> <span>Attendance</span>
</Link>
</li>

{!isAuthenticated ? (
  <li>
    <Link to={'/auth/login'} className="nav-link scrollto">
      <i className="bx bx-book-content"><FaKey/></i> <span>Login</span>
    </Link>
  </li>
) : (
  <>
    <li>
      <Link onClick={handleLogout} className="btn btn-danger">
        <i className="bx bx-book-content"></i> <span>Logout</span>
      </Link>
    </li>
  </>
)}
</ul>
        </nav>
        </div>
      </header>
    </>
  );
}

export default Sidebar;
