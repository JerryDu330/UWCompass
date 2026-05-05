import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, { Background, Controls, MarkerType, Handle, Position } from 'reactflow';
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

// Extra prereq group block dimensions
const EGRP_PAD_V          = 6;
const EGRP_PAD_H          = 8;
const EGRP_ITEM_GAP       = 6;
const EGRP_COL_GAP        = 8;
const EGRP_W              = WS + EGRP_PAD_H * 2;
const EGRP_W_2COL         = WS * 2 + EGRP_PAD_H * 3 + EGRP_COL_GAP;
const EGRP_ITEM_GAP_OUTER = 10;
const EGRP_TWO_COL_MIN    = 8; // split into 2 cols when group has this many courses

// ─── Left-wing dagre layout ───────────────────────────────────────────────────
function buildLeftPositions(fwdEdges, typeOf, centerCourse) {
  const ids = new Set();
  fwdEdges.forEach(e => { ids.add(e.from); ids.add(e.to); });

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
  fwdEdges.forEach(e => g.setEdge(e.to, e.from));

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
  const small = role === 'extra_prereq' || role === 'center_ref';
  const w     = or ? WO : small ? WS : WC;
  const h     = or ? HO : small ? HS : HC;

  let bg, border, color, shadow, borderStyle = 'solid';
  switch (role) {
    case 'center':
    case 'center_ref':
      bg = '#5568ff'; border = '#5568ff'; color = '#fff';
      shadow = '0 0 16px 4px #5568ff40'; break;
    case 'left_or':
    case 'extra_or':
      bg = '#94a3b8'; border = ''; color = '#fff'; shadow = 'none'; break;
    case 'left_prereq':
      bg = '#64748b15'; border = '#64748b55'; color = '#475569';
      shadow = 'none'; break;
    case 'extra_prereq':
      bg = '#16a34a15'; border = '#16a34a55'; color = '#16a34a';
      shadow = 'none'; break;
    case 'following':
      bg = '#a855f715'; border = '#a855f780'; color = '#7e22ce';
      shadow = 'none'; break;
    default:
      bg = '#64748b15'; border = '#64748b40'; color = '#475569'; shadow = 'none';
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
      fontSize: role === 'center' || role === 'center_ref' ? '13px' : small ? '11px' : '12px',
      fontWeight: role === 'center' || role === 'center_ref' ? '700' : '500',
      letterSpacing: '-0.01em',
      borderRadius: or ? 0 : '8px',
      background: bg, color,
      border: or ? 'none' : `1.5px ${borderStyle} ${border}`,
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

// ─── Group dimensions helper ──────────────────────────────────────────────────
function groupDims(n) {
  const twoCol = n >= EGRP_TWO_COL_MIN;
  const perCol = twoCol ? Math.ceil(n / 2) : n;
  const w = twoCol ? EGRP_W_2COL : EGRP_W;
  const h = EGRP_PAD_V * 2 + perCol * HS + (perCol - 1) * EGRP_ITEM_GAP;
  return { w, h, twoCol, perCol };
}

// ─── Hover cluster with OR group blocks ───────────────────────────────────────
function buildHoverCluster(fc, fcScreenX, fcScreenY, extraEdgesByFrom, orAllMembers, typeOf, containerH, center) {
  const andCourses = [];
  const orGroups   = [];

  (extraEdgesByFrom.get(fc) || []).forEach(e => {
    if (typeOf.get(e.to) === 'OR') {
      const courses = [...new Set(orAllMembers.get(e.to) || [])].sort();
      if (courses.length) orGroups.push({ orId: e.to, courses });
    } else {
      andCourses.push(e.to);
    }
  });
  andCourses.sort();

  if (!andCourses.length && !orGroups.length) return { nodes: [], edges: [] };

  const layoutItems = [
    ...orGroups.map(g => { const d = groupDims(g.courses.length); return { type: 'group', ...g, ...d }; }),
    ...andCourses.map(c => ({ type: 'and', courseId: c, h: HS, w: WS })),
  ];

  const maxItemW = Math.max(...layoutItems.map(item => item.w));
  const totalH   = layoutItems.reduce(
    (sum, item, i) => sum + item.h + (i < layoutItems.length - 1 ? EGRP_ITEM_GAP_OUTER : 0), 0
  );

  const hGap     = 110;
  const clusterX = fcScreenX - maxItemW - hGap;
  const startY   = (fcScreenY + HS / 2) - totalH / 2;

  const nodes = [];
  const edges = [];

  // MERGE junction
  const MERGE_ID = `MERGE@${fc}`;
  const mergeX   = clusterX + maxItemW + (hGap - 8) / 2;
  const mergeY   = fcScreenY + HS / 2 - 4;
  nodes.push({ id: MERGE_ID, type: 'mergeNode', data: {}, position: { x: mergeX, y: mergeY } });
  edges.push({
    id: `e-MERGE@${fc}-${fc}`,
    source: MERGE_ID, target: fc, type: 'straight',
    style: { stroke: '#94a3b8', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8', width: 10, height: 10 },
    data: { role: 'extra-merge', color: '#94a3b8' },
  });

  let curY = startY;
  layoutItems.forEach(item => {
    if (item.type === 'group') {
      const gbId = `EGRP_${item.orId}@${fc}`;
      nodes.push({
        id: gbId, type: 'extraGroupBg',
        data: { role: 'extraGroupBg' },
        position: { x: clusterX, y: curY },
        style: { width: item.w, height: item.h, background: 'transparent', border: 'none', padding: 0 },
        zIndex: 0, selectable: false,
      });
      edges.push({
        id: `e-${gbId}-MERGE`,
        source: gbId, target: MERGE_ID, type: 'straight',
        style: { stroke: '#94a3b8', strokeWidth: 1.5 },
      });
      item.courses.forEach((courseId, i) => {
        const col = item.twoCol && i >= item.perCol ? 1 : 0;
        const row = item.twoCol && i >= item.perCol ? i - item.perCol : i;
        const nx  = clusterX + EGRP_PAD_H + col * (WS + EGRP_PAD_H + EGRP_COL_GAP);
        const ny  = curY + EGRP_PAD_V + row * (HS + EGRP_ITEM_GAP);
        const role = courseId === center ? 'center_ref' : 'extra_prereq';
        nodes.push(makeNode(`${courseId}@${fc}`, nx, ny, role, typeOf, courseId));
      });
    } else {
      const nodeId = `${item.courseId}@${fc}`;
      nodes.push(makeNode(nodeId, clusterX + (maxItemW - WS) / 2, curY, 'extra_prereq', typeOf, item.courseId));
      edges.push({
        id: `e-${nodeId}-MERGE`,
        source: nodeId, target: MERGE_ID, type: 'straight',
        style: { stroke: '#94a3b8', strokeWidth: 1.5 },
      });
    }
    curY += item.h + EGRP_ITEM_GAP_OUTER;
  });

  return { nodes, edges };
}

// ─── Custom nodes ─────────────────────────────────────────────────────────────
const MergeNode = () => (
  <div style={{ width: 8, height: 8, background: '#94a3b8', borderRadius: '50%' }}>
    <Handle type="target" position={Position.Left}  style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
  </div>
);

const ExtraGroupBgNode = () => (
  <div style={{
    width: '100%', height: '100%', boxSizing: 'border-box',
    borderRadius: 8, border: '1.5px dashed #16a34a80', background: '#16a34a06',
    position: 'relative',
  }}>
    <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    <div style={{
      position: 'absolute', top: 3, left: 6,
      fontSize: 9, fontWeight: 700, color: '#16a34a55', letterSpacing: '0.06em',
    }}>OR</div>
  </div>
);

const nodeTypes = { mergeNode: MergeNode, extraGroupBg: ExtraGroupBgNode };

// ─── Fixed (click) panel ──────────────────────────────────────────────────────
const FixedPanel = ({ fixedNode, graph, onClear }) => {
  if (!fixedNode) return null;

  const orGroups   = [];
  const andCourses = [];
  (graph.extraEdgesByFrom.get(fixedNode) || []).forEach(e => {
    if (graph.typeOf.get(e.to) === 'OR') {
      const courses = [...new Set(graph.orAllMembers.get(e.to) || [])].sort();
      if (courses.length) orGroups.push({ orId: e.to, courses });
    } else {
      andCourses.push(e.to);
    }
  });
  andCourses.sort();

  const chip = (courseId) => (
    <span key={courseId} style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 6,
      fontSize: 11, fontWeight: 600, margin: '2px 3px',
      background: courseId === graph.CENTER ? '#5568ff' : '#16a34a15',
      color:      courseId === graph.CENTER ? '#fff'     : '#16a34a',
      border: `1px solid ${courseId === graph.CENTER ? '#5568ff' : '#16a34a55'}`,
    }}>{courseId}</span>
  );

  return (
    <div style={{
      position: 'absolute', top: 16, right: 16,
      background: 'white', borderRadius: 12, padding: '14px 16px',
      boxShadow: '0 8px 32px rgba(85,104,255,0.12)',
      border: '1px solid rgba(85,104,255,0.15)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      minWidth: 220, maxWidth: 300, zIndex: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{fixedNode}</span>
        <button onClick={onClear} style={{
          background: 'none', border: '1px solid #e2e8f0', borderRadius: 6,
          cursor: 'pointer', fontSize: 11, color: '#64748b', padding: '2px 8px',
        }}>Clear</button>
      </div>

      {(orGroups.length > 0 || andCourses.length > 0) && (
        <div style={{ fontSize: 10, fontWeight: 700, color: '#5568ff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          Prerequisites
        </div>
      )}

      {orGroups.length > 1 && (
        <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 8px', lineHeight: 1.4 }}>
          All groups are required — pick one course from each.
        </p>
      )}

      {orGroups.map((g) => (
        <div key={g.orId} style={{
          marginBottom: 8, padding: '6px 8px', borderRadius: 8,
          border: '1.5px dashed #16a34a70', background: '#16a34a05',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#16a34a60', marginBottom: 4, letterSpacing: '0.06em' }}>
            Pick one of:
          </div>
          <div style={{ lineHeight: 1.6 }}>
            {g.courses.map(chip)}
          </div>
        </div>
      ))}

      {andCourses.length > 0 && orGroups.length > 0 && (
        <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', margin: '2px 0 6px', letterSpacing: '0.04em' }}>
          + also required:
        </div>
      )}

      {andCourses.length > 0 && (
        <div style={{ lineHeight: 1.6 }}>
          {andCourses.map(c => (
            <span key={c} style={{
              display: 'inline-block', padding: '2px 8px', borderRadius: 6,
              fontSize: 11, fontWeight: 600, margin: '2px 3px',
              background: '#64748b15', color: '#475569', border: '1px solid #64748b55',
            }}>{c}</span>
          ))}
        </div>
      )}

      {!orGroups.length && !andCourses.length && (
        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>No additional prerequisites.</p>
      )}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const CourseTreeCanvas = ({ rawData, selectedSubjects, selectedLevels, courseId }) => {
  const containerRef  = useRef(null);
  const rfInstanceRef = useRef(null);
  const leaveTimer    = useRef(null);

  const [containerH, setContainerH] = useState(600);
  const [activeNode, setActiveNode] = useState(null);  // hover
  const [fixedNode,  setFixedNode]  = useState(null);  // click-locked
  const [clickedNode, setClickedNode] = useState(null); // center/prereq info
  const [showHelp, setShowHelp]     = useState(true);

  const CENTER = courseId;

  // Clear fixed node when course changes
  useEffect(() => { setFixedNode(null); setClickedNode(null); }, [courseId]);

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
  }, [rawData, selectedSubjects, selectedLevels, containerH]);

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

    const filtered = allFollowing.filter(c => {
      const sub = c.replace(/\d.*$/, '');
      const lvl = c.match(/\d/)?.[0] || '1';
      const subMatch = selectedSubjects === null || selectedSubjects.has(sub);
      const lvlMatch = selectedLevels.has(lvl);
      return subMatch && lvlMatch;
    });

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

    const orAllMembers = new Map();
    rawData.forEach(d => {
      if (d.from_type === 'OR' && d.to_type === 'COURSE') {
        if (!orAllMembers.has(d.from)) orAllMembers.set(d.from, []);
        orAllMembers.get(d.from).push(d.to);
      }
    });

    const leftPos = buildLeftPositions(fwdEdges, typeOf, CENTER);

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
    [...col1Placements, ...col2Placements].forEach(({ id, x, y }) => {
      nodes.push(makeNode(id, x, y, 'following', typeOf));
    });

    const edgeSet = new Set();
    const edges = [];
    fwdEdges.forEach(e => {
      if (typeOf.get(e.to) === 'OR') return;
      const tgt = typeOf.get(e.from) === 'OR' ? resolveOr(e.from) : e.from;
      if (!tgt) return;
      const eid = `${e.to}|${tgt}`;
      if (edgeSet.has(eid)) return;
      edgeSet.add(eid);
      edges.push(makeEdge(e.to, tgt, 'left', '#94a3b8', true, 'straight'));
    });

    return { nodes, edges, typeOf, extraEdgesByFrom, orAllMembers, followPos,
      followingSet: new Set(filtered), CENTER, hasLeftWing: fwdEdges.length > 0 };
  }, [rawData, selectedSubjects, selectedLevels, containerH, CENTER]);

  // ── Build display graph ─────────────────────────────────────────────────────
  const { displayNodes, displayEdges } = useMemo(() => {
    // Hover takes priority; fall back to fixed node
    const target = activeNode || fixedNode;
    if (!target || !graph.followingSet.has(target)) {
      return { displayNodes: graph.nodes, displayEdges: graph.edges };
    }

    const fc  = target;
    const pos = graph.followPos.get(fc);
    if (!pos) return { displayNodes: graph.nodes, displayEdges: graph.edges };

    const cluster = buildHoverCluster(
      fc, pos.x, pos.y, graph.extraEdgesByFrom, graph.orAllMembers, graph.typeOf, containerH, graph.CENTER,
    );

    const updatedBase = graph.nodes.map(n =>
      n.data.role === 'following' && n.id !== fc
        ? { ...n, style: { ...n.style, opacity: 0.15 } }
        : n
    );

    return {
      displayNodes: [...updatedBase, ...cluster.nodes],
      displayEdges: [...graph.edges, ...cluster.edges],
    };
  }, [graph, activeNode, fixedNode, containerH]);

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
    const role = node.data.role;
    if (role === 'following') {
      setFixedNode(prev => prev === node.id ? null : node.id);
      setClickedNode(null);
    } else if (role === 'center' || role === 'left_prereq') {
      setClickedNode(prev => prev === node.id ? null : node.id);
      setFixedNode(null);
    }
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
        nodeTypes={nodeTypes}
      >
        <Background variant="dots" color="#d1d5db" gap={20} size={1.5} />
        <Controls />
      </ReactFlow>

      {/* ── Fixed (click) panel — following course detail ─────────────────── */}
      <FixedPanel fixedNode={fixedNode} graph={graph} onClear={() => setFixedNode(null)} />

      {/* ── Click info panel — center / prereq ───────────────────────────── */}
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
              <span className="ct-legend-dot" style={{ background: '#64748b15', border: '1.5px solid #64748b55' }} />
              <span><strong>Left</strong> — prerequisites of {CENTER}</span>
            </div>
          )}
          <div className="ct-legend-row">
            <span className="ct-legend-dot" style={{ background: '#a855f715', border: '1.5px solid #a855f780' }} />
            <span><strong>Purple</strong> — courses that need {CENTER}</span>
          </div>
          <div className="ct-legend-row">
            <span className="ct-legend-dot" style={{ background: '#16a34a15', border: '1.5px solid #16a34a55' }} />
            <span><strong>Green</strong> — extra prerequisites (hover/click)</span>
          </div>
          <div className="ct-legend-row">
            <span className="ct-legend-dot" style={{ background: '#16a34a06', border: '1.5px dashed #16a34a80', borderRadius: 4 }} />
            <span><strong>Green dashed box</strong> — pick one of these</span>
          </div>
          <hr className="ct-divider" />
          <p className="ct-help-note">
            <strong>Hover</strong> a purple course to preview prerequisites.
          </p>
          <p className="ct-help-note" style={{ marginTop: 6 }}>
            <strong>Click</strong> to lock and see AND/OR details.
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
