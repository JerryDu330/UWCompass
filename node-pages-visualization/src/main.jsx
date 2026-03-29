import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';

const Home           = lazy(() => import('./Home'));
const VisualizerApp  = lazy(() => import('./App'));
const CourseTreePage = lazy(() => import('./CourseTreePage'));

const Loading = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', fontFamily: 'system-ui', color: '#94a3b8', fontSize: 14,
  }}>
    Loading…
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/"                 element={<Home />} />
          <Route path="/visualizer"       element={<VisualizerApp />} />
          <Route path="/course/:courseId" element={<CourseTreePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
