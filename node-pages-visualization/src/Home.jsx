import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import NavHeader from './NavHeader';

const SELECTABLE_COURSES = [
  { group: 'CS Courses', courses: ['CS135', 'CS136', 'CS138', 'CS145', 'CS146', 'CS240', 'CS241', 'CS245', 'CS246', 'CS251'] },
  { group: 'Math & Stats', courses: ['MATH135', 'MATH136', 'MATH138', 'MATH239', 'STAT230', 'STAT231'] },
];

const FEATURES = [
  {
    icon: '🔗',
    iconBg: '#eef2ff',
    title: 'Prerequisite Visualization',
    desc: 'Interactive graphs help you understand course dependencies instantly — pan, zoom, and hover to trace chains.',
  },
  {
    icon: '✨',
    iconBg: '#f0fdf4',
    title: 'Smart Course Recommendation',
    desc: 'Select completed courses and instantly see which CS courses you\'re eligible for next term.',
  },
  {
    icon: '✅',
    iconBg: '#fef9c3',
    title: 'Eligibility Checker',
    desc: 'Instantly determine which courses you are eligible to take based on your completed prerequisites.',
  },
  {
    icon: '🗺️',
    iconBg: '#f0f9ff',
    title: 'Degree Planner ↗',
    desc: 'Build an 8-term roadmap that satisfies prerequisite constraints automatically. Click to try the CS planner.',
    action: '/cs-planner',
  },
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
      document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('active');
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRecommend = () => {
    if (!prereqGraph) { setRecommendation({ type: 'loading' }); return; }
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
      <div className="background-grid" />

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

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="home-badge">University of Waterloo · CS Navigator</div>
          <h1>Plan Your Academic Path<br />Intelligently</h1>
          <p>Visualize prerequisites, check eligibility, and plan your full degree — all in one place.</p>
          <div className="hero-btns">
            <button className="primary-btn" onClick={() => navigate('/visualizer')}>
              Explore Courses →
            </button>
            <button className="hero-outline-btn" onClick={() => navigate('/cs-planner')}>
              CS Planner
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="features">
        <h2 className="reveal">Core Features</h2>
        <p className="features-sub reveal">
          Everything you need to navigate the UW CS program with confidence.
        </p>
        <div className="feature-grid">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="card reveal"
              onClick={f.action ? () => navigate(f.action) : undefined}
              style={{ cursor: f.action ? 'pointer' : 'default' }}
            >
              <div className="card-icon" style={{ background: f.iconBg }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Eligibility checker ──────────────────────────────────────────── */}
      <section className="interactive">
        <h2 className="reveal">What Courses Can I Take?</h2>
        <p className="interactive-sub reveal">
          Select completed courses, then check which CS courses you're eligible for next.
        </p>

        {SELECTABLE_COURSES.map(({ group, courses }) => (
          <div key={group} className="reveal" style={{ marginBottom: 16 }}>
            <div className="course-group-label">{group}</div>
            <div className="course-select">
              {courses.map(course => (
                <label key={course}>
                  <input
                    type="checkbox"
                    onChange={() => toggleCourse(course)}
                    checked={selectedCourses.includes(course)}
                  />
                  {course}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button onClick={handleRecommend} className="secondary-btn reveal">
          Check Available Courses
        </button>

        <div style={{ marginTop: 24 }}>
          {recommendation?.type === 'loading' && (
            <span style={{ color: '#94a3b8', fontSize: 14 }}>Loading course data…</span>
          )}
          {recommendation?.type === 'result' && recommendation.courses.length === 0 && (
            <span style={{ fontWeight: 600, color: '#475569', fontSize: 14 }}>
              Select some completed courses to see recommendations.
            </span>
          )}
          {recommendation?.type === 'result' && recommendation.courses.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, marginBottom: 14, color: '#0f172a', fontSize: 15 }}>
                You can take {recommendation.courses.length} CS course{recommendation.courses.length !== 1 ? 's' : ''}:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {recommendation.courses.map(c => (
                  <button
                    key={c}
                    onClick={() => navigate(`/course/${c}`)}
                    style={{
                      padding: '6px 16px', borderRadius: 20, fontSize: 13,
                      background: '#eef2ff', color: '#4338ca',
                      border: '1.5px solid #c7d2fe',
                      cursor: 'pointer', fontWeight: 600,
                      transition: 'all 0.14s',
                      fontFamily: 'inherit',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#e0e7ff'; e.currentTarget.style.borderColor = '#818cf8'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
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
