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
  nonSubject: { bg: '#94a3b8', border: '#64748b' },
  levels: {
    '1': { bg: '#6366f1', border: '#4338ca' },
    '2': { bg: '#10b981', border: '#059669' },
    '3': { bg: '#f59e0b', border: '#d97706' },
    '4': { bg: '#ef4444', border: '#dc2626' },
  },
  glow: {
    direct: '0 0 80px 25px rgba(255, 215, 0, 0.9)', 
    indirect: '0 0 60px 10px rgba(56, 189, 248, 0.5)', 
  }
};

const CustomCourseNode = ({ data }) => {
  const shadow = data.isDirect 
    ? THEME.glow.direct 
    : data.isIndirect 
      ? THEME.glow.indirect 
      : '0 15px 20px -5px rgba(0,0,0,0.1)';

  return (
    <div style={{
      background: data.color,
      border: `12px solid ${data.borderColor}`,
      color: '#fff',
      boxSizing: 'border-box',
      borderRadius: '30px',
      padding: '20px',
      width: 1200,
      height: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: shadow,
      fontSize: '180px',
      fontWeight: '900',
      fontFamily: 'Inter, system-ui, sans-serif',
      textShadow: '2px 4px 8px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      transform: data.isDirect ? 'scale(1.05)' : 'scale(1)',
    }}>
      {data.label}
    </div>
  );
};

const nodeTypes = {
  courseNode: CustomCourseNode,
  orNode: () => <div style={{ width: 15, height: 15, background: '#94a3b8', borderRadius: '50%' }} />,
};

const GraphCanvas = ({ data, subject }) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hoveredNode, setHoveredNode] = useState(null);

  const getTrace = useCallback((nodeId, allEdges) => {
    const directNodes = new Set([nodeId]);
    const indirectNodes = new Set();

    // 1. GOLD LOGIC (Direct Enablement/Requirement)
    allEdges.forEach(e => {
      // If hover A (Dependent), turn its direct source (B or OR_NODE) Gold
      if (e.target === nodeId) {
        directNodes.add(e.source);
      }
      // If hover B (Prereq), find what it unlocks (A). Jump through OR_NODE if necessary.
      if (e.source === nodeId) {
        directNodes.add(e.target);
        if (e.target.includes('OR_NODE')) {
          allEdges.forEach(subE => {
            if (subE.source === e.target) directNodes.add(subE.target);
          });
        }
      }
    });

    // 2. BLUE LOGIC (Full Chain - show all relevant courses)
    const traverse = (currId, dir) => {
      allEdges.forEach(e => {
        const match = dir === 'up' ? e.target === currId : e.source === currId;
        const next = dir === 'up' ? e.source : e.target;
        if (match && !indirectNodes.has(next)) {
          // If it's not already Gold, make it Blue
          if (!directNodes.has(next)) {
            indirectNodes.add(next);
          }
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
          layoutOptions: { 'elk.layered.layering.layerIndex': n.data.level }
        })),
        edges: initialEdges.map(e => ({ id: e.id, sources: [e.source], targets: [e.target] }))
      };
      const layouted = await elk.layout(elkGraph);
      setNodes(initialNodes.map(node => {
        const n = layouted.children.find(l => l.id === node.id);
        return { ...node, position: { x: n.x + 5, y: n.y + 5 } };
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
    <div style={{ width: '100%', height: '100%', background: '#020617' }}>
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
        <Background variant="dots" gap={80} size={2} color="#1e293b" />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;