import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, { Background, Controls, MarkerType } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import './CourseTree.css';

// ─── Node dimensions ──────────────────────────────────────────────────────────
const WC = 120, HC = 40;
const WO = 18,  HO = 18;
const WS = 100, HS = 32;

// ─── Layout constants ─────────────────────────────────────────────────────────
const MIN_ROW_H = 54;
const MAX_ROW_H = 100;
const FOLLOW_X1 = 430;
const FOLLOW_X2 = 800;

// ─── Left-wing dagre layout ───────────────────────────────────────────────────
// Handles empty fwdEdges (no base_prereq in collapsed files) gracefully.
function buildLeftPositions(fwdEdges, typeOf, centerCourse) {
  const ids = new Set();
  fwdEdges.forEach(e => { ids.add(e.from); ids.add(e.to); });

  // No left-wing data — place center at origin
  if (!ids.size) {
    return new Map([[centerCourse, { x: -WC / 2, y: -HC / 2 }]]);
  }
  ids.add(centerCourse);

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR', nodesep: 50, ranksep: 110 });

  ids.forEach(id => {
    const or = typeOf.get(id) === 'OR';
    g.setNode(id, { width: or ? WO : WC, height: or ? HO : HC });
  });
  fwdEdges.forEach(e => g.setEdge(e.to, e.from)); // reversed so prereqs go left

  dagre.layout(g);

  const s = g.node(centerCourse);
  if (!s) return new Map([[centerCourse, { x: -WC / 2, y: -HC / 2 }]]);

  const out = new Map();
  ids.forEach(id => {
    const p = g.node(id);
    if (!p) return;
    const or = typeOf.get(id) === 'OR';
    const w = or ? WO : WC, h = or ? HO : HC;
    out.set(id, { x: p.x - s.x - w / 2, y: p.y - s.y - h / 2 });
  });
  return out;
}

// ─── Column placement ─────────────────────────────────────────────────────────
function colPlace(items, baseX, rowH) {
  if (!items.length) return [];
  const startY = -((items.length - 1) * rowH) / 2 - HC / 2;
  return items.map((id, i) => ({ id, x: baseX, y: startY + i * rowH }));
}

// ─── Node factory ─────────────────────────────────────────────────────────────
function makeNode(id, x, y, role, typeOf, displayLabel) {
  const origId = id.includes('@') ? id.split('@')[0] : id;
  const or    = typeOf?.get(origId) === 'OR';
  const small = role === 'extra_prereq';
  const w     = or ? WO : small ? WS : WC;
  const h     = or ? HO : small ? HS : HC;

  let bg, border, color, shadow;
  switch (role) {
    case 'center':
      bg = '#5568ff'; border = '#3d52e0'; color = '#fff';
      shadow = '0 0 0 4px rgba(85,104,255,0.18), 0 2px 10px rgba(85,104,255,0.3)'; break;
    case 'left_or':
    case 'extra_or':
      bg = '#94a3b8'; border = ''; color = '#fff'; shadow = 'none'; break;
    case 'left_prereq':
      bg = '#fff'; border = '#d1d5db'; color = '#111827';
      shadow = '0 1px 3px rgba(0,0,0,.07)'; break;
    case 'extra_prereq':
      bg = '#f0fdf4'; border = '#6ee7b7'; color = '#065f46';
      shadow = '0 1px 3px rgba(0,0,0,.07)'; break;
    case 'following':
      bg = '#fff'; border = '#c7d2fe'; color = '#312e81';
      shadow = '0 1px 3px rgba(0,0,0,.07)'; break;
    default:
      bg = '#fff'; border = '#e5e7eb'; color = '#374151'; shadow = 'none';
  }

  const label = displayLabel || (or ? '' : origId);

  return {
    id,
    data: { label, role },
    position: { x, y },
    sourcePosition: 'right',
    targetPosition: 'left',
    style: {
      width: w, height: h,
      fontSize: role === 'center' ? '13px' : small ? '11px' : '12px',
      fontWeight: role === 'center' ? '700' : '500',
      letterSpacing: '-0.01em',
      borderRadius: or ? 0 : '8px',
      background: bg, color,
      border: or ? 'none' : `1.5px solid ${border}`,
      clipPath: or ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : undefined,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: or ? 'none' : shadow,
      cursor: or ? 'default' : 'pointer',
      padding: 0, userSelect: 'none',
    },
  };
}

