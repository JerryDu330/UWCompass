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
    fetch(`/data/${selected}.json`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, [selected]);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <button 
          onClick={() => navigate("/")} 
          className="back-home-btn"
          title="Return to Home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span>Exit Visualizer</span>
        </button>
        <div className="sidebar-header">COURSE EXPLORER</div>
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
      </aside>
      <main className="canvas-container">
        {/* Only ONE provider here */}
        <ReactFlowProvider>
          {data && <GraphCanvas data={data} subject={selected} />}
        </ReactFlowProvider>
      </main>
    </div>
  );
}
