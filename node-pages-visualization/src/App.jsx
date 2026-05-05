import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import GraphCanvas from './GraphCanvas';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import NavHeader from './NavHeader';
import './App.css';

const INTRO_SEEN_KEY = 'uwcompass-viz-intro-seen';

const LEVEL_COLORS = [
  { color: '#0ea5e9', label: '100-level' },
  { color: '#a855f7', label: '200-level' },
  { color: '#5568ff', label: '300-level' },
  { color: '#7c3aed', label: '400-level' },
  { color: '#64748b', label: 'Other subjects' },
];

const STEPS = [
  {
    icon: '🎨',
    title: 'Node colors = course level',
    body: (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {LEVEL_COLORS.map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 16, borderRadius: 4, background: color }} />
            <span style={{ fontSize: 12, color: '#64748b' }}>{label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '✦',
    title: 'Hover to trace chains',
    body: (
      <p style={{ fontSize: 13, color: '#64748b', margin: '6px 0 0', lineHeight: 1.6 }}>
        Hovering a node highlights its <strong style={{ color: '#1a1a1a' }}>direct</strong> prereqs and dependents (solid),
        and the full <strong style={{ color: '#1a1a1a' }}>indirect chain</strong> (faded). Everything else dims out.
      </p>
    ),
  },
  {
    icon: '↗',
    title: 'Click to explore a course tree',
    body: (
      <p style={{ fontSize: 13, color: '#64748b', margin: '6px 0 0', lineHeight: 1.6 }}>
        Clicking any node opens its dedicated course tree — showing prerequisites on the left and
        courses that depend on it on the right.
      </p>
    ),
  },
];

const VisualizerIntro = ({ onDismiss }) => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 100,
    background: 'rgba(15,23,42,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(3px)',
  }}>
    <div style={{
      background: 'white', borderRadius: 18,
      padding: '32px 36px',
      boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
      maxWidth: 460, width: '90%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      animation: 'fadeInPage 0.25s ease-out',
    }}>
      <div style={{ marginBottom: 6 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: '#5568ff',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>How it works</span>
      </div>
      <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
        Prerequisite Visualizer
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {STEPS.map(({ icon, title, body }) => (
          <div key={title} style={{ display: 'flex', gap: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: '#eef2ff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 17,
            }}>{icon}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{title}</div>
              {body}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onDismiss}
        style={{
          marginTop: 28, width: '100%', padding: '11px 0',
          background: '#5568ff', color: 'white',
          border: 'none', borderRadius: 10, cursor: 'pointer',
          fontSize: 14, fontWeight: 700,
          boxShadow: '0 4px 14px rgba(85,104,255,0.35)',
          transition: 'opacity 0.15s',
        }}
        onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
        onMouseOut={e => e.currentTarget.style.opacity = '1'}
      >
        Got it — explore
      </button>
    </div>
  </div>
);

export default function App() {
  const navigate = useNavigate();

  const [subjectFiles, setSubjectFiles] = useState([]);
  const [selected, setSelected] = useState('');
  const [data, setData] = useState(null);
  const [noData, setNoData] = useState(false);
  const [filter, setFilter] = useState('');
  const [savedSubject, setSavedSubject] = useLocalStorage('uwcompass-last-subject', '');
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem(INTRO_SEEN_KEY));

  const dismissIntro = () => {
    localStorage.setItem(INTRO_SEEN_KEY, '1');
    setShowIntro(false);
  };

  useEffect(() => {
    fetch('/subjects.json')
      .then(res => res.json())
      .then(list => {
        setSubjectFiles(list);
        const initial = savedSubject && list.includes(savedSubject) ? savedSubject : list[0] || '';
        setSelected(initial);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setData(null);
    setNoData(false);
    fetch(`/subject/${selected}.json`)
      .then(res => res.json())
      .then(json => {
        if (!json || Object.keys(json).length === 0) {
          setNoData(true);
        } else {
          setData(json);
        }
      })
      .catch(() => setNoData(true));
  }, [selected]);

  const filtered = subjectFiles.filter(s =>
    s.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="app-container">
      <NavHeader />

      <div className="app-body">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-title">Subjects</span>
            <span className="sidebar-count">{filtered.length}</span>
          </div>

          <div className="sidebar-search">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              placeholder="Filter…"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
            {filter && (
              <button className="sidebar-search-clear" onClick={() => setFilter('')}>×</button>
            )}
          </div>

          <div className="course-list">
            {filtered.length === 0 ? (
              <div className="sidebar-no-results">No match for "{filter}"</div>
            ) : (
              filtered.map(name => (
                <div
                  key={name}
                  className={`course-item ${selected === name ? 'active' : ''}`}
                  onClick={() => { setSelected(name); setSavedSubject(name); }}
                >
                  {name}
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="canvas-container">
          {showIntro && <VisualizerIntro onDismiss={dismissIntro} />}
          <ReactFlowProvider>
            {data && <GraphCanvas data={data} subject={selected} />}

            {!data && !noData && selected && (
              <div className="loading-state">
                <div className="loading-spinner" />
                <div className="loading-text">Loading {selected}…</div>
              </div>
            )}

            {noData && (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">No graph available for {selected}</div>
                <div className="empty-state-subtitle">
                  This subject does not have prerequisite data yet.
                </div>
              </div>
            )}
          </ReactFlowProvider>
        </main>
      </div>
    </div>
  );
}
