import { useState, useEffect } from 'react';

function useCycle(steps, ms) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % steps), ms);
    return () => clearInterval(id);
  }, [steps, ms]);
  return step;
}

const fadeIn = (show) => ({
  style: { opacity: show ? 1 : 0, transition: 'opacity 0.4s ease' },
});

// ── 1. Prerequisite Graph ───────────────────────────────────────────────────
// Nodes appear one by one, edges draw between them, then CS246 lights up.

export function GraphDemo({ color }) {
  const step = useCycle(8, 650);

  const nodes = [
    { id: 'CS135', x: 4,   y: 64, show: step >= 1 },
    { id: 'CS136', x: 132, y: 64, show: step >= 2 },
    { id: 'CS246', x: 260, y: 14, show: step >= 4 },
    { id: 'CS241', x: 260, y: 114, show: step >= 4 },
  ];

  const highlighted = step === 6 || step === 7;

  return (
    <svg viewBox="0 0 336 154" style={{ width: '100%', maxWidth: 300, overflow: 'visible' }}>
      <defs>
        <marker id={`arr-${color.slice(1)}`} markerWidth="7" markerHeight="7"
          refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill={color} opacity="0.6" />
        </marker>
      </defs>

      {/* Edges */}
      <line x1="72" y1="77" x2="128" y2="77"
        stroke={color} strokeWidth="1.5" markerEnd={`url(#arr-${color.slice(1)})`}
        {...fadeIn(step >= 3)} />
      <line x1="200" y1="68" x2="256" y2="38"
        stroke={color} strokeWidth="1.5" markerEnd={`url(#arr-${color.slice(1)})`}
        {...fadeIn(step >= 5)} />
      <line x1="200" y1="86" x2="256" y2="128"
        stroke={color} strokeWidth="1.5" markerEnd={`url(#arr-${color.slice(1)})`}
        {...fadeIn(step >= 5)} />

      {/* Nodes */}
      {nodes.map(({ id, x, y, show }) => {
        const glow = highlighted && id === 'CS246';
        return (
          <g key={id} {...fadeIn(show)}>
            <rect x={x} y={y} width="68" height="26" rx="7"
              fill={glow ? color : color + '1a'}
              stroke={color} strokeWidth="1.5"
              style={{ transition: 'fill 0.4s', filter: glow ? `drop-shadow(0 0 6px ${color}90)` : 'none' }}
            />
            <text x={x + 34} y={y + 17} textAnchor="middle"
              fontSize="10.5" fontWeight="700" fontFamily="system-ui, sans-serif"
              fill={glow ? '#fff' : color}
              style={{ transition: 'fill 0.4s' }}
            >
              {id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── 2. Course Prerequisite Tree ─────────────────────────────────────────────
// Tree expands downward from CS341, then CS341 glows to show it's the target.

export function TreeDemo({ color }) {
  const step = useCycle(8, 620);

  const nodes = [
    { id: 'CS341', x: 116, y: 4,   show: step >= 1, glow: step >= 6 },
    { id: 'CS240', x: 46,  y: 74,  show: step >= 3, glow: false },
    { id: 'CS245', x: 186, y: 74,  show: step >= 3, glow: false },
    { id: 'CS241', x: 46,  y: 144, show: step >= 5, glow: false },
  ];

  return (
    <svg viewBox="0 0 300 178" style={{ width: '100%', maxWidth: 280, overflow: 'visible' }}>
      {/* Edges */}
      <line x1="150" y1="30" x2="80"  y2="74" stroke={color} strokeWidth="1.5" {...fadeIn(step >= 2)} />
      <line x1="150" y1="30" x2="220" y2="74" stroke={color} strokeWidth="1.5" {...fadeIn(step >= 2)} />
      <line x1="80"  y1="100" x2="80" y2="144" stroke={color} strokeWidth="1.5" {...fadeIn(step >= 4)} />

      {/* Nodes */}
      {nodes.map(({ id, x, y, show, glow }) => (
        <g key={id} {...fadeIn(show)}>
          <rect x={x} y={y} width="68" height="26" rx="7"
            fill={glow ? color : color + '1a'}
            stroke={color} strokeWidth="1.5"
            style={{ transition: 'fill 0.4s', filter: glow ? `drop-shadow(0 0 7px ${color}90)` : 'none' }}
          />
          <text x={x + 34} y={y + 17} textAnchor="middle"
            fontSize="10.5" fontWeight="700" fontFamily="system-ui, sans-serif"
            fill={glow ? '#fff' : color}
            style={{ transition: 'fill 0.4s' }}
          >
            {id}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── 3. CS Degree Planner ────────────────────────────────────────────────────
// Course chips check off one by one and a progress bar fills up.

const PLAN_COURSES = ['CS135', 'MATH135', 'CS136', 'CS246', 'CS241'];

export function PlannerDemo({ color }) {
  const step = useCycle(PLAN_COURSES.length + 3, 700);
  const doneCount = Math.min(step, PLAN_COURSES.length);
  const pct = Math.round((doneCount / PLAN_COURSES.length) * 100);

  return (
    <div style={{ width: '100%', fontFamily: 'system-ui, sans-serif', padding: '0 4px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase',
        letterSpacing: '0.07em', marginBottom: 10 }}>
        CS Honours · 1A – 2A
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {PLAN_COURSES.map((c, i) => {
          const done = i < doneCount;
          return (
            <div key={c} style={{
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              border: `1.5px solid ${done ? '#86efac' : color + '50'}`,
              background: done ? '#f0fdf4' : color + '12',
              color: done ? '#15803d' : color,
              transition: 'all 0.4s ease',
            }}>
              {done ? '✓ ' : ''}{c}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 11, color: '#64748b', marginBottom: 5 }}>
        <span>Progress</span>
        <span style={{ fontWeight: 700, color, transition: 'color 0.3s' }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          borderRadius: 99,
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}

// ── 4. Eligibility Checker ──────────────────────────────────────────────────
// Checkboxes tick one by one, then eligible courses pop into view.

const TAKEN   = ['CS135', 'CS136', 'MATH135'];
const ELIGIBLE = ['CS246', 'CS241', 'CS245'];

export function EligibilityDemo({ color }) {
  const step = useCycle(8, 700);
  const checkedCount = Math.min(step, TAKEN.length);
  const showResults  = step >= TAKEN.length + 1;

  return (
    <div style={{ width: '100%', fontFamily: 'system-ui, sans-serif', padding: '0 4px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase',
        letterSpacing: '0.07em', marginBottom: 8 }}>
        Completed courses
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {TAKEN.map((c, i) => {
          const checked = i < checkedCount;
          return (
            <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 15, height: 15, borderRadius: 4, flexShrink: 0,
                border: `1.5px solid ${checked ? color : '#cbd5e1'}`,
                background: checked ? color : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.35s',
              }}>
                {checked && <span style={{ color: '#fff', fontSize: 9, fontWeight: 900, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: checked ? '#1e293b' : '#94a3b8',
                transition: 'color 0.35s',
              }}>
                {c}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ opacity: showResults ? 1 : 0, transform: showResults ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase',
          letterSpacing: '0.07em', marginBottom: 6 }}>
          You can take
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ELIGIBLE.map(c => (
            <div key={c} style={{
              padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
              background: color + '18', color, border: `1.5px solid ${color}40`,
            }}>
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
