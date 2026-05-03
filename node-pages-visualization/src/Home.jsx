import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import NavHeader from './NavHeader';

const SELECTABLE_COURSES = [
  { group: 'CS Courses', courses: ['CS135', 'CS136', 'CS138', 'CS145', 'CS146', 'CS240', 'CS241', 'CS245', 'CS246', 'CS251'] },
  { group: 'Math & Stats', courses: ['MATH135', 'MATH136', 'MATH138', 'MATH239', 'STAT230', 'STAT231'] },
];

const isSatisfied = (nodeId, graph, completedSet) => {
  if (nodeId.startsWith('OR_NODE')) {
    return (graph[nodeId] || []).some(c => isSatisfied(c, graph, completedSet));
  }
  if (nodeId.startsWith('LEVEL_') || nodeId.startsWith('PROGRAM_')) return true;
  return completedSet.has(nodeId);
};

const Home = () => {
  const navigate = useNavigate();
  const [selectedCourses, setSelectedCourses] = useLocalStorage('uwcompass-home-selected', []);
  const [recentCourses] = useLocalStorage('uwcompass-recent-courses', []);
  const [recommendation, setRecommendation] = useState(null);
  const [prereqGraph, setPrereqGraph] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/subject/CS.json')
      .then(r => r.json())
      .then(setPrereqGraph)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal");
      const windowHeight = window.innerHeight;
      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < windowHeight - 100) {
          el.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRecommend = () => {
    if (!prereqGraph) {
      setRecommendation({ type: 'loading' });
      return;
    }
    const completedSet = new Set(selectedCourses);
    const eligible = Object.keys(prereqGraph)
      .filter(c => !c.startsWith('OR_NODE') && !c.startsWith('LEVEL_'))
      .filter(c => !completedSet.has(c))
      .filter(c => (prereqGraph[c] || []).every(p => isSatisfied(p, prereqGraph, completedSet)))
      .sort();
    setRecommendation({ type: 'result', courses: eligible });
  };

  const toggleCourse = (course) => {
    setSelectedCourses(prev =>
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
    setRecommendation(null);
  };

  const handleSearchKey = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/course/${searchQuery.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="home-container">
        <div className="background-grid"></div>
        <NavHeader right={
          <div className="search">
            <input
              placeholder="Search courses… (e.g. CS341)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKey}
            />
          </div>
        } />

        <section className="hero">
        <div className="hero-content">
            <h1>Plan Your Academic Path Intelligently</h1>
            <p>Visualize prerequisites and plan your degree efficiently.</p>
            <button className="primary-btn" onClick={() => navigate('/visualizer')}>
            Explore Courses
            </button>
        </div>
        </section>

        {recentCourses.length > 0 && (
          <section style={{ padding: '0 40px 40px', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#5568ff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Recently Viewed
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {recentCourses.map(course => (
                <button
                  key={course}
                  onClick={() => navigate(`/course/${course}`)}
                  style={{
                    padding: '4px 14px', borderRadius: '20px', fontSize: '13px',
                    background: '#f8faff', color: '#4338ca', border: '1px solid #c7d2fe',
                    cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  {course}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="features">
        <h2 className="reveal">Core Features</h2>
        <div className="feature-grid">

            <div className="card reveal">
                <h3>Prerequisite Visualization</h3>
                <p> Interactive prerequisite graphs help you understand course dependencies instantly.</p>
            </div>

            <div className="card reveal">
                <h3>Smart Course Recommendation</h3>
                <p>Receive intelligent course suggestions based on your academic progress.</p>
            </div>

            <div className="card reveal">
                <h3>Eligibility Checker</h3>
                <p>Instantly determine which courses you are eligible to take next.</p>
            </div>

            <div className="card reveal" onClick={() => navigate('/cs-planner')} style={{ cursor: 'pointer' }}>
                <h3>Degree Planner ↗</h3>
                <p>Build semester plans that satisfy prerequisite constraints automatically. Try the CS planner now.</p>
            </div>

        </div>
        </section>

        <section className="interactive">
            <h2 className="reveal">What Courses Can I Take?</h2>
            <p className="reveal" style={{ color: '#64748b', marginBottom: '16px', fontSize: '14px' }}>
              Select completed courses, then check which CS courses you're eligible for next.
            </p>

            {SELECTABLE_COURSES.map(({ group, courses }) => (
              <div key={group} className="reveal" style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#5568ff', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {group}
                </div>
                <div className="course-select">
                  {courses.map(course => (
                    <label key={course}>
                      <input
                        type="checkbox"
                        onChange={() => toggleCourse(course)}
                        checked={selectedCourses.includes(course)}
                      /> {course}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button onClick={handleRecommend} className="secondary-btn reveal">
                Check Available Courses
            </button>

            <div style={{ marginTop: '20px' }}>
              {recommendation?.type === 'loading' && (
                <span style={{ color: '#94a3b8' }}>Loading course data…</span>
              )}
              {recommendation?.type === 'result' && recommendation.courses.length === 0 && (
                <span style={{ fontWeight: 600 }}>Select some completed courses to see recommendations.</span>
              )}
              {recommendation?.type === 'result' && recommendation.courses.length > 0 && (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '10px' }}>
                    You can take {recommendation.courses.length} CS course{recommendation.courses.length !== 1 ? 's' : ''}:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {recommendation.courses.map(c => (
                      <button
                        key={c}
                        onClick={() => navigate(`/course/${c}`)}
                        style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '13px',
                          background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe',
                          cursor: 'pointer', fontWeight: 500,
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

        </section>

        <footer className="footer">
            <p>© 2026 UWCompass</p>
        </footer>

    </div>
  );
};

export default Home;