// ─── Edge factory ─────────────────────────────────────────────────────────────
function makeEdge(source, target, role, color = '#94a3b8', visible = true, type = 'smoothstep') {
  return {
    id: `e-${source}-${target}`,
    source, target, type,
    style: { stroke: color, strokeWidth: visible ? 1.5 : 0, opacity: visible ? 1 : 0 },
    markerEnd: visible
      ? { type: MarkerType.ArrowClosed, color, width: 10, height: 10 }
      : undefined,
    data: { role, color },
  };
}

// ─── Hover cluster ────────────────────────────────────────────────────────────
function buildHoverCluster(fc, fcScreenX, fcScreenY, extraEdgesByFrom, typeOf, containerH) {
  const courseLeaves = new Set();
  const visited = new Set([fc]);
  const queue = [fc];
  while (queue.length) {
    const curr = queue.shift();
    (extraEdgesByFrom.get(curr) || []).forEach(e => {
      if (visited.has(e.to)) return;
      visited.add(e.to);
      if (typeOf.get(e.to) === 'OR') queue.push(e.to);
      else courseLeaves.add(e.to);
    });
  }

  const leaves = [...courseLeaves].sort();
  if (!leaves.length) return { nodes: [], edges: [] };

  const spacing = HS + 18;
  const hGap    = 110;
  const col1X   = fcScreenX - WS - hGap;

  const buildCol = (list, x) => {
    const startY = (fcScreenY + HS / 2) - ((list.length - 1) * spacing / 2) - HS / 2;
    return list.map((id, i) =>
      makeNode(`${id}@${fc}`, x, startY + i * spacing, 'extra_prereq', typeOf, id));
  };

  const colH   = leaves.length * spacing;
  const twoCol = colH > containerH * 0.70;
  const perCol = twoCol ? Math.ceil(leaves.length / 2) : leaves.length;

  const nodes = [
    ...buildCol(leaves.slice(0, perCol), col1X),
    ...(twoCol ? buildCol(leaves.slice(perCol), col1X - WS - 20) : []),
  ];
  const edges = leaves.map(id =>
    makeEdge(`${id}@${fc}`, fc, 'extra', '#94a3b8', true, 'smoothstep')
  );
  return { nodes, edges };
}

// ─── Custom edge for center→following routing ─────────────────────────────────
function CenterFollowEdge({ sourceX, sourceY, targetX, targetY, data, style, markerEnd }) {
  const corridorX = sourceX + 80;
  const yRoute    = data?.yRoute ?? sourceY + 60;
  const d = [
    `M ${sourceX} ${sourceY}`,
    `L ${corridorX} ${sourceY}`,
    `L ${corridorX} ${yRoute}`,
    `L ${targetX} ${yRoute}`,
    `L ${targetX} ${targetY}`,
  ].join(' ');
  return (
    <path
      d={d} fill="none"
      stroke={style?.stroke ?? '#94a3b8'}
      strokeWidth={style?.strokeWidth ?? 1.5}
      markerEnd={markerEnd}
      className="react-flow__edge-path"
    />
  );
}

const edgeTypes = { centerFollow: CenterFollowEdge };

