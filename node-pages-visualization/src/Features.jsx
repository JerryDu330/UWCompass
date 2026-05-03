import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Features.css';

const FEATURES = [
  {
    icon: '🔗',
    title: 'Prerequisite Visualization',
    tagline: 'See the full course dependency graph',
    desc: 'Interactive graphs let you explore the entire CS prerequisite network. Pan, zoom, and search to find any course at a glance.',
    bullets: ['AND / OR prerequisite logic', 'Grade and level requirements', 'All CS subjects in one view'],
    cta: 'Open Visualizer',
    route: '/visualizer',
    color: '#5568ff',
  },
  {
    icon: '🌳',
    title: 'Course Prerequisite Tree',
    tagline: "Drill into a single course's dependency chain",
    desc: 'Click any course to get a focused tree showing only the path of prerequisites leading to it — no noise, just the courses you need.',
    bullets: ['Recursive prereq expansion', 'Highlights exact course path', 'Share-ready course links'],
    cta: 'Explore a Course',
    route: '/visualizer',
    color: '#7c3aed',
  },
  {
    icon: '🗺️',
    title: 'CS Degree Planner',
    tagline: 'An 8-term roadmap tailored to your career path',
    desc: 'Choose from ML, Systems, Software Engineering, and more. UWCompass generates a full plan based on the UW CS Honours checklist.',
    bullets: ['Multiple career path options', 'Toggle courses as completed', 'Real-time progress tracking'],
    cta: 'Open CS Planner',
    route: '/cs-planner',
    color: '#0891b2',
  },
  {
    icon: '✅',
    title: 'Eligibility Checker',
    tagline: 'Find out what you can take right now',
    desc: 'Select the courses you have already completed and instantly see which courses you are eligible to take next term.',
    bullets: ['Instant eligibility results', 'No account needed', 'Based on real UW prerequisites'],
    cta: 'Check Eligibility',
    route: '/',
    color: '#16a34a',
  },
];

const navBtn = { background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'inherit' };

export default function Features() {
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('active');
      });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="features-page">
      <div className="background-grid" />

      <header className="header">
        <div className="logo">UWCompass</div>
        <nav className="nav">
          <a><button onClick={() => navigate('/')} style={navBtn}>Home</button></a>
          <a><button onClick={() => navigate('/visualizer')} style={navBtn}>Visualizer</button></a>
          <a><button onClick={() => navigate('/cs-planner')} style={navBtn}>CS Planner</button></a>
          <a><button onClick={() => navigate('/about')} style={navBtn}>About</button></a>
        </nav>
        <div />
      </header>

      <div className="fp-hero">
        <span className="fp-badge">What UWCompass Offers</span>
        <h1>Tools for Every Step of Your CS Journey</h1>
        <p>From first-year course selection to mapping your final-year electives, UWCompass has you covered.</p>
      </div>

      <div className="fp-list">
        {FEATURES.map((f, i) => (
          <div key={f.title} className={`fp-row reveal${i % 2 === 1 ? ' fp-row-flip' : ''}`}>
            <div className="fp-visual" style={{ background: f.color + '10', border: `1.5px solid ${f.color}28` }}>
              <div className="fp-icon-wrap" style={{ background: f.color + '1a', color: f.color }}>
                {f.icon}
              </div>
              <div className="fp-tagline" style={{ color: f.color }}>{f.tagline}</div>
            </div>
            <div className="fp-text">
              <h2>{f.title}</h2>
              <p className="fp-desc">{f.desc}</p>
              <ul className="fp-bullets">
                {f.bullets.map(b => (
                  <li key={b}>
                    <span className="fp-dot" style={{ background: f.color }} />
                    {b}
                  </li>
                ))}
              </ul>
              <button
                className="secondary-btn"
                style={{ background: f.color }}
                onClick={() => navigate(f.route)}
              >
                {f.cta} →
              </button>
            </div>
          </div>
        ))}
      </div>

      <footer className="footer"><p>© 2026 UWCompass</p></footer>
    </div>
  );
}
