import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import NavHeader from './NavHeader';
import './CSPlanner.css';

const FALLBACK_COLORS = { bg: '#f9fafb', text: '#6b7280', border: '#d1d5db' };

function Chip({ code, completed, onToggle, courseInfo, typeColors }) {
  const info = courseInfo[code];
  if (!info) return null;
  const colors = typeColors[info.type] || FALLBACK_COLORS;
  const isDone = completed.has(code);
  const isPlaceholder = !!info.placeholder;

  return (
    <button
      className={`chip${isDone ? ' chip-done' : ''}${isPlaceholder ? ' chip-placeholder' : ''}`}
      style={{
        background:  isDone ? '#f0fdf4' : colors.bg,
        color:       isDone ? '#15803d' : colors.text,
        borderColor: isDone ? '#86efac' : colors.border,
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

function TermRow({ term, completed, onToggle, courseInfo, typeColors }) {
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
          <Chip
            key={code}
            code={code}
            completed={completed}
            onToggle={onToggle}
            courseInfo={courseInfo}
            typeColors={typeColors}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProgramPlanner({ config }) {
  const {
    id, badge, heroTitle, heroDesc, calendarUrl, calendarLabel,
    courseInfo, typeColors, legend, paths, generatePlan, shortTitle,
  } = config;

  const [savedPathId, setSavedPathId] = useLocalStorage(`uwcompass-path-${id}`, null);
  const [selectedPath, setSelectedPath] = useState(
    () => paths.find(p => p.id === savedPathId) ?? null
  );
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem(`uwcompass-completed-${id}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(`uwcompass-completed-${id}`, JSON.stringify([...completed]));
  }, [completed, id]);

  const toggleCompleted = (code) => {
    if (courseInfo[code]?.placeholder) return;
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const plan = selectedPath ? generatePlan(selectedPath) : null;

  const allReal = plan
    ? plan.flatMap(t => t.courses).filter(c => !courseInfo[c]?.placeholder)
    : [];
  const total = allReal.length;
  const done = allReal.filter(c => completed.has(c)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="planner-page">
      <div className="background-grid" />
      <NavHeader />
      <div className="planner-content">

        <div className="planner-hero">
          <span className="hero-badge">{badge}</span>
          <h1>{heroTitle}</h1>
          <p>{heroDesc}</p>
        </div>

        <section className="planner-section">
          <div className="section-head">
            <span className="step-pill">Step 1</span>
            <h2>Choose Your Career Path</h2>
            <p>Each path surfaces different upper-year electives while sharing the same core requirements.</p>
          </div>

          <div className="path-grid">
            {paths.map(path => (
              <button
                key={path.id}
                className={`path-card${selectedPath?.id === path.id ? ' path-selected' : ''}`}
                style={{ '--pc': path.color, '--pl': path.colorLight }}
                onClick={() => {
                  const newPlanCourses = new Set(
                    generatePlan(path).flatMap(t => t.courses).filter(c => !courseInfo[c]?.placeholder)
                  );
                  setCompleted(prev => new Set([...prev].filter(c => newPlanCourses.has(c))));
                  setSelectedPath(path);
                  setSavedPathId(path.id);
                }}
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

        {plan && (
          <section className="planner-section">
            <div className="section-head">
              <span className="step-pill">Step 2</span>
              <h2>Your {selectedPath.title} Plan</h2>
              <p>
                Fixed terms show core requirements. Later terms blend core with your
                path&apos;s electives. Click a course to toggle completed.
              </p>
            </div>

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

            <div className="legend">
              {legend.map(([type, label]) => {
                const c = typeColors[type] || FALLBACK_COLORS;
                return (
                  <div key={type} className="legend-item">
                    <span className="legend-dot" style={{ background: c.bg, border: `2px solid ${c.border}` }} />
                    <span style={{ color: c.text }}>{label}</span>
                  </div>
                );
              })}
            </div>

            <div className="terms-list">
              {plan.map(term => (
                <TermRow
                  key={term.term}
                  term={term}
                  completed={completed}
                  onToggle={toggleCompleted}
                  courseInfo={courseInfo}
                  typeColors={typeColors}
                />
              ))}
            </div>

            <p className="disclaimer">
              This plan is illustrative. Actual course availability, co-op scheduling, and
              prerequisite details should be verified against the&nbsp;
              <a href={calendarUrl} target="_blank" rel="noreferrer">
                {calendarLabel}
              </a>.
            </p>
          </section>
        )}

      </div>
      <footer className="footer">
        <p>© 2026 UWCompass — Based on UW {shortTitle} Honours checklist</p>
      </footer>
    </div>
  );
}
