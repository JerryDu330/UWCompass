import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavHeader from './NavHeader';
import { useLocalStorage } from './useLocalStorage';

const RECENT_KEY    = 'uwcompass-recent-courses';
const STARRED_KEY   = 'uwcompass-starred-courses';
const COMPLETED_KEY = 'uwcompass-completed';

function CourseRow({ course, actions }) {
  const navigate = useNavigate();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 16px', borderRadius: 12,
      background: 'white', border: '1px solid #e5e7eb',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.15s',
    }}
      onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)'}
      onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
    >
      <button
        onClick={() => navigate(`/course/${course}`)}
        style={{
          flex: 1, textAlign: 'left', background: 'none', border: 'none',
          cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#0f172a',
          padding: 0, fontFamily: 'inherit',
        }}
      >
        {course}
      </button>
      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>View tree →</span>
      {actions}
    </div>
  );
}

function SectionHeader({ title, count, countColor = '#5568ff', countBg = '#eef2ff', onClear, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>{title}</h2>
      {count != null && (
        <span style={{
          fontSize: 12, fontWeight: 700, color: countColor,
          background: countBg, borderRadius: 20, padding: '2px 9px',
        }}>{count}</span>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        {action}
        {onClear && (
          <button
            onClick={onClear}
            style={{
              padding: '5px 12px', borderRadius: 8,
              fontSize: 12, background: 'none', border: '1px solid #e2e8f0',
              color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.12s',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message, action }) {
  return (
    <div style={{
      padding: '28px 24px', textAlign: 'center', borderRadius: 12,
      background: '#f8faff', border: '1.5px dashed #e2e8f0',
      color: '#94a3b8', fontSize: 14, lineHeight: 1.6,
    }}>
      {message}
      {action && <div style={{ marginTop: 10 }}>{action}</div>}
    </div>
  );
}

const linkBtn = {
  background: 'none', border: 'none', color: '#5568ff',
  cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
  padding: 0,
};

export default function RecentlyViewed() {
  const navigate = useNavigate();
  const [recentCourses, setRecentCourses] = useLocalStorage(RECENT_KEY, []);
  const [starredCourses, setStarredCourses] = useLocalStorage(STARRED_KEY, []);
  const [completedCourses, setCompletedCourses] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]');
      setCompletedCourses(Array.isArray(saved) ? saved.sort() : []);
    } catch {}
  }, []);

  const toggleStar = (course) => {
    setStarredCourses(prev =>
      prev.includes(course) ? prev.filter(c => c !== course) : [course, ...prev]
    );
  };

  const StarBtn = ({ course }) => (
    <button
      onClick={() => toggleStar(course)}
      title={starredCourses.includes(course) ? 'Unstar' : 'Star'}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 18, lineHeight: 1, padding: '0 2px',
        color: starredCourses.includes(course) ? '#f59e0b' : '#d1d5db',
        transition: 'color 0.14s',
      }}
    >
      {starredCourses.includes(course) ? '★' : '☆'}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff' }}>
      <div className="background-grid" />
      <NavHeader />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 40px 80px', display: 'flex', flexDirection: 'column', gap: 44 }}>

        {/* ── Browsed Courses ─────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Browsed Courses"
            count={recentCourses.length}
            onClear={recentCourses.length ? () => setRecentCourses([]) : null}
          />
          {recentCourses.length === 0 ? (
            <EmptyState
              message="No courses browsed yet."
              action={<button style={linkBtn} onClick={() => navigate('/visualizer')}>Explore the Visualizer →</button>}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentCourses.map(course => (
                <CourseRow key={course} course={course} actions={<StarBtn course={course} />} />
              ))}
            </div>
          )}
        </section>

        {/* ── Starred Courses ──────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Starred"
            count={starredCourses.length}
            onClear={starredCourses.length ? () => setStarredCourses([]) : null}
          />
          {starredCourses.length === 0 ? (
            <EmptyState message="Star a course to save it here." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {starredCourses.map(course => (
                <CourseRow
                  key={course}
                  course={course}
                  actions={
                    <button
                      onClick={() => toggleStar(course)}
                      title="Unstar"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#f59e0b', padding: '0 2px' }}
                    >★</button>
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Courses Taken ─────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Courses Taken"
            count={completedCourses.length || undefined}
            countColor="#16a34a"
            countBg="#f0fdf4"
            action={
              <button
                onClick={() => navigate('/cs-planner')}
                style={{
                  padding: '5px 12px', borderRadius: 8, fontSize: 12,
                  background: 'none', border: '1px solid #e2e8f0',
                  color: '#5568ff', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit',
                }}
              >
                Edit in CS Planner →
              </button>
            }
          />
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
            Courses marked as completed in the CS Planner.
          </p>
          {completedCourses.length === 0 ? (
            <EmptyState
              message="No courses marked as taken yet."
              action={<button style={linkBtn} onClick={() => navigate('/cs-planner')}>Open CS Planner →</button>}
            />
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {completedCourses.map(course => (
                <button
                  key={course}
                  onClick={() => navigate(`/course/${course}`)}
                  style={{
                    padding: '6px 16px', borderRadius: 20, fontSize: 13,
                    background: '#f0fdf4', color: '#16a34a',
                    border: '1px solid #bbf7d0', cursor: 'pointer',
                    fontWeight: 600, fontFamily: 'inherit',
                    transition: 'all 0.14s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#dcfce7'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#f0fdf4'; }}
                >
                  {course}
                </button>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
