import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';

const Home              = lazy(() => import('./Home'));
const VisualizerApp     = lazy(() => import('./App'));
const CourseTreePage    = lazy(() => import('./CourseTreePage'));
const CSPlanner         = lazy(() => import('./CSPlanner'));
const Features          = lazy(() => import('./Features'));
const About             = lazy(() => import('./About'));
const RecentlyViewed    = lazy(() => import('./RecentlyViewed'));

const Loading = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', fontFamily: 'system-ui', color: '#94a3b8', fontSize: 14,
  }}>
    Loading…
  </div>
);

const NotFound = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100vh', fontFamily: 'system-ui', gap: 16,
  }}>
    <div style={{ fontSize: 48, fontWeight: 700, color: '#1e293b' }}>404</div>
    <div style={{ fontSize: 16, color: '#64748b' }}>Page not found.</div>
    <a href="/" style={{ fontSize: 14, color: '#5568ff' }}>← Back to Home</a>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100vh', fontFamily: 'system-ui', gap: 16,
        }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#ef4444' }}>Something went wrong.</div>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
            style={{ padding: '8px 20px', cursor: 'pointer', borderRadius: 8, border: '1px solid #e2e8f0' }}
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/"                 element={<Home />} />
            <Route path="/features"         element={<Features />} />
            <Route path="/about"            element={<About />} />
            <Route path="/visualizer"       element={<VisualizerApp />} />
            <Route path="/course/:courseId" element={<CourseTreePage />} />
            <Route path="/cs-planner"       element={<CSPlanner />} />
            <Route path="/history"          element={<RecentlyViewed />} />
            <Route path="*"                 element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
