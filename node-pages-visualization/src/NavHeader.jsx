import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',       path: '/' },
  { label: 'Features',   path: '/features' },
  { label: 'Visualizer', path: '/visualizer' },
  { label: 'CS Planner', path: '/cs-planner' },
  { label: 'About',      path: '/about' },
];

export default function NavHeader({ right }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="header">
      <button className="logo-btn" onClick={() => navigate('/')}>
        UWCompass
      </button>
      <nav className="nav">
        {NAV_LINKS.map(({ label, path }) => (
          <button
            key={path}
            className={pathname === path ? 'nav-active' : ''}
            onClick={() => navigate(path)}
          >
            {label}
          </button>
        ))}
      </nav>
      {right ?? <div />}
    </header>
  );
}
