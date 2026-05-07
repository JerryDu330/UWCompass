import { useNavigate } from 'react-router-dom';
import NavHeader from './NavHeader';
import './PlannerHub.css';

const PROGRAMS = [
  {
    id: 'cs',
    title: 'Computer Science',
    subtitle: 'Honours · Math Faculty',
    description:
      'Plan your CS degree with career-focused paths — AI/ML, Systems, Software Engineering, Theory, Data Science, and Security.',
    icon: '💻',
    color: '#5568ff',
    colorLight: '#eef2ff',
    paths: 6,
    route: '/planner/cs',
    highlights: ['Algorithms & Theory', 'Machine Learning', 'Systems & Networking', 'Software Engineering'],
  },
  {
    id: 'se',
    title: 'Software Engineering',
    subtitle: 'Honours · Engineering Faculty',
    description:
      'Navigate the joint CS/ECE program with paths in Full-Stack, Embedded Systems, AI/ML, Cloud & Distributed Systems, and Security.',
    icon: '⚙️',
    color: '#dc2626',
    colorLight: '#fee2e2',
    paths: 5,
    route: '/planner/se',
    highlights: ['CS + ECE Core', 'Capstone Design Project', 'Real-Time Systems', 'Application Development'],
  },
  {
    id: 'ece',
    title: 'Elec. & Computer Engineering',
    subtitle: 'Honours · Engineering Faculty',
    description:
      'Design circuits, embedded systems, signal processing, and computer architecture across four specialised paths.',
    icon: '⚡',
    color: '#c2410c',
    colorLight: '#fff7ed',
    paths: 4,
    route: '/planner/ece',
    highlights: ['Computer Architecture', 'VLSI & Circuits', 'Communications', 'Control & Power'],
  },
  {
    id: 'math',
    title: 'Pure Mathematics',
    subtitle: 'Honours · Math Faculty',
    description:
      'Explore the foundations of mathematics — real analysis, abstract algebra, combinatorics and optimization, or applied mathematics.',
    icon: 'π',
    color: '#7c3aed',
    colorLight: '#f5f3ff',
    paths: 4,
    route: '/planner/math',
    highlights: ['Real & Functional Analysis', 'Abstract Algebra', 'Combinatorics & Optimization', 'Applied Math & ODEs'],
  },
  {
    id: 'stat',
    title: 'Statistics',
    subtitle: 'Honours · Math Faculty',
    description:
      'Apply probability theory and statistical inference to data science, biostatistics, financial modelling, and more.',
    icon: '∑',
    color: '#0f766e',
    colorLight: '#f0fdfa',
    paths: 4,
    route: '/planner/stat',
    highlights: ['Statistical Learning & ML', 'Biostatistics', 'Financial Statistics', 'Probability Theory'],
  },
];

export default function PlannerHub() {
  const navigate = useNavigate();

  return (
    <div className="hub-page">
      <div className="background-grid" />
      <NavHeader />

      <div className="hub-content">
        <div className="hub-hero">
          <span className="hub-hero-badge">UWCompass · Degree Planners</span>
          <h1>Plan Your UW Degree</h1>
          <p>
            Choose your program to generate a personalised 8-term plan.
            Track completed courses, explore career paths, and map your route to graduation.
          </p>
        </div>

        <div className="hub-grid">
          {PROGRAMS.map(prog => (
            <button
              key={prog.id}
              className="hub-card"
              style={{ '--hc': prog.color, '--hl': prog.colorLight }}
              onClick={() => navigate(prog.route)}
            >
              <div className="hub-card-top">
                <div className="hub-icon" style={{ background: prog.colorLight, color: prog.color }}>
                  {prog.icon}
                </div>
              </div>

              <div className="hub-card-titles">
                <h2 className="hub-prog-title">{prog.title}</h2>
                <p className="hub-prog-subtitle">{prog.subtitle}</p>
              </div>

              <p className="hub-prog-desc">{prog.description}</p>

              <ul className="hub-highlights">
                {prog.highlights.map(h => (
                  <li key={h} style={{ color: prog.color }}>
                    <span className="hub-highlight-dot" style={{ background: prog.color }} />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="hub-card-footer">
                <span className="hub-paths-count">{prog.paths} career paths</span>
                <span className="hub-cta" style={{ color: prog.color }}>
                  Open Planner →
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="hub-disclaimer">
          All planners are illustrative guides based on UW undergraduate program requirements.
          Verify your actual requirements with your academic advisor and the{' '}
          <a href="https://ugradcalendar.uwaterloo.ca" target="_blank" rel="noreferrer">
            UW undergraduate calendar
          </a>.
        </p>
      </div>

      <footer className="footer">
        <p>© 2026 UWCompass</p>
      </footer>
    </div>
  );
}
