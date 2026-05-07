import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',       path: '/' },
  { label: 'Features',   path: '/features' },
  { label: 'Visualizer', path: '/visualizer' },
  { label: 'Planners',   path: '/planners' },
  { label: 'History',    path: '/history' },
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
      {right ?? <div />}
    </header>
  );
}
