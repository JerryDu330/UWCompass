import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';
import ELK from 'elkjs';
import 'reactflow/dist/style.css';

const elk = new ELK();

const THEME = {
  nonSubject: { bg: '#64748b' },
  levels: {
    '1': { bg: '#0ea5e9' },
    '2': { bg: '#a855f7' },
    '3': { bg: '#5568ff' },
    '4': { bg: '#7c3aed' },
  },
};

const FILTER_ITEMS = [
  { key: '1',     color: THEME.levels['1'].bg, label: '100-level courses' },
  { key: '2',     color: THEME.levels['2'].bg, label: '200-level courses' },
  { key: '3',     color: THEME.levels['3'].bg, label: '300-level courses' },
  { key: '4',     color: THEME.levels['4'].bg, label: '400-level courses' },
  { key: 'other', color: THEME.nonSubject.bg,  label: 'Other subject courses' },
];

const TRACE_LEGEND = [
  { solid: true,  label: 'Direct prereqs / dependents' },
  { solid: false, label: 'Indirect chain' },
];

const CustomCourseNode = ({ data }) => {
  const c = data.color;
  let bg, border, textColor, shadow;

  if (data.isDirect) {
    bg = c; border = `6px solid ${c}`; textColor = '#fff';
    shadow = `0 0 40px 10px ${c}50`;
  } else if (data.isIndirect) {
    bg = c + '30'; border = `4px solid ${c}80`; textColor = c;
    shadow = `0 0 16px 4px ${c}25`;
  } else {
    bg = c + '15'; border = `4px solid ${c}55`; textColor = c;
    shadow = '0 2px 8px rgba(0,0,0,0.06)';
  }

  return (
    <div style={{
      width: 1200, height: 300,
      boxSizing: 'border-box',
      borderRadius: 40,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 170, fontWeight: 700,
      fontFamily: 'Inter, system-ui, sans-serif',
      transition: 'all 0.25s ease',
      cursor: 'pointer',
      background: bg, border, color: textColor, boxShadow: shadow,
    }}>
      {data.label}
    </div>
  );
};

const nodeTypes = {
  courseNode: CustomCourseNode,
  orNode: () => <div style={{ width: 15, height: 15, background: '#94a3b8', borderRadius: '50%' }} />,
};

const panelStyle = {
  position: 'absolute',
  zIndex: 10,
  background: 'white',
  borderRadius: 14,
  padding: '14px 18px',
  boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
  border: '1px solid rgba(0,0,0,0.05)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const sectionLabel = {
  fontSize: 10,
  fontWeight: 700,
  color: '#5568ff',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: 8,
};

