import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import CourseTreeCanvas from './CourseTreeCanvas';
import NavHeader from './NavHeader';
import './CourseTree.css';

const RECENTLY_VIEWED_KEY = 'uwcompass-recent-courses';
const MAX_RECENT = 10;

function addRecentCourse(courseId) {
  try {
    const saved = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
    const updated = [courseId, ...saved.filter(c => c !== courseId)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {}
}

function getSubject(courseId) {
  return courseId.replace(/\d.*$/, '');
}

export default function CourseTreePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const subject = getSubject(courseId);

  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
  // null = not yet initialised (show all). Set = explicit selection.
  const [selectedSubjects, setSelectedSubjects] = useState(null);
  const [selectedLevels, setSelectedLevels] = useState(new Set(['1','2','3','4']));
  const [starred, setStarred] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('uwcompass-starred-courses') || '[]')); }
    catch { return new Set(); }
  });

  const toggleStar = () => {
    setStarred(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId); else next.add(courseId);
      localStorage.setItem('uwcompass-starred-courses', JSON.stringify([...next]));
      return next;
    });
  };

  useEffect(() => {
    addRecentCourse(courseId);
    setData([]);
    setNoData(false);
    setSelectedSubjects(null);
    setSelectedLevels(new Set(['1','2','3','4']));
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
    return [...new Set(following.map(getSubject))].sort();
  }, [data]);

  // Once subjects are known, initialise selection to "all selected"
  useEffect(() => {
    if (subjects.length > 0) {
      setSelectedSubjects(prev => prev === null ? new Set(subjects) : prev);
    }
  }, [subjects]);

  const toggleSubject = (sub) => {
    setSelectedSubjects(prev => {
      const next = new Set(prev ?? subjects);
      if (next.has(sub)) next.delete(sub); else next.add(sub);
      return next;
    });
  };

  const toggleLevel = (lvl) => {
    setSelectedLevels(prev => {
      const next = new Set(prev);
      if (next.has(lvl)) next.delete(lvl); else next.add(lvl);
      return next;
    });
  };

  return (
    <div className="ct-page">
      <NavHeader right={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{courseId}</span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Course Tree</span>
          <button
            onClick={toggleStar}
            title={starred.has(courseId) ? 'Unstar' : 'Star this course'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 20, lineHeight: 1, padding: '0 2px',
              color: starred.has(courseId) ? '#f59e0b' : '#d1d5db',
            }}
          >
            {starred.has(courseId) ? '★' : '☆'}
          </button>
        </div>
      } />

      {/* Filter bar */}
      {data.length > 0 && (
        <div className="ct-filter-bar">
          {/* Subject group */}
          <span className="ct-filter-label">Subject</span>
          <button className="ct-filter-action-btn" onClick={() => setSelectedSubjects(new Set(subjects))}>All</button>
          <button className="ct-filter-action-btn" onClick={() => setSelectedSubjects(new Set())}>None</button>
          {subjects.map(sub => (
            <button
              key={sub}
              className={`ct-chip${(selectedSubjects === null || selectedSubjects.has(sub)) ? ' active' : ''}`}
              onClick={() => toggleSubject(sub)}
            >{sub}</button>
          ))}

          {/* Divider */}
          <div className="ct-filter-sep" />

          {/* Level group */}
          <span className="ct-filter-label">Level</span>
          <button className="ct-filter-action-btn" onClick={() => setSelectedLevels(new Set(['1','2','3','4']))}>All</button>
          <button className="ct-filter-action-btn" onClick={() => setSelectedLevels(new Set())}>None</button>
          {['1','2','3','4'].map(lvl => (
            <button
              key={lvl}
              className={`ct-chip ct-chip-level${selectedLevels.has(lvl) ? ' active' : ''}`}
              onClick={() => toggleLevel(lvl)}
            >{lvl}00</button>
          ))}
        </div>
      )}

      {/* Canvas / states */}
      <div className="ct-canvas">
        {data.length > 0 && (
          <ReactFlowProvider>
            <CourseTreeCanvas
              rawData={data}
              selectedSubjects={selectedSubjects}
              selectedLevels={selectedLevels}
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
