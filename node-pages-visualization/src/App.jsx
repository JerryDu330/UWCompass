import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import GraphCanvas from './GraphCanvas';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function App() {
  const navigate = useNavigate();

  const [subjectFiles, setSubjectFiles] = useState([]);
  const [selected, setSelected] = useState('');
  const [data, setData] = useState(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    fetch('/subjects.json')
      .then(res => res.json())
      .then(list => {
        setSubjectFiles(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setData(null);
    setNoData(false);
    fetch(`/data/${selected}.json`)
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

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo">UWCompass</span>
          <span className="sidebar-subtitle">Prerequisite Visualizer</span>
        </div>
        <div className="course-list">
          {subjectFiles.map(name => (
            <div
              key={name}
              className={`course-item ${selected === name ? 'active' : ''}`}
              onClick={() => setSelected(name)}
            >
              {name}
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate("/")}
          className="back-home-btn"
          title="Return to Home"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span>Back to Home</span>
        </button>
      </aside>
      <main className="canvas-container">
        <ReactFlowProvider>
          {data && <GraphCanvas data={data} subject={selected} />}
          {noData && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-title">No graph available for {selected}</div>
              <div className="empty-state-subtitle">
                This subject does not have prerequisite data yet. Select another subject from the sidebar.
              </div>
            </div>
          )}
        </ReactFlowProvider>
      </main>
    </div>
  );
}
