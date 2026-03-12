import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import GraphCanvas from './GraphCanvas';
import './App.css';

export default function App() {
  const [subjectFiles, setSubjectFiles] = useState([]); // Start empty
  const [selected, setSelected] = useState('');        // Start empty
  const [data, setData] = useState(null);

  // Phase 1: Fetch the list of subjects on mount
  useEffect(() => {
    fetch('/subjects.json')
      .then(res => res.json())
      .then(list => {
        setSubjectFiles(list);
        setSelected(list[0]); // Set default selection once list is loaded
      })
      .catch(err => console.error("Error loading subject list:", err));
  }, []);

  useEffect(() => {
    if (!selected) return;
    
    // Fetch from the public/data folder
    fetch(`/data/${selected}.json`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Load error:", err));
  }, [selected]);

  return (
    <div className="app-container">
      <aside className="sidebar">
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
        <ReactFlowProvider>
          <GraphCanvas data={data} />
        </ReactFlowProvider>
      </main>
    </div>
  );
}