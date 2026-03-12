import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  useReactFlow,
} from 'reactflow';
import ELK from 'elkjs';
import 'reactflow/dist/style.css';

const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.aspectRatio': '2.0',
  'elk.separateConnectedComponents': 'true',
  'elk.spacing.componentComponent': '30',
  'elk.componentPacking.strategy': 'RECT_PACKING',
  'elk.layered.spacing.nodeNodeLayered': '200',
  'elk.spacing.nodeNode': '50',
  'elk.edgeRouting': 'ORTHOGONAL',
  'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
};

const CustomCourseNode = ({ data }) => (
  <div style={{
    background: data.color || '#3b82f6',
    border: `2px solid ${data.borderColor || '#1d4ed8'}`,
    color: '#fff',
    borderRadius: '10px',
    padding: '10px',
    width: 950,
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '10px 10px 0px rgba(0,0,0,0.1)',
    fontSize: '150px',
    fontWeight: 'bold'
  }}>
    {data.label}
  </div>
);

const nodeTypes = {
  courseNode: CustomCourseNode,
  orNode: () => <div style={{ width: 1, height: 1, background: '#94a3b8', borderRadius: '50%' }} />,
};

const GraphCanvas = ({ data }) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const currentDataRef = useRef(null);

  const getTrace = useCallback((nodeId, allEdges) => {
    const activeNodes = new Set([nodeId]);
    const activeEdges = new Set();
    const find = (id, dir) => {
      allEdges.forEach(e => {
        const match = dir === 'up' ? e.target === id : e.source === id;
        const next = dir === 'up' ? e.source : e.target;
        if (match && !activeEdges.has(e.id)) {
          activeEdges.add(e.id); activeNodes.add(next); find(next, dir);
        }
      });
    };
    find(nodeId, 'up'); find(nodeId, 'down');
    return { activeNodes, activeEdges };
  }, []);

  useEffect(() => {
    // Only run if data exists and is different from the last loaded data
    if (!data || data === currentDataRef.current) return;

    const allIds = new Set();
    Object.entries(data).forEach(([target, prereqs]) => {
      allIds.add(target); 
      prereqs.forEach(p => allIds.add(p));
    });

    const initialNodes = [];
    const initialEdges = [];
    const colorMap = { 
      '1': { bg: '#2563eb', border: '#1e3a8a' }, 
      '2': { bg: '#059669', border: '#064e3b' }, 
      '3': { bg: '#d97706', border: '#78350f' }, 
      '4': { bg: '#dc2626', border: '#7f1d1d' } 
    };

    allIds.forEach(id => {
      const isOr = id.startsWith('OR_NODE');
      const level = id.match(/\d/)?.[0] || '1';
      const colors = colorMap[level] || colorMap['1'];
      initialNodes.push({
        id,
        type: isOr ? 'orNode' : 'courseNode',
        data: { label: isOr ? '' : id, color: colors.bg, borderColor: colors.border },
        position: { x: 0, y: 0 },
      });
    });

    Object.entries(data).forEach(([targetId, prereqs]) => {
      prereqs.forEach(sourceId => {
        const isOrLink = sourceId.startsWith('OR_NODE') || targetId.startsWith('OR_NODE');
        initialEdges.push({
          id: `e-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: 'step',
          style: { 
            stroke: isOrLink ? '#cbd5e1' : '#1e293b', 
            strokeWidth: isOrLink ? 1.5 : 3.5,
            strokeDasharray: isOrLink ? '5,5' : '0' 
          },
          markerEnd: { type: MarkerType.ArrowClosed, color: isOrLink ? '#cbd5e1' : '#1e293b' }
        });
      });
    });

    const runLayout = async () => {
      const elkGraph = {
        id: 'root',
        layoutOptions: elkOptions,
        children: initialNodes.map(n => ({
          id: n.id,
          width: n.type === 'orNode' ? 1 : 950,
          height: n.type === 'orNode' ? 1 : 300
        })),
        edges: initialEdges.map(e => ({ id: e.id, sources: [e.source], targets: [e.target] }))
      };

      try {
        const layouted = await elk.layout(elkGraph);
        setNodes(initialNodes.map(node => {
          const elkNode = layouted.children.find(n => n.id === node.id);
          return { ...node, position: { x: elkNode.x, y: elkNode.y } };
        }));
        setEdges(initialEdges);
        currentDataRef.current = data; // Mark this data as processed
        setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 100);
      } catch (e) { console.error("ELK Layout Error:", e); }
    };

    runLayout();
  }, [data, setNodes, setEdges, fitView]);

  const trace = useMemo(() => 
    hoveredNode ? getTrace(hoveredNode, edges) : null, 
    [hoveredNode, edges, getTrace]
  );

  const finalNodes = nodes.map(n => ({
    ...n,
    style: { 
      opacity: !trace || trace.activeNodes.has(n.id) ? 1 : 0.1,
      transition: 'opacity 0.2s',
      zIndex: trace?.activeNodes.has(n.id) ? 10 : 1,
    }
  }));

  const finalEdges = edges.map(e => {
    const isActive = trace?.activeEdges.has(e.id);
    return {
      ...e,
      hidden: true,
      style: { 
        ...e.style, 
        stroke: isActive ? '#3b82f6' : e.style.stroke, 
        strokeWidth: isActive ? 5 : e.style.strokeWidth,
        opacity: !trace || isActive ? 1 : 0.1
      },
      zIndex: isActive ? 20 : 1
    };
  });

  // const finalEdges = edges.map(e => {
  //   const isActive = trace?.activeEdges.has(e.id);
  //   return {
  //     ...e,
  //     animated: isActive, // 激活时开启动画
  //     style: { 
  //       ...e.style, 
  //       stroke: isActive ? '#3b82f6' : e.style.stroke, 
  //       strokeWidth: isActive ? 4 : e.style.strokeWidth,
  //       opacity: !trace || isActive ? 1 : 0.1,
  //       transition: 'stroke 0.3s, stroke-width 0.3s'
  //     },
  //     markerEnd: { 
  //       ...e.markerEnd, 
  //       color: isActive ? '#3b82f6' : e.markerEnd.color 
  //     },
  //     zIndex: isActive ? 20 : 1
  //   };
  // });

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff' }}>
      <ReactFlow
        nodes={finalNodes}
        edges={finalEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={(_, n) => setHoveredNode(n.id)}
        onNodeMouseLeave={() => setHoveredNode(null)}
        minZoom={0.048}
      >
        <Background variant="lines" gap={20} color="#f1f5f9" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;