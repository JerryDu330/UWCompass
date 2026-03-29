import React, { useMemo, useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';
import ELK from 'elkjs';
import 'reactflow/dist/style.css';

const elk = new ELK();

const THEME = {
  nonSubject: { bg: '#b4bdc7', border: '#b4bdc7' },
  levels: {
    '1': { bg: '#33bfff', border: '#33bfff' }, 
    '2': { bg: 'rgb(221, 95, 221)', border: 'rgb(221, 95, 221)' }, 
    '3': { bg: '#307cff', border: '#307cff' }, 
    '4': { bg: '#8a4fff', border: '#8a4fff' }, 
  },
  // Updated to include RGBA for the "glow" transparency
  traceColors: {
    direct: 'rgba(10, 13, 3, 0.9)',   // Red Glow
    indirect: 'rgba(236, 136, 29, 0.9)', // Blue Glow
  }
};

const CustomCourseNode = ({ data }) => {
  const isHighlighted = data.isDirect || data.isIndirect;
  const glowColor = data.isDirect ? THEME.traceColors.direct : THEME.traceColors.indirect;

  // Layered shadows create the "Radiant" depth
  const glowStyle = isHighlighted ? {
    boxShadow: `
      0 0 15px 5px ${glowColor}, 
      0 0 40px 15px ${glowColor.replace('0.9', '0.4')},
      0 0 90px 30px ${glowColor.replace('0.9', '0.1')}
    `,
    border: `10px solid ${glowColor}`,
    transform: data.isDirect ? 'scale(1.02)' : 'scale(1)',
  } : {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: `12px solid ${data.borderColor}`,
    transform: 'scale(1)',
  };

  return (
    <div style={{
      background: data.color,
      color: data.textColor || '#fff',
      boxSizing: 'border-box',
      borderRadius: '40px',
      padding: '20px',
      width: 1200,
      height: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '180px',
      fontWeight: '900',
      fontFamily: 'Inter, system-ui, sans-serif',
      textShadow: '2px 4px 8px rgba(0,0,0,0.2)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      ...glowStyle,
    }}>
      {data.label}
    </div>
  );
};

const nodeTypes = {
  courseNode: CustomCourseNode,
  orNode: () => <div style={{ width: 15, height: 15, background: '#94a3b8', borderRadius: '50%' }} />,
};

const LEGEND_ITEMS = [
  { color: THEME.levels['1'].bg, label: '100-level courses' },
  { color: THEME.levels['2'].bg, label: '200-level courses' },
  { color: THEME.levels['3'].bg, label: '300-level courses' },
  { color: THEME.levels['4'].bg, label: '400-level courses' },
  { color: THEME.nonSubject.bg, label: 'Other subject courses' },
];

const TRACE_LEGEND = [
  { color: THEME.traceColors.direct, label: 'Direct prereqs / dependents' },
  { color: THEME.traceColors.indirect, label: 'Indirect chain' },
];

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

const Legend = () => (
  <div style={{ ...panelStyle, bottom: 16, left: 16, minWidth: 196 }}>
    <div style={sectionLabel}>Course Levels</div>
    {LEGEND_ITEMS.map(({ color, label }) => (
      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
        <div style={{ width: 11, height: 11, borderRadius: 3, background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
      </div>
    ))}
    <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', margin: '10px 0 8px' }} />
    <div style={sectionLabel}>Hover Highlight</div>
    {TRACE_LEGEND.map(({ color, label }) => (
      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
        <div style={{
          width: 11, height: 11, borderRadius: 3, background: color, flexShrink: 0,
          boxShadow: `0 0 6px 2px ${color}`,
        }} />
        <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
      </div>
    ))}
  </div>
);

const HoverPanel = ({ nodeId }) => {
  if (!nodeId) return null;
  return (
    <div style={{
      ...panelStyle,
      top: 16, right: 16,
      minWidth: 220, maxWidth: 270,
      borderColor: 'rgba(85,104,255,0.2)',
      boxShadow: '0 15px 40px rgba(85,104,255,0.12)',
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>
        {nodeId}
      </div>
      <div style={sectionLabel}>Highlighting</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{
          width: 10, height: 10, borderRadius: 2, flexShrink: 0,
          background: THEME.traceColors.direct,
          boxShadow: `0 0 5px 1px ${THEME.traceColors.direct}`,
        }} />
        <span style={{ fontSize: 12, color: '#475569' }}>Direct prerequisites &amp; dependents</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 10, height: 10, borderRadius: 2, flexShrink: 0,
          background: THEME.traceColors.indirect,
          boxShadow: `0 0 5px 1px ${THEME.traceColors.indirect}`,
        }} />
        <span style={{ fontSize: 12, color: '#475569' }}>Full prerequisite &amp; dependent chain</span>
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8' }}>Other nodes are faded out.</div>
    </div>
  );
};

const GraphCanvas = ({ data, subject }) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hoveredNode, setHoveredNode] = useState(null);

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
      const theme = isMain ? (THEME.levels[lvl] || THEME.levels['1']) : THEME.nonSubject;
      return {
        id,
        type: isOr ? 'orNode' : 'courseNode',
        data: { label: isOr ? '' : id, color: theme.bg, borderColor: theme.border, level: lvl },
        position: { x: 0, y: 0 },
      };
    });

    const initialEdges = [];
    Object.entries(data).forEach(([target, prereqs]) => {
      prereqs.forEach(source => {
        initialEdges.push({ id: `e-${source}-${target}`, source, target });
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

  const trace = useMemo(() => 
    hoveredNode ? getTrace(hoveredNode, edges) : null, 
    [hoveredNode, edges, getTrace]
  );

  const finalNodes = nodes.map(n => {
    const isDirect = trace?.directNodes.has(n.id);
    const isIndirect = trace?.indirectNodes.has(n.id);
    return {
      ...n,
      data: { ...n.data, isDirect, isIndirect },
      style: { 
        opacity: !trace || isDirect || isIndirect ? 1 : 0.08,
        zIndex: isDirect ? 50 : (isIndirect ? 20 : 1),
      }
    };
  });

  return (
    <div style={{ width: '100%', height: '100%', background: 'transparent', position: 'relative' }}>
      <ReactFlow
        nodes={finalNodes}
        edges={edges.map(e => ({ ...e, hidden: true }))}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={(_, n) => !n.id.includes('OR_NODE') && setHoveredNode(n.id)}
        onNodeMouseLeave={() => setHoveredNode(null)}
        minZoom={0.01}
        maxZoom={1.5}
        nodesDraggable={false}
      >
        <Background variant="dots" gap={80} size={2} color="#cbd5e1" />
        <Controls />
      </ReactFlow>
      <Legend />
      <HoverPanel nodeId={hoveredNode} />
    </div>
  );
};

export default GraphCanvas;