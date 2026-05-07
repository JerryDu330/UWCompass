import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NavHeader from './NavHeader';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

const RECENT_KEY  = 'uwcompass-recent-courses';
const STARRED_KEY = 'uwcompass-starred-courses';

const PROGRAMS = [
  { id: 'cs',   label: 'Computer Science',               path: '/planner/cs'   },
  { id: 'se',   label: 'Software Engineering',           path: '/planner/se'   },
  { id: 'math', label: 'Pure Mathematics',               path: '/planner/math' },
  { id: 'stat', label: 'Statistics',                     path: '/planner/stat' },
  { id: 'ece',  label: 'Electrical & Computer Eng.',     path: '/planner/ece'  },
];

function readLocalCompleted(programId) {
  try {
    const raw = localStorage.getItem(`uwcompass-completed-${programId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function readLocalPath(programId) {
  try { return JSON.parse(localStorage.getItem(`uwcompass-path-${programId}`)); }
  catch { return null; }
}

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
            Clear all
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
  const { user } = useAuth();
  const [recentCourses,  setRecentCourses]  = useLocalStorage(RECENT_KEY,  []);
  const [starredCourses, setStarredCourses] = useLocalStorage(STARRED_KEY, []);

  // completed: { cs: ['CS135', ...], se: [...], ... }
  const [completed, setCompleted] = useState(() =>
    Object.fromEntries(PROGRAMS.map(p => [p.id, readLocalCompleted(p.id)]))
  );

  const totalCompleted = PROGRAMS.reduce((sum, p) => sum + completed[p.id].length, 0);

  const toggleStar = (course) => {
    setStarredCourses(prev =>
      prev.includes(course) ? prev.filter(c => c !== course) : [course, ...prev]
    );
  };

  const deleteCourse = useCallback((programId, course) => {
    const updated = completed[programId].filter(c => c !== course);

    // Update localStorage
    localStorage.setItem(`uwcompass-completed-${programId}`, JSON.stringify(updated));

    // Update React state
    setCompleted(prev => ({ ...prev, [programId]: updated }));

    // Sync to Supabase for logged-in users
    if (user) {
      const pathId = readLocalPath(programId);
      supabase.from('user_planners').upsert(
        { user_id: user.id, program_id: programId, path_id: pathId, completed: updated },
        { onConflict: 'user_id,program_id' },
      ).then(({ error }) => {
        if (error) console.error('[RecentlyViewed] Supabase delete sync failed:', error);
      });
    }
  }, [completed, user]);

  const clearProgram = useCallback((programId) => {
    localStorage.setItem(`uwcompass-completed-${programId}`, JSON.stringify([]));
    setCompleted(prev => ({ ...prev, [programId]: [] }));

    if (user) {
      const pathId = readLocalPath(programId);
      supabase.from('user_planners').upsert(
        { user_id: user.id, program_id: programId, path_id: pathId, completed: [] },
        { onConflict: 'user_id,program_id' },
      );
    }
  }, [user]);

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

  const DeleteBtn = ({ onClick }) => (
    <button
      onClick={onClick}
      title="Remove"
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 16, lineHeight: 1, padding: '0 3px',
        color: '#d1d5db', transition: 'color 0.14s',
      }}
      onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
      onMouseOut={e => e.currentTarget.style.color = '#d1d5db'}
    >
      ×
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff' }}>
      <div className="background-grid" />
      <NavHeader />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 40px 80px', display: 'flex', flexDirection: 'column', gap: 44 }}>

        {/* ── Browsed Courses ──────────────────────────────────────────────── */}
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
                <CourseRow
                  key={course}
                  course={course}
                  actions={
                    <>
                      <StarBtn course={course} />
                      <DeleteBtn onClick={() => setRecentCourses(prev => prev.filter(c => c !== course))} />
                    </>
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Starred Courses ───────────────────────────────────────────────── */}
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
                    <>
                      <button
                        onClick={() => toggleStar(course)}
                        title="Unstar"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#f59e0b', padding: '0 2px' }}
                      >★</button>
                      <DeleteBtn onClick={() => setStarredCourses(prev => prev.filter(c => c !== course))} />
                    </>
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Courses Taken ─────────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Courses Taken"
            count={totalCompleted || undefined}
            countColor="#16a34a"
            countBg="#f0fdf4"
          />
          <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
            Courses marked as completed in your planners. Click × to remove a course.
          </p>

          {totalCompleted === 0 ? (
            <EmptyState
              message="No courses marked as taken yet."
              action={<button style={linkBtn} onClick={() => navigate('/planners')}>Open a Planner →</button>}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {PROGRAMS.map(prog => {
                const courses = completed[prog.id];
                if (courses.length === 0) return null;
                return (
                  <div key={prog.id}>
                    {/* Program sub-header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{prog.label}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: '#16a34a',
                        background: '#f0fdf4', borderRadius: 20, padding: '1px 8px',
                        border: '1px solid #bbf7d0',
                      }}>{courses.length}</span>
                      <button
                        onClick={() => navigate(prog.path)}
                        style={{
                          marginLeft: 'auto', padding: '3px 10px', borderRadius: 6,
                          fontSize: 11, background: 'none', border: '1px solid #e2e8f0',
                          color: '#5568ff', cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >
                        Edit in planner →
                      </button>
                      <button
                        onClick={() => clearProgram(prog.id)}
                        style={{
                          padding: '3px 10px', borderRadius: 6,
                          fontSize: 11, background: 'none', border: '1px solid #e2e8f0',
                          color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit',
                          transition: 'all 0.12s',
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; }}
                      >
                        Clear
                      </button>
                    </div>

                    {/* Course chips with delete */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {courses.map(course => (
                        <div
                          key={course}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '5px 10px 5px 14px', borderRadius: 20,
                            background: '#f0fdf4', border: '1px solid #bbf7d0',
                          }}
                        >
                          <button
                            onClick={() => navigate(`/course/${course}`)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontWeight: 700, fontSize: 13, color: '#16a34a',
                              padding: 0, fontFamily: 'inherit',
                            }}
                          >
                            {course}
                          </button>
                          <button
                            onClick={() => deleteCourse(prog.id, course)}
                            title={`Remove ${course}`}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontSize: 14, lineHeight: 1, color: '#86efac',
                              padding: '0 1px', display: 'flex', alignItems: 'center',
                              transition: 'color 0.12s',
                            }}
                            onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                            onMouseOut={e => e.currentTarget.style.color = '#86efac'}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
