import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const STATS = [
  { value: '100+', label: 'CS courses mapped' },
  { value: '5+',   label: 'Career paths' },
  { value: '8',    label: 'Term degree plan' },
  { value: '∞',    label: 'Prereq chains' },
];

const STACK = [
  { icon: '⚛️', tech: 'React + Vite',  role: 'Frontend framework'       },
  { icon: '🔗', tech: 'ReactFlow',     role: 'Graph visualization'       },
  { icon: '🐍', tech: 'Python',        role: 'Data pipeline & parsing'   },
  { icon: '🧭', tech: 'React Router',  role: 'Client-side routing'       },
];

const navBtn = { background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'inherit' };

export default function About() {
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
    <div className="about-page">
      <div className="background-grid" />

      <header className="header">
        <div className="logo">UWCompass</div>
        <nav className="nav">
          <a><button onClick={() => navigate('/')} style={navBtn}>Home</button></a>
          <a><button onClick={() => navigate('/features')} style={navBtn}>Features</button></a>
          <a><button onClick={() => navigate('/visualizer')} style={navBtn}>Visualizer</button></a>
          <a><button onClick={() => navigate('/cs-planner')} style={navBtn}>CS Planner</button></a>
        </nav>
        <div />
      </header>

      <div className="about-hero">
        <span className="about-badge">About UWCompass</span>
        <h1>Built for UW Students,<br />by UW Students</h1>
        <p>
          Planning your CS degree at Waterloo should not require decoding a dense PDF
          every semester. UWCompass makes it visual, interactive, and fast.
        </p>
      </div>

      <div className="about-content">

        <div className="about-stats reveal">
          {STATS.map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="about-two-col">
          <div className="about-block reveal">
            <div className="about-block-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>🎯</div>
            <h2>The Problem</h2>
            <p>
              UW CS students juggle a complex prerequisite graph, alternating term availability,
              co-op schedules, and degree audit requirements — all spread across PDFs, spreadsheets,
              and the undergrad calendar. One wrong assumption can delay graduation by an entire term.
            </p>
          </div>
          <div className="about-block reveal">
            <div className="about-block-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>💡</div>
            <h2>Our Solution</h2>
            <p>
              UWCompass centralizes everything into an interactive visual tool. Explore prerequisites
              graphically, generate full degree roadmaps by career path, and check your eligibility
              in seconds — all without leaving the browser.
            </p>
          </div>
        </div>

        <section className="about-section reveal">
          <h2>Tech Stack</h2>
          <p className="about-section-sub">Built with modern, performant web tools.</p>
          <div className="tech-grid">
            {STACK.map(({ icon, tech, role }) => (
              <div key={tech} className="tech-card">
                <span className="tech-icon">{icon}</span>
                <strong className="tech-name">{tech}</strong>
                <span className="tech-role">{role}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="about-cta-section reveal">
          <h2>Ready to start planning?</h2>
          <p>Explore the prerequisite graph or build your full degree roadmap now.</p>
          <div className="about-cta-btns">
            <button className="secondary-btn" onClick={() => navigate('/visualizer')}>
              Open Visualizer →
            </button>
            <button className="secondary-btn" style={{ background: '#0891b2' }} onClick={() => navigate('/cs-planner')}>
              CS Planner →
            </button>
          </div>
        </section>

      </div>

      <footer className="footer"><p>© 2026 UWCompass</p></footer>
    </div>
  );
}
