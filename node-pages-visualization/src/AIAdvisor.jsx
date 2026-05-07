import { useState, useCallback } from 'react';
import NavHeader from './NavHeader';
import { usePlannerData } from './hooks/usePlannerData';
import { generatePrompt } from './lib/promptGenerator';
import { PROGRAM_GRAD_REQS, PROGRAM_LABELS } from './lib/programGradReqs';
import './AIAdvisor.css';

const PROGRAMS = ['cs', 'se', 'math', 'stat', 'ece'];
const STANDINGS = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B'];

function parseList(str) {
  return str.split(/[,\n]+/).map(s => s.trim().toUpperCase()).filter(Boolean);
}

// Inner component so usePlannerData can be called with the selected program
function AdvisorForm({ programId }) {
  const { completed, isLoading } = usePlannerData(programId);

  const completedList = isLoading ? [] : [...completed];

  const [form, setForm] = useState({
    standing:    '',
    term:        '',
    inProgress:  '',
    planned:     '',
    interests:   '',
    career:      '',
    constraints: '',
    extra:       '',
  });
  const [prompt, setPrompt]   = useState('');
  const [copied, setCopied]   = useState(false);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  function handleGenerate(e) {
    e.preventDefault();
    const courseData = {
      completed:       completedList,
      inProgress:      parseList(form.inProgress),
      planned:         parseList(form.planned),
      requirementsJson: PROGRAM_GRAD_REQS[programId],
    };
    const userInput = {
      program:     PROGRAM_LABELS[programId],
      standing:    form.standing,
      term:        form.term,
      interests:   form.interests,
      career:      form.career,
      constraints: form.constraints,
      extra:       form.extra,
    };
    setPrompt(generatePrompt(courseData, userInput));
    setCopied(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="advisor-body">
      <form className="advisor-form" onSubmit={handleGenerate}>

        {/* ── Courses ── */}
        <div className="advisor-section">
          <h3 className="advisor-section-title">Your Courses</h3>

          <div className="advisor-field">
            <label>Completed courses</label>
            {isLoading ? (
              <p className="advisor-loading-note">Loading from your planner…</p>
            ) : completedList.length > 0 ? (
              <div className="advisor-chips">
                {completedList.map(c => <span key={c} className="advisor-chip">{c}</span>)}
              </div>
            ) : (
              <p className="advisor-empty-note">
                No courses saved yet. Complete courses in your planner and they&apos;ll appear here automatically.
              </p>
            )}
          </div>

          <div className="advisor-row">
            <div className="advisor-field">
              <label htmlFor="inProgress">Currently enrolled <span className="advisor-hint">(comma-separated)</span></label>
              <input
                id="inProgress"
                className="advisor-input"
                placeholder="e.g. CS240, MATH239, STAT230"
                value={form.inProgress}
                onChange={set('inProgress')}
              />
            </div>
            <div className="advisor-field">
              <label htmlFor="planned">Considering next <span className="advisor-hint">(comma-separated)</span></label>
              <input
                id="planned"
                className="advisor-input"
                placeholder="e.g. CS245, CS246, CS251"
                value={form.planned}
                onChange={set('planned')}
              />
            </div>
          </div>
        </div>

        {/* ── Academic profile ── */}
        <div className="advisor-section">
          <h3 className="advisor-section-title">Academic Profile</h3>

          <div className="advisor-row">
            <div className="advisor-field">
              <label htmlFor="standing">Current standing <span className="advisor-required">*</span></label>
              <select id="standing" className="advisor-input" value={form.standing} onChange={set('standing')} required>
                <option value="">Select…</option>
                {STANDINGS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="advisor-field">
              <label htmlFor="term">Upcoming term <span className="advisor-required">*</span></label>
              <input
                id="term"
                className="advisor-input"
                placeholder="e.g. Fall 2026"
                value={form.term}
                onChange={set('term')}
                required
              />
            </div>
          </div>
        </div>

        {/* ── Goals & context ── */}
        <div className="advisor-section">
          <h3 className="advisor-section-title">Goals & Context</h3>

          <div className="advisor-field">
            <label htmlFor="interests">Academic interests <span className="advisor-hint">(optional)</span></label>
            <input
              id="interests"
              className="advisor-input"
              placeholder="e.g. machine learning, systems programming"
              value={form.interests}
              onChange={set('interests')}
            />
          </div>
          <div className="advisor-field">
            <label htmlFor="career">Career goal <span className="advisor-hint">(optional)</span></label>
            <input
              id="career"
              className="advisor-input"
              placeholder="e.g. software engineer at a startup"
              value={form.career}
              onChange={set('career')}
            />
          </div>
          <div className="advisor-field">
            <label htmlFor="constraints">Constraints <span className="advisor-hint">(optional)</span></label>
            <input
              id="constraints"
              className="advisor-input"
              placeholder="e.g. co-op next term, max 5 courses"
              value={form.constraints}
              onChange={set('constraints')}
            />
          </div>
          <div className="advisor-field">
            <label htmlFor="extra">Anything else? <span className="advisor-hint">(optional)</span></label>
            <textarea
              id="extra"
              className="advisor-input advisor-textarea"
              placeholder="Exchange terms, specific professors, double major plans…"
              value={form.extra}
              onChange={set('extra')}
              rows={3}
            />
          </div>
        </div>

        <button className="advisor-generate-btn" type="submit">
          Generate AI Prompt
        </button>
      </form>

      {/* ── Output ── */}
      {prompt && (
        <div className="advisor-output">
          <div className="advisor-output-header">
            <h3>Your prompt is ready</h3>
            <button
              className={`advisor-copy-btn${copied ? ' advisor-copy-btn-done' : ''}`}
              onClick={handleCopy}
            >
              {copied ? '✓ Copied!' : 'Copy to clipboard'}
            </button>
          </div>
          <p className="advisor-output-hint">
            Paste this into ChatGPT, Claude, or any AI assistant.
          </p>
          <textarea
            className="advisor-output-text"
            value={prompt}
            readOnly
            rows={20}
            onClick={e => e.target.select()}
          />
        </div>
      )}
    </div>
  );
}

export default function AIAdvisor() {
  const [programId, setProgramId] = useState('cs');

  return (
    <div className="advisor-page">
      <div className="background-grid" />
      <NavHeader />

      <div className="advisor-content">
        <div className="advisor-hero">
          <span className="hero-badge">AI Advisor · Prompt Generator</span>
          <h1>Get Personalized Course Advice</h1>
          <p>
            We&apos;ll build a detailed prompt from your planner data — paste it into any AI
            assistant to get a term-by-term course plan tailored to your goals.
          </p>
        </div>

        {/* Program selector */}
        <div className="advisor-program-bar">
          {PROGRAMS.map(id => (
            <button
              key={id}
              className={`advisor-prog-btn${programId === id ? ' advisor-prog-active' : ''}`}
              onClick={() => setProgramId(id)}
            >
              {PROGRAM_LABELS[id]}
            </button>
          ))}
        </div>

        <AdvisorForm key={programId} programId={programId} />
      </div>

      <footer className="footer">
        <p>© 2026 UWCompass — AI Advisor</p>
      </footer>
    </div>
  );
}
