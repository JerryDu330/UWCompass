import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';

const NAV_LINKS = [
  { label: 'Home',       path: '/' },
  { label: 'Features',   path: '/features' },
  { label: 'Visualizer', path: '/visualizer' },
  { label: 'Planners',   path: '/planners' },
  { label: 'Advisor',    path: '/advisor' },
  { label: 'History',    path: '/history' },
  { label: 'About',      path: '/about' },
];

export default function NavHeader({ right }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, signOut, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu]   = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const authSlot = loading ? null : user ? (
    <div className="nav-user" ref={menuRef}>
      <button
        className="nav-user-btn"
        onClick={() => setShowMenu(v => !v)}
        title={user.email}
      >
        <span className="nav-user-avatar">{user.email[0].toUpperCase()}</span>
        <span className="nav-user-email">{user.email}</span>
        <span className="nav-user-caret">▾</span>
      </button>
      {showMenu && (
        <div className="nav-user-menu">
          <div className="nav-user-menu-email">{user.email}</div>
          <button
            className="nav-user-menu-item nav-user-menu-signout"
            onClick={async () => { setShowMenu(false); await signOut(); }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  ) : (
    <button className="nav-signin-btn" onClick={() => setShowModal(true)}>
      Sign in
    </button>
  );

  return (
    <>
      <header className="header">
        <button className="logo-btn" onClick={() => navigate('/')}>
          UWCompass
        </button>
        <nav className="nav">
          {NAV_LINKS.map(({ label, path }) => {
            const isActive = path === '/planners'
              ? pathname === '/planners' || pathname.startsWith('/planner/') || pathname === '/cs-planner'
              : pathname === path;
            return (
              <button
                key={path}
                className={isActive ? 'nav-active' : ''}
                onClick={() => navigate(path)}
              >
                {label}
              </button>
            );
          })}
        </nav>
        <div className="nav-right">
          {right}
          {authSlot}
        </div>
      </header>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
}