// ─── Main component ───────────────────────────────────────────────────────────
const CourseTreeCanvas = ({ rawData, selectedSubject, courseId }) => {
  const containerRef  = useRef(null);
  const rfInstanceRef = useRef(null);
  const leaveTimer    = useRef(null);

  const [containerH, setContainerH]   = useState(600);
  const [activeNode, setActiveNode]   = useState(null);
  const [clickedNode, setClickedNode] = useState(null);
  const [showHelp, setShowHelp]       = useState(true);

  const CENTER = courseId;

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerH(containerRef.current.clientHeight);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (!rfInstanceRef.current) return;
    const timer = setTimeout(() => rfInstanceRef.current?.fitView({ padding: 0.14 }), 60);
    return () => clearTimeout(timer);
  }, [rawData, selectedSubject, containerH]);

  useEffect(() => () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  // ── Build stable base graph ─────────────────────────────────────────────────
  const graph = useMemo(() => {
    const typeOf = new Map();
    rawData.forEach(d => { typeOf.set(d.from, d.from_type); typeOf.set(d.to, d.to_type); });

    const fwdEdges    = rawData.filter(d => d.direction === 'base_prereq');
    const followEdges = rawData.filter(d => d.direction === 'following');
    const extraEdges  = rawData.filter(d => d.direction === 'extra_prereq');

    const allFollowing = [...new Set(
      followEdges.filter(d => d.from_type === 'COURSE').map(d => d.from)
    )].sort();
    const filtered = selectedSubject === 'All'
      ? allFollowing
      : allFollowing.filter(c => c.replace(/\d.*$/, '') === selectedSubject);

    const N        = filtered.length;
    const avail    = containerH - 90;
    const rowH1col = N > 0 ? avail / N : MAX_ROW_H;
    const use2cols = rowH1col < MIN_ROW_H + 4;
    const perCol   = use2cols ? Math.ceil(N / 2) : N;
    const rowH     = Math.max(MIN_ROW_H, Math.min(MAX_ROW_H, avail / Math.max(perCol, 1)));

    const col1Placements = colPlace(filtered.slice(0, perCol), FOLLOW_X1, rowH);
    const col2Placements = colPlace(filtered.slice(perCol), FOLLOW_X2, rowH);

    const followPos = new Map();
    col1Placements.forEach(p => followPos.set(p.id, { ...p, col: 1 }));
    col2Placements.forEach(p => followPos.set(p.id, { ...p, col: 2 }));

    const extraEdgesByFrom = new Map();
    extraEdges.forEach(e => {
      if (!extraEdgesByFrom.has(e.from)) extraEdgesByFrom.set(e.from, []);
      extraEdgesByFrom.get(e.from).push(e);
    });

    const leftPos = buildLeftPositions(fwdEdges, typeOf, CENTER);

    // OR-node bypass for left-wing edge routing
    const leftOrTarget = new Map();
    fwdEdges.forEach(e => {
      if (typeOf.get(e.to) === 'OR') leftOrTarget.set(e.to, e.from);
    });
    const resolveOr = (id) => {
      let cur = id;
      const seen = new Set();
      while (typeOf.get(cur) === 'OR' && !seen.has(cur)) {
        seen.add(cur); cur = leftOrTarget.get(cur) ?? cur;
      }
      return typeOf.get(cur) === 'OR' ? null : cur;
    };

    const nodes = [];
    leftPos.forEach((pos, id) => {
      if (typeOf.get(id) === 'OR') return;
      nodes.push(makeNode(id, pos.x, pos.y, id === CENTER ? 'center' : 'left_prereq', typeOf));
    });
    [...col1Placements, ...col2Placements].forEach(({ id, x, y }) =>
      nodes.push(makeNode(id, x, y, 'following', typeOf)));

    const edgeSet = new Set();
    const edges = [];
    fwdEdges.forEach(e => {
      if (typeOf.get(e.to) === 'OR') return;
      const tgt = typeOf.get(e.from) === 'OR' ? resolveOr(e.from) : e.from;
      if (!tgt) return;
      const eid = `${e.to}|${tgt}`;
      if (edgeSet.has(eid)) return;
      edgeSet.add(eid);
      edges.push(makeEdge(e.to, tgt, 'left', '#94a3b8', true, 'smoothstep'));
    });

    return { nodes, edges, typeOf, extraEdgesByFrom, followPos,
      followingSet: new Set(filtered), CENTER, hasLeftWing: fwdEdges.length > 0 };
  }, [rawData, selectedSubject, containerH, CENTER]);

  // ── Build display graph (base + hover cluster) ──────────────────────────────
  const { displayNodes, displayEdges } = useMemo(() => {
    if (!activeNode || !graph.followingSet.has(activeNode)) {
      return { displayNodes: graph.nodes, displayEdges: graph.edges };
    }

    const fc  = activeNode;
    const pos = graph.followPos.get(fc);
    if (!pos) return { displayNodes: graph.nodes, displayEdges: graph.edges };

    const cluster = buildHoverCluster(
      fc, pos.x, pos.y, graph.extraEdgesByFrom, graph.typeOf, containerH,
    );

    let yRoute = 0;
    graph.followPos.forEach(p => { yRoute = Math.max(yRoute, p.y + HC + 30); });

    const statEdges = [{
      id: `e-${graph.CENTER}-${fc}`,
      source: graph.CENTER,
      target: fc,
      type: 'centerFollow',
      style: { stroke: '#94a3b8', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8', width: 10, height: 10 },
      data: { yRoute },
    }];

    const updatedBase = graph.nodes.map(n =>
      n.data.role === 'following' && n.id !== fc
        ? { ...n, style: { ...n.style, opacity: 0.15 } }
        : n
    );

    return {
      displayNodes: [...updatedBase, ...cluster.nodes],
      displayEdges: [...graph.edges, ...statEdges, ...cluster.edges],
    };
  }, [graph, activeNode, containerH]);

  // ── Event handlers ──────────────────────────────────────────────────────────
  const onNodeMouseEnter = useCallback((_, node) => {
    if (node.data.role !== 'following') return;
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
    setActiveNode(node.id);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => { setActiveNode(null); leaveTimer.current = null; }, 160);
  }, []);

  const onNodeClick = useCallback((_, node) => {
    setClickedNode(prev => prev === node.id ? null : node.id);
  }, []);

  const onInit = useCallback((instance) => {
    rfInstanceRef.current = instance;
    instance.fitView({ padding: 0.14 });
  }, []);

  const clickedRole = clickedNode
    ? graph.nodes.find(n => n.id === clickedNode)?.data?.role
    : null;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onInit={onInit}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeClick={onNodeClick}
        nodesDraggable={false}
        minZoom={0.15}
        edgeTypes={edgeTypes}
      >
        <Background variant="dots" color="#d1d5db" gap={20} size={1.5} />
        <Controls />
      </ReactFlow>

      {/* ── Click info panel ─────────────────────────────────────────────── */}
      {clickedNode && clickedRole && (
        <div className="ct-info-panel">
          <button className="ct-close-btn" onClick={() => setClickedNode(null)}>✕</button>
          <h3 className="ct-info-title">{clickedNode}</h3>
          {clickedRole === 'center' && (
            <p className="ct-info-label">Course being explored.</p>
          )}
          {clickedRole === 'left_prereq' && (
            <p className="ct-info-label">A prerequisite option for {CENTER}.</p>
          )}
          {clickedRole === 'following' && (() => {
            const leaves = new Set();
            const vis = new Set([clickedNode]);
            const q   = [clickedNode];
            while (q.length) {
              const curr = q.shift();
              (graph.extraEdgesByFrom.get(curr) || []).forEach(e => {
                if (e.to_type === 'COURSE') {
                  leaves.add(e.to);
                } else if (e.to_type === 'OR' && !vis.has(e.to)) {
                  vis.add(e.to); q.push(e.to);
                }
              });
            }
            const extras = [...leaves].sort();
            return (
              <>
                <p className="ct-info-label">Requires {CENTER}, plus:</p>
                {extras.length > 0
                  ? <ul className="ct-info-list">{extras.map(ep => <li key={ep}>{ep}</li>)}</ul>
                  : <p className="ct-info-note">No additional prerequisites listed.</p>
                }
              </>
            );
          })()}
        </div>
      )}

      {/* ── Help / legend panel ──────────────────────────────────────────── */}
      {showHelp && (
        <div className="ct-help-panel">
          <button className="ct-close-btn" onClick={() => setShowHelp(false)}>✕</button>
          <p className="ct-help-heading">How to read this graph</p>
          <div className="ct-legend-row">
            <span className="ct-legend-dot" style={{ background: '#5568ff' }} />
            <span><strong>{CENTER}</strong> — course being explored</span>
          </div>
          {graph.hasLeftWing && (
            <div className="ct-legend-row">
              <span className="ct-legend-dot" style={{ background: '#fff', border: '1.5px solid #d1d5db' }} />
              <span><strong>Left</strong> — prerequisites of {CENTER}</span>
            </div>
          )}
          <div className="ct-legend-row">
            <span className="ct-legend-dot" style={{ background: '#fff', border: '1.5px solid #c7d2fe' }} />
            <span><strong>Right</strong> — courses that need {CENTER}</span>
          </div>
          <div className="ct-legend-row">
            <span className="ct-legend-dot" style={{ background: '#f0fdf4', border: '1.5px solid #6ee7b7' }} />
            <span><strong>Green</strong> — extra prerequisites (hover)</span>
          </div>
          <hr className="ct-divider" />
          <p className="ct-help-note">
            <strong>Hover</strong> a right-side course to reveal its extra prerequisites.
          </p>
          <p className="ct-help-note" style={{ marginTop: 8 }}>
            <strong>Click</strong> any course for details.
            Use the filter bar to narrow by department.
          </p>
        </div>
      )}

      {!showHelp && (
        <button className="ct-help-toggle" onClick={() => setShowHelp(true)}>?</button>
      )}
    </div>
  );
};

export default CourseTreeCanvas;
