import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import CourseTreeCanvas from './CourseTreeCanvas';
import './CourseTree.css';

function getSubject(courseId) {
  return courseId.replace(/\d.*$/, '');
}

export default function CourseTreePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const subject = getSubject(courseId);

  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('All');

  useEffect(() => {
    setData([]);
    setNoData(false);
    setSelectedSubject('All');
    fetch(`/single-course-tree/${subject}/${courseId}_collapsed.json`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(json => {
        if (!json || !json.length) { setNoData(true); return; }
        setData(json);
      })
      .catch(() => setNoData(true));
  }, [courseId, subject]);

  const subjects = useMemo(() => {
    if (!data.length) return [];
    const following = data
      .filter(d => d.direction === 'following' && d.from_type === 'COURSE')
      .map(d => d.from);
    const subs = [...new Set(following.map(getSubject))].sort();
    return ['All', ...subs];
  }, [data]);

  return (
    <div className="ct-page">
      {/* Header */}
      <header className="ct-header">
        <button className="ct-back-btn" onClick={() => navigate('/visualizer')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Visualizer
        </button>
        <div className="ct-header-divider" />
        <span className="ct-header-logo">UWCompass</span>
        <div className="ct-header-divider" />
        <span className="ct-header-course">{courseId}</span>
        <span className="ct-header-label">Course Tree</span>
      </header>

      {/* Subject filter */}
      {data.length > 0 && (
        <div className="ct-filter-bar">
          <span className="ct-filter-label">Filter by subject:</span>
          {subjects.map(sub => (
            <button
              key={sub}
              className={`ct-chip${selectedSubject === sub ? ' active' : ''}`}
              onClick={() => setSelectedSubject(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Canvas / states */}
      <div className="ct-canvas">
        {data.length > 0 && (
          <ReactFlowProvider>
            <CourseTreeCanvas
              rawData={data}
              selectedSubject={selectedSubject}
              courseId={courseId}
            />
          </ReactFlowProvider>
        )}

        {noData && (
          <div className="ct-state">
            <div className="ct-state-icon">🔍</div>
            <div className="ct-state-title">No tree data for {courseId}</div>
            <div className="ct-state-subtitle">
              Course tree data is not available for this course yet.
            </div>
          </div>
        )}

        {!data.length && !noData && (
          <div className="ct-state">
            <div className="ct-state-icon">⏳</div>
            <div className="ct-state-title">Loading {courseId}…</div>
          </div>
        )}
      </div>
    </div>
  );
}
