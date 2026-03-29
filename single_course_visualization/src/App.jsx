import React, { useEffect, useState, useMemo } from 'react';
import GraphCanvas from './GraphCanvas';
import './App.css';

function getSubject(courseId) {
  return courseId.replace(/\d.*$/, '');
}

function App() {
  const [data, setData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');

  useEffect(() => {
    fetch('/stat230_v2.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Error loading JSON:', err));
  }, []);

  const subjects = useMemo(() => {
    if (!data.length) return [];
    const followingCourses = data
      .filter(d => d.direction === 'following' && d.from_type === 'COURSE')
      .map(d => d.from);
    const subs = [...new Set(followingCourses.map(getSubject))].sort();
    return ['All', ...subs];
  }, [data]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {data.length > 0 && (
        <div className="subject-filter-bar">
          <span className="filter-label">Filter by subject:</span>
          {subjects.map(sub => (
            <button
              key={sub}
              className={`subject-chip${selectedSubject === sub ? ' active' : ''}`}
              onClick={() => setSelectedSubject(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
      <div style={{ flex: 1 }}>
        {data.length > 0 ? (
          <GraphCanvas rawData={data} selectedSubject={selectedSubject} />
        ) : (
          <p style={{ padding: '20px' }}>Loading Course Data...</p>
        )}
      </div>
    </div>
  );
}

export default App;
