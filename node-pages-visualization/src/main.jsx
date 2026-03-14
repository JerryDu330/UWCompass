import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles.css'; 
import Home from './Home';
import App from './App.jsx'; // This is your Visualizer "App"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<Home />} />
        
        {/* Visualizer Route - Points to the existing App.jsx */}
        <Route path="/visualizer" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);



// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './App.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

// src/main.jsx




// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { ReactFlowProvider } from 'reactflow'; // Required for useReactFlow hook
// import Home from './Home';
// import GraphCanvas from './GraphCanvas';
// import './styles.css';

// const App = () => {
//   const [graphData, setGraphData] = useState(null);
//   const [subject, setSubject] = useState("CS"); // Default subject

//   useEffect(() => {
//     // Replace 'CS.json' with your actual generated JSON file name
//     fetch('/data/CS.json') 
//       .then(res => res.json())
//       .then(data => setGraphData(data))
//       .catch(err => console.error("Error loading graph data:", err));
//   }, []);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route 
//           path="/visualizer" 
//           element={
//             <div style={{ width: '100vw', height: '100vh' }}>
//               {/* ReactFlowProvider is mandatory because GraphCanvas uses useReactFlow() */}
//               <ReactFlowProvider>
//                 <GraphCanvas data={graphData} subject={subject} />
//               </ReactFlowProvider>
//             </div>
//           } 
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