// ─── Filter + Legend panel ────────────────────────────────────────────────────
const FilterLegend = ({ hiddenLevels, onToggle, onClose }) => (
  <div style={{ ...panelStyle, bottom: 16, right: 16, minWidth: 210 }}>
    {/* Header row */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <div style={{ ...sectionLabel, marginBottom: 0 }}>Course Levels</div>
      <button
        onClick={onClose}
        title="Hide legend"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 14, lineHeight: 1, color: '#94a3b8', padding: '0 2px',
        }}
      >✕</button>
    </div>

    {/* Clickable filter rows */}
    {FILTER_ITEMS.map(({ key, color, label }) => {
      const active = !hiddenLevels.has(key);
      return (
        <div
          key={key}
          onClick={() => onToggle(key)}
          title={active ? `Hide ${label}` : `Show ${label}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5,
            cursor: 'pointer', userSelect: 'none',
            opacity: active ? 1 : 0.45,
            transition: 'opacity 0.15s',
          }}
        >
          <div style={{
            width: 11, height: 11, borderRadius: 3, flexShrink: 0,
            background: active ? color : '#cbd5e1',
            transition: 'background 0.15s',
          }} />
          <span style={{
            fontSize: 12,
            color: active ? '#475569' : '#94a3b8',
            textDecoration: active ? 'none' : 'line-through',
            transition: 'color 0.15s',
          }}>{label}</span>
        </div>
      );
    })}

    {/* All / None shortcuts */}
    <div style={{ display: 'flex', gap: 8, margin: '6px 0 10px' }}>
      <button
        onClick={() => FILTER_ITEMS.forEach(f => hiddenLevels.has(f.key) && onToggle(f.key))}
        style={{
          fontSize: 10, padding: '2px 8px', borderRadius: 6, cursor: 'pointer',
          background: 'none', border: '1px solid #e2e8f0', color: '#64748b',
        }}
      >All</button>
      <button
        onClick={() => FILTER_ITEMS.forEach(f => !hiddenLevels.has(f.key) && onToggle(f.key))}
        style={{
          fontSize: 10, padding: '2px 8px', borderRadius: 6, cursor: 'pointer',
          background: 'none', border: '1px solid #e2e8f0', color: '#64748b',
        }}
      >None</button>
    </div>

    <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', margin: '0 0 8px' }} />

    {/* Hover highlight section (read-only) */}
    <div style={{ ...sectionLabel, marginBottom: 8 }}>Hover Highlight</div>
    {TRACE_LEGEND.map(({ solid, label }) => (
      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
        <div style={{
          width: 11, height: 11, borderRadius: 3, flexShrink: 0,
          background: solid ? '#5568ff' : '#5568ff30',
          border: '1.5px solid #5568ff',
        }} />
        <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
      </div>
    ))}
  </div>
);

// ─── HoverPanel ───────────────────────────────────────────────────────────────
const HoverPanel = ({ nodeId, starred, onToggleStar }) => {
  if (!nodeId) return null;
  const isStarred = starred?.has(nodeId);
  return (
    <div style={{
      ...panelStyle,
      top: 16, right: 16,
      minWidth: 220, maxWidth: 270,
      borderColor: 'rgba(85,104,255,0.2)',
      boxShadow: '0 15px 40px rgba(85,104,255,0.12)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{nodeId}</div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleStar(nodeId); }}
          title={isStarred ? 'Unstar' : 'Star this course'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 18, padding: '0 2px', lineHeight: 1,
            color: isStarred ? '#f59e0b' : '#d1d5db',
          }}
        >
          {isStarred ? '★' : '☆'}
        </button>
      </div>
      <div style={sectionLabel}>Highlighting</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{
          width: 10, height: 10, borderRadius: 2, flexShrink: 0,
          background: '#5568ff', border: '1.5px solid #5568ff',
        }} />
        <span style={{ fontSize: 12, color: '#475569' }}>Direct prerequisites &amp; dependents</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 10, height: 10, borderRadius: 2, flexShrink: 0,
          background: '#5568ff30', border: '1.5px solid #5568ff',
        }} />
        <span style={{ fontSize: 12, color: '#475569' }}>Full prerequisite &amp; dependent chain</span>
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8' }}>Other nodes are faded out.</div>
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', margin: '8px 0 6px' }} />
      <div style={{ fontSize: 11, color: '#5568ff', fontWeight: 500 }}>Double-click to explore course tree →</div>
    </div>
  );
};

const STARRED_KEY = 'uwcompass-starred-courses';

const GraphCanvas = ({ data, subject }) => {
  const { fitView } = useReactFlow();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hiddenLevels, setHiddenLevels] = useState(new Set());
  const [showLegend, setShowLegend] = useState(true);
  const lastClickRef = useRef({ id: null, time: 0 });
  const [starred, setStarred] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(STARRED_KEY) || '[]')); }
    catch { return new Set(); }
  });

  const toggleStar = useCallback((courseId) => {
    setStarred(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId); else next.add(courseId);
      localStorage.setItem(STARRED_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const toggleLevel = useCallback((key) => {
    setHiddenLevels(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const onNodeClick = useCallback((_, node) => {
    if (node.id.includes('OR_NODE')) return;
    const now = Date.now();
    const last = lastClickRef.current;
    if (last.id === node.id && now - last.time < 400) {
      lastClickRef.current = { id: null, time: 0 };
      navigate(`/course/${node.id}`);
    } else {
      lastClickRef.current = { id: node.id, time: now };
    }
  }, [navigate]);

  const getTrace = useCallback((nodeId, allEdges) => {
    const directNodes = new Set([nodeId]);
    const indirectNodes = new Set();

    allEdges.forEach(e => {
      if (e.target === nodeId) directNodes.add(e.source);
      if (e.source === nodeId) {
        directNodes.add(e.target);
        if (e.target.includes('OR_NODE')) {
          allEdges.forEach(subE => {
            if (subE.source === e.target) directNodes.add(subE.target);
          });
        }
      }
    });

    const traverse = (currId, dir) => {
      allEdges.forEach(e => {
        const match = dir === 'up' ? e.target === currId : e.source === currId;
        const next = dir === 'up' ? e.source : e.target;
        if (match && !indirectNodes.has(next)) {
          if (!directNodes.has(next)) indirectNodes.add(next);
          traverse(next, dir);
        }
      });
    };

    traverse(nodeId, 'up');
    traverse(nodeId, 'down');
    return { directNodes, indirectNodes };
  }, []);

  useEffect(() => {
    if (!data) return;
    const allIds = new Set();
    Object.entries(data).forEach(([t, p]) => { allIds.add(t); p.forEach(id => allIds.add(id)); });

    const initialNodes = Array.from(allIds).map(id => {
      const isOr = id.includes('OR_NODE');
      const lvl = id.match(/[1-4]/)?.[0] || '1';
      const isMain = subject && id.toUpperCase().includes(subject.toUpperCase());
      const color = isMain ? (THEME.levels[lvl] || THEME.levels['1']).bg : THEME.nonSubject.bg;
      return {
        id,
        type: isOr ? 'orNode' : 'courseNode',
        data: { label: isOr ? '' : id, color, level: lvl, isMain: !!isMain },
        position: { x: 0, y: 0 },
      };
    });

    const EDGE_COLOR = '#94a3b8';
    const initialEdges = [];
    Object.entries(data).forEach(([target, prereqs]) => {
      prereqs.forEach(source => {
        initialEdges.push({
          id: `e-${source}-${target}`, source, target,
          style: { stroke: EDGE_COLOR, strokeWidth: 8 },
          markerEnd: { type: MarkerType.ArrowClosed, color: EDGE_COLOR, width: 40, height: 40 },
        });
      });
    });

    const runLayout = async () => {
      const elkGraph = {
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': 'RIGHT',
          'elk.spacing.nodeNode': '60',
          'elk.layered.spacing.nodeNodeLayered': '600',
        },
        children: initialNodes.map(n => ({
          id: n.id,
          width: n.type === 'orNode' ? 20 : 1210,
          height: n.type === 'orNode' ? 20 : 310,
        })),
        edges: initialEdges.map(e => ({ id: e.id, sources: [e.source], targets: [e.target] }))
      };
      const layouted = await elk.layout(elkGraph);
      setNodes(initialNodes.map(node => {
        const n = layouted.children.find(l => l.id === node.id);
        return { ...node, position: { x: n.x, y: n.y } };
      }));
      setEdges(initialEdges);
      setTimeout(() => fitView({ padding: 0.5, duration: 800, maxZoom: 0.2 }), 200);
    };
    runLayout();
  }, [data, subject, setNodes, setEdges, fitView]);

  // Compute which node IDs are hidden by the level filter
  const hiddenNodeIds = useMemo(() => {
    const ids = new Set();
    nodes.forEach(n => {
      if (n.type === 'orNode') return;
      const key = n.data.isMain ? n.data.level : 'other';
      if (hiddenLevels.has(key)) ids.add(n.id);
    });
    return ids;
  }, [nodes, hiddenLevels]);

  const trace = useMemo(() =>
    hoveredNode ? getTrace(hoveredNode, edges) : null,
    [hoveredNode, edges, getTrace]
  );

  const finalNodes = nodes.map(n => {
    const isHidden = hiddenNodeIds.has(n.id);
    const isDirect  = !isHidden && !!trace?.directNodes.has(n.id);
    const isIndirect = !isHidden && !!trace?.indirectNodes.has(n.id);
    return {
      ...n,
      data: { ...n.data, isDirect, isIndirect },
      style: {
        opacity: isHidden ? 0 : (!trace || isDirect || isIndirect ? 1 : 0.18),
        pointerEvents: isHidden ? 'none' : 'auto',
        zIndex: isDirect ? 50 : (isIndirect ? 20 : 1),
        transition: 'opacity 0.2s',
      },
    };
  });

  const finalEdges = edges.map(e => {
    const edgeHidden = hiddenNodeIds.has(e.source) || hiddenNodeIds.has(e.target);
    return {
      ...e,
      style: {
        ...e.style,
        opacity: edgeHidden ? 0 : e.style?.opacity ?? 1,
        transition: 'opacity 0.2s',
      },
    };
  });

  return (
    <div style={{ width: '100%', height: '100%', background: 'transparent', position: 'relative' }}>
      <ReactFlow
        nodes={finalNodes}
        edges={finalEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={(_, n) => !n.id.includes('OR_NODE') && setHoveredNode(n.id)}
        onNodeMouseLeave={() => setHoveredNode(null)}
        minZoom={0.01}
        maxZoom={1.5}
        nodesDraggable={false}
      >
        <Background variant="dots" gap={80} size={2} color="#cbd5e1" />
        <Controls />
      </ReactFlow>

      {/* Filter + legend panel at bottom-right */}
      {showLegend
        ? <FilterLegend hiddenLevels={hiddenLevels} onToggle={toggleLevel} onClose={() => setShowLegend(false)} />
        : (
          <button
            onClick={() => setShowLegend(true)}
            title="Show legend / filters"
            style={{
              position: 'absolute', bottom: 16, right: 16, zIndex: 10,
              width: 32, height: 32, borderRadius: 8,
              background: 'white', border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.07)',
              cursor: 'pointer', fontSize: 14, color: '#5568ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >⊞</button>
        )
      }

      <HoverPanel nodeId={hoveredNode} starred={starred} onToggleStar={toggleStar} />
    </div>
  );
};

export default GraphCanvas;
