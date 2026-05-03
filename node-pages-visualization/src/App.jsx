import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import GraphCanvas from './GraphCanvas';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import NavHeader from './NavHeader';
import './App.css';

export default function App() {
  const navigate = useNavigate();

  const [subjectFiles, setSubjectFiles] = useState([]);
  const [selected, setSelected] = useState('');
  const [data, setData] = useState(null);
  const [noData, setNoData] = useState(false);
  const [filter, setFilter] = useState('');
  const [savedSubject, setSavedSubject] = useLocalStorage('uwcompass-last-subject', '');

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
