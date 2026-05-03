import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CAREER_PATHS, COURSE_INFO, generatePlan, TYPE_COLORS } from './csData';
import './CSPlanner.css';

// ─── Course chip ─────────────────────────────────────────────────────────────
function Chip({ code, completed, onToggle }) {
  const info = COURSE_INFO[code];
  if (!info) return null;
  const colors = TYPE_COLORS[info.type] || TYPE_COLORS.breadth;
  const isDone = completed.has(code);
  const isPlaceholder = !!info.placeholder;

  return (
    <button
      className={`chip${isDone ? ' chip-done' : ''}${isPlaceholder ? ' chip-placeholder' : ''}`}
      style={{
        background:   isDone ? '#f0fdf4' : colors.bg,
        color:        isDone ? '#15803d' : colors.text,
        borderColor:  isDone ? '#86efac' : colors.border,
      }}
      onClick={() => !isPlaceholder && onToggle(code)}
      title={info.note}
    >
      {isDone && <span className="chip-check">✓ </span>}
      {!isPlaceholder && <strong className="chip-code">{code} </strong>}
      <span className="chip-name">{info.name}</span>
    </button>
  );
}

// ─── Term row ────────────────────────────────────────────────────────────────
function TermRow({ term, completed, onToggle }) {
  return (
    <div className={`term-row${term.fixed ? ' term-fixed' : ''}`}>
      <div className="term-meta">
        <span className="term-id">{term.term}</span>
        <span className="term-label-text">{term.label}</span>
        {term.fixed && <span className="core-badge">Core</span>}
        {term.note && <span className="term-note">{term.note}</span>}
      </div>
      <div className="term-chips">
        {term.courses.map(code => (
          <Chip key={code} code={code} completed={completed} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function CSPlanner() {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState(null);
  const [completed, setCompleted] = useState(new Set());

  const toggleCompleted = (code) => {
    if (COURSE_INFO[code]?.placeholder) return;
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const plan = selectedPath ? generatePlan(selectedPath) : null;

  const allReal = plan
    ? plan.flatMap(t => t.courses).filter(c => !COURSE_INFO[c]?.placeholder)
    : [];
  const total = allReal.length;
  const done = allReal.filter(c => completed.has(c)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="planner-page">
      <div className="background-grid" />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="header">
        <div className="logo">UWCompass</div>
        <nav className="nav">
          <a>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'inherit' }}
            >Home</button>
          </a>
          <a>
            <button
              onClick={() => navigate('/visualizer')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'inherit' }}
            >Visualizer</button>
          </a>
        </nav>
        <div />
      </header>

      <div className="planner-content">

        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <div className="planner-hero">
          <span className="hero-badge">CS Honours · Degree Planner</span>
          <h1>Build Your CS Roadmap</h1>
          <p>
            Choose a career path to generate a personalised 8-term plan built on
            the UW Computer Science Honours checklist. Click any course chip to mark it complete.
          </p>
        </div>

        {/* ── Step 1: path selection ───────────────────────────────────────────── */}
        <section className="planner-section">
          <div className="section-head">
            <span className="step-pill">Step 1</span>
            <h2>Choose Your Career Path</h2>
            <p>Each path surfaces different upper-year electives while sharing the same CS core.</p>
          </div>

          <div className="path-grid">
            {CAREER_PATHS.map(path => (
              <button
                key={path.id}
                className={`path-card${selectedPath?.id === path.id ? ' path-selected' : ''}`}
                style={{ '--pc': path.color, '--pl': path.colorLight }}
                onClick={() => { setSelectedPath(path); setCompleted(new Set()); }}
              >
                <div className="path-icon" style={{ background: path.colorLight, color: path.color }}>
                  {path.icon}
                </div>
                <h3 className="path-title">{path.title}</h3>
                <p className="path-desc">{path.description}</p>
                <div className="path-skills">
                  {path.skills.map(s => (
                    <span key={s} className="skill-chip" style={{ background: path.colorLight, color: path.color }}>
                      {s}
                    </span>
                  ))}
                </div>
                {selectedPath?.id === path.id && (
                  <div className="path-selected-label" style={{ color: path.color }}>✓ Selected</div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ── Step 2: degree plan ──────────────────────────────────────────────── */}
        {plan && (
          <section className="planner-section">
            <div className="section-head">
              <span className="step-pill">Step 2</span>
              <h2>Your {selectedPath.title} Plan</h2>
              <p>
                Terms 1A – 2A are fixed core requirements. Later terms blend core CS with your
                path's electives. Click a course to toggle completed.
              </p>
            </div>

            {/* Progress */}
            <div className="progress-card">
              <div className="progress-top">
                <span className="progress-text">
                  <strong>{done}</strong> / {total} required courses completed
                </span>
                <span className="progress-pct" style={{ color: selectedPath.color }}>{pct}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${pct}%`, background: selectedPath.color }}
                />
              </div>
            </div>

            {/* Legend */}
            <div className="legend">
              {[
                ['cs',       'CS Course'],
                ['math',     'MATH Course'],
                ['stat',     'STAT Course'],
                ['commst',   'Communication'],
                ['breadth',  'Breadth / Depth'],
                ['elective', 'CS Elective'],
                ['free',     'Free Elective'],
              ].map(([type, label]) => (
                <div key={type} className="legend-item">
                  <span
                    className="legend-dot"
                    style={{ background: TYPE_COLORS[type].bg, border: `2px solid ${TYPE_COLORS[type].border}` }}
                  />
                  <span style={{ color: TYPE_COLORS[type].text }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Term rows */}
            <div className="terms-list">
              {plan.map(term => (
                <TermRow
                  key={term.term}
                  term={term}
                  completed={completed}
                  onToggle={toggleCompleted}
                />
              ))}
            </div>

            {/* Disclaimer */}
            <p className="disclaimer">
              This plan is illustrative. Actual course availability, co-op scheduling, and
              prerequisite details should be verified against the&nbsp;
              <a
                href="https://ugradcalendar.uwaterloo.ca/page/MATH-Computer-Science"
                target="_blank"
                rel="noreferrer"
              >
                UW undergraduate calendar
              </a>.
            </p>
          </section>
        )}

      </div>

      <footer className="footer">
        <p>© 2026 UWCompass — Based on UW CS Honours checklist</p>
      </footer>
    </div>
  );
}
