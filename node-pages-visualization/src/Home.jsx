import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal");
      const windowHeight = window.innerHeight;

      reveals.forEach((el) => {
        let top = el.getBoundingClientRect().top;
        if (top < windowHeight - 100) {
          el.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRecommend = () => {
    let available = [];
    if (selectedCourses.includes("CS135")) available.push("CS136");
    if (selectedCourses.includes("CS136")) available.push("CS246");
    if (selectedCourses.includes("MATH135")) available.push("MATH136");
    if (selectedCourses.includes("MATH137")) available.push("MATH138");

    if (available.length === 0) {
      setRecommendation("Complete more prerequisites first.");
    } else {
      setRecommendation("You can take: " + available.join(", "));
    }
  };

  const toggleCourse = (course) => {
    setSelectedCourses(prev =>
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
  };

  return (
    <div className="home-container">
        <div className="background-grid"></div>
        <header className="header">
        <div className="logo">UWCompass</div>
        <nav className="nav">
            <a href="#">Home</a>
            <a href="#">Features</a>
            <a><button onClick={() => navigate('/visualizer')} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
                Visualizer</button>
            </a>
            <a href="#">Recommendations</a>
            <a href="#">About</a>
        </nav>

        <div class="search">
            <input placeholder="Search courses..."/>
        </div>
        
        </header>

        <section className="hero">
        <div className="hero-content">
            <h1>Plan Your Academic Path Intelligently</h1>
            <p>Visualize prerequisites and plan your degree efficiently.</p>
            <button className="primary-btn" onClick={() => navigate('/visualizer')}>
            Explore Courses
            </button>
        </div>
        </section>

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

            <div className="card reveal">
                <h3>Degree Planner</h3>
                <p>Build semester plans that satisfy prerequisite constraints automatically.</p>
            </div>

        </div>
        </section>

        <section className="interactive">
            <h2 className="reveal">What Courses Can I Take?</h2>
            <div className="course-select reveal">
                {['CS135', 'CS136', 'MATH135', 'MATH137'].map(course => (
                <label key={course}>
                    <input 
                    type="checkbox" 
                    onChange={() => toggleCourse(course)} 
                    checked={selectedCourses.includes(course)}
                    /> {course}
                </label>
                ))}
            </div>

            <button onClick={handleRecommend} className="secondary-btn reveal">
                Check Available Courses
            </button>

            <div id="result" style={{ marginTop: '20px', fontWeight: 'bold' }}>
                {recommendation}
            </div>

        </section>

        <footer class="footer">
            <p>© 2026 UWCompass</p>
        </footer>

    </div>
  );
};

export default Home;