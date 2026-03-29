import { useState, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge
} from 'reactflow';

import 'reactflow/dist/style.css';
import { Plane, Info, X, Map, Layers, ShieldAlert, Bus, Footprints } from 'lucide-react';

// ─── 1. MOCK DATA (From Your JSON) ────────────────────────────────────────────

const MOCK_DATA = {
  flights: [
    { id: "FL001", flight_number: "EK203", aircraft_type: "A380", assigned_stand: "A1-01", status: "on_time", estimated_time: "2025-01-15T06:25:00Z" },
    { id: "FL002", flight_number: "QR501", aircraft_type: "B777-300ER", assigned_stand: "A1-01", status: "delayed", estimated_time: "2025-01-15T10:40:00Z" },
    { id: "FL003", flight_number: "BA107", aircraft_type: "B787-9", assigned_stand: "A1-02", status: "on_time", estimated_time: "2025-01-15T07:00:00Z" },
    { id: "FL004", flight_number: "LH752", aircraft_type: "A340-600", assigned_stand: "A1-02", status: "on_time", estimated_time: "2025-01-15T11:30:00Z" },
    { id: "FL005", flight_number: "SQ321", aircraft_type: "A350-900", assigned_stand: "A1-03", status: "on_time", estimated_time: "2025-01-15T08:50:00Z" },
    { id: "FL006", flight_number: "EK512", aircraft_type: "B777-300ER", assigned_stand: "A1-03", status: "on_time", estimated_time: "2025-01-15T13:00:00Z" },
    { id: "FL007", flight_number: "QF001", aircraft_type: "A380", assigned_stand: "B1-01", status: "early", estimated_time: "2025-01-15T05:20:00Z" },
    { id: "FL008", flight_number: "CX888", aircraft_type: "A350-1000", assigned_stand: "B1-01", status: "early", estimated_time: "2025-01-15T09:50:00Z" },
    { id: "FL009", flight_number: "JL043", aircraft_type: "B787-9", assigned_stand: "B1-02", status: "on_time", estimated_time: "2025-01-15T14:30:00Z" },
    { id: "FL010", flight_number: "AF218", aircraft_type: "A330-200", assigned_stand: "B1-03", status: "delayed", estimated_time: "2025-01-15T16:15:00Z" }
  ],
  stands: [
    { id: "A1-01", terminal: "T1", type: "contact", max_aircraft_size: "F", position: { x: 100, y: 50 } },
    { id: "A1-02", terminal: "T1", type: "contact", max_aircraft_size: "E", position: { x: 100, y: 150 } },
    { id: "A1-03", terminal: "T1", type: "contact", max_aircraft_size: "E", position: { x: 100, y: 250 } },
    { id: "A1-04", terminal: "T1", type: "contact", max_aircraft_size: "D", position: { x: 100, y: 350 } },
    { id: "A1-05", terminal: "T1", type: "remote", max_aircraft_size: "E", position: { x: 100, y: 450 } },
    { id: "B1-01", terminal: "T2", type: "contact", max_aircraft_size: "F", position: { x: 600, y: 50 } },
    { id: "B1-02", terminal: "T2", type: "contact", max_aircraft_size: "E", position: { x: 600, y: 150 } },
    { id: "B1-03", terminal: "T2", type: "contact", max_aircraft_size: "D", position: { x: 600, y: 250 } },
    { id: "B1-04", terminal: "T2", type: "remote", max_aircraft_size: "F", position: { x: 600, y: 350 } },
    { id: "B1-05", terminal: "T2", type: "remote", max_aircraft_size: "D", position: { x: 600, y: 450 } }
  ],
  gates: [
    { id: "G01", terminal: "T1", type: "contact", position: { x: 300, y: 50 } },
    { id: "G02", terminal: "T1", type: "contact", position: { x: 300, y: 150 } },
    { id: "G03", terminal: "T1", type: "contact", position: { x: 300, y: 300 } },
    { id: "G04", terminal: "T1", type: "contact", position: { x: 300, y: 450 } },
    { id: "G05", terminal: "T2", type: "contact", position: { x: 800, y: 50 } },
    { id: "G06", terminal: "T2", type: "contact", position: { x: 800, y: 150 } },
    { id: "G07", terminal: "T2", type: "non_contact", position: { x: 800, y: 350 } }
  ],
  graph_edges: {
    plb_connections: [
      { stand: "A1-01", gate: "G01", type: "plb" },
      { stand: "A1-02", gate: "G02", type: "plb" },
      { stand: "A1-03", gate: "G03", type: "plb" },
      { stand: "A1-04", gate: "G04", type: "plb" },
      { stand: "B1-01", gate: "G05", type: "plb" },
      { stand: "B1-02", gate: "G06", type: "plb" }
    ],
    walking_connections: [
      { stand: "A1-04", gate: "G03", type: "walking" },
      { stand: "B1-03", gate: "G07", type: "walking" },
      { stand: "B1-04", gate: "G07", type: "bus" },
      { stand: "B1-05", gate: "G07", type: "bus" }
    ],
    adjacency_constraints: [
      { stand_a: "A1-01", stand_b: "A1-02", type: "wingtip" },
      { stand_a: "A1-03", stand_b: "A1-04", type: "wingtip" },
      { stand_a: "B1-01", stand_b: "B1-02", type: "adjacency" }
    ]
  }
};

// ─── 2. DATA TRANSFORMER ──────────────────────────────────────────────────────

const generateGraphData = () => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Map Gates
  MOCK_DATA.gates.forEach((g) => {
    nodes.push({
      id: g.id,
      type: 'gate',
      position: g.position,
      data: { label: g.id, terminal: g.terminal }
    });
  });

  // Map Stands & Current Occupancy
  MOCK_DATA.stands.forEach((s) => {
    // Determine active flight (simulating 'current' by taking the first matching flight)
    const activeFlight = MOCK_DATA.flights.find(f => f.assigned_stand === s.id);
    nodes.push({
      id: s.id,
      type: 'stand',
      position: s.position,
      data: {
        label: s.id,
        terminal: s.terminal,
        type: s.type,
        maxSize: s.max_aircraft_size,
        status: activeFlight ? 'occupied' : 'available',
        flight: activeFlight?.flight_number,
        aircraft: activeFlight?.aircraft_type
      }
    });
  });

  // Map Edges
  MOCK_DATA.graph_edges.plb_connections.forEach((e) => {
    edges.push({
      id: `plb-${e.gate}-${e.stand}`, source: e.gate, target: e.stand, type: 'smoothstep',
      sourceHandle: 'left', targetHandle: 'right', data: { type: 'plb' },
      style: { stroke: '#3b82f6', strokeWidth: 3 }
    });
  });

  MOCK_DATA.graph_edges.walking_connections.forEach((e) => {
    edges.push({
      id: `walk-${e.gate}-${e.stand}`, source: e.gate, target: e.stand, type: 'smoothstep',
      sourceHandle: 'left', targetHandle: 'right', data: { type: e.type }, animated: true,
      style: { stroke: e.type === 'bus' ? '#f59e0b' : '#a8a29e', strokeWidth: 2, strokeDasharray: '6,6' }
    });
  });

  MOCK_DATA.graph_edges.adjacency_constraints.forEach((e) => {
    edges.push({
      id: `adj-${e.stand_a}-${e.stand_b}`, source: e.stand_a, target: e.stand_b, type: 'straight',
      sourceHandle: 'bottom', targetHandle: 'top', data: { type: 'constraint' },
      style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '4,4' }
    });
  });

  return { nodes, edges };
};

// ─── 3. CUSTOM NODES ──────────────────────────────────────────────────────────

const GateNode = ({ data }: any) => {
  const isT1 = data.terminal === 'T1';
  return (
    <div className={`relative flex items-center justify-center w-20 h-20 rounded-full border-[3px] shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 ${
      isT1 ? 'bg-blue-500/10 border-blue-500/50 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
           : 'bg-violet-500/10 border-violet-500/50 text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
    }`}>
      {/* 4-way handles for dynamic routing */}
      <Handle type="source" position={Position.Left} id="left" className="opacity-0" />
      <Handle type="target" position={Position.Right} id="right" className="opacity-0" />
      <Handle type="target" position={Position.Top} id="top" className="opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0" />
      
      <div className="flex flex-col items-center">
        <Map size={18} className={isT1 ? 'text-blue-400 mb-1' : 'text-violet-400 mb-1'} />
        <span className="font-bold font-mono text-xs">{data.label}</span>
      </div>
    </div>
  );
};

const StandNode = ({ data }: any) => {
  const isOccupied = data.status === 'occupied';
  return (
    <div className={`relative flex flex-col items-center justify-center w-[120px] h-[80px] rounded-xl border-[2px] shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 ${
      isOccupied 
        ? 'bg-emerald-500/10 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.25)]' 
        : 'bg-white/5 border-white/10 opacity-70'
    }`}>
      <Handle type="target" position={Position.Top} id="top" className="opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0" />
      <Handle type="target" position={Position.Right} id="right" className="opacity-0" />
      <Handle type="source" position={Position.Left} id="left" className="opacity-0" />
      
      {isOccupied && (
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
      )}
      
      <span className="font-bold font-mono text-sm text-white flex items-center gap-1.5">
        {data.label}
        {data.type === 'remote' && <Bus size={10} className="text-amber-400" />}
      </span>
      
      {isOccupied ? (
        <div className="flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[0.6rem] font-bold tracking-wider border border-emerald-500/30">
          <Plane size={10} /> {data.flight}
        </div>
      ) : (
        <span className="mt-2 text-[0.6rem] uppercase tracking-widest text-gray-500 font-bold">Empty</span>
      )}
    </div>
  );
};

const nodeTypes = { gate: GateNode, stand: StandNode };

// ─── 4. MAIN COMPONENT ────────────────────────────────────────────────────────

export default function ResourceGraph() {
  const initialData = useMemo(() => generateGraphData(), []);
  const [nodes, , onNodesChange] = useNodesState(initialData.nodes);
  const [edges, , onEdgesChange] = useEdgesState(initialData.edges);
  
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  const [showConstraints, setShowConstraints] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);

  // Compute highlighting sets
  const { highlightedNodes, highlightedEdges } = useMemo(() => {
    if (!hoveredNode) return { highlightedNodes: new Set(), highlightedEdges: new Set() };
    const hEdges = new Set<string>();
    const hNodes = new Set<string>([hoveredNode]);
    
    edges.forEach(e => {
      if (e.source === hoveredNode || e.target === hoveredNode) {
        hEdges.add(e.id);
        hNodes.add(e.source);
        hNodes.add(e.target);
      }
    });
    return { highlightedNodes: hNodes, highlightedEdges: hEdges };
  }, [hoveredNode, edges]);

  // Apply visual dimming & toggles
  const displayNodes = nodes.map((n) => ({
    ...n,
    style: { opacity: hoveredNode && !highlightedNodes.has(n.id) ? 0.2 : 1, transition: 'opacity 0.3s ease' }
  }));

  const displayEdges = edges.map((e) => {
    let hidden = false;
    if (e.data?.type === 'constraint' && !showConstraints) hidden = true;
    if ((e.data?.type === 'bus' || e.data?.type === 'walking') && !showRoutes) hidden = true;

    return {
      ...e,
      hidden,
      style: {
        ...e.style,
        opacity: hoveredNode && !highlightedEdges.has(e.id) ? 0.05 : (hidden ? 0 : 1),
        transition: 'opacity 0.3s ease'
      }
    };
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .react-flow__bg { background-color: #050505; }
        .react-flow__controls button { background-color: #18181b; border-color: #27272a; fill: #a1a1aa; }
        .react-flow__controls button:hover { background-color: #27272a; fill: #f4f4f5; }
      `}</style>

      <div className="fixed inset-0 w-screen h-screen bg-[#050505] text-white font-sans overflow-hidden flex">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={displayNodes}
            edges={displayEdges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeMouseEnter={(_, node) => setHoveredNode(node.id)}
            onNodeMouseLeave={() => setHoveredNode(null)}
            onNodeClick={(_, node) => setSelectedNode(node)}
            onPaneClick={() => setSelectedNode(null)}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.5}
            maxZoom={2}
          >
            <Background color="#27272a" gap={24} size={2} />
            <Controls className="shadow-2xl border border-white/10 rounded-lg overflow-hidden m-6" />
          </ReactFlow>

          {/* Header */}
          <div className="absolute top-6 left-6 z-10 pointer-events-none">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Resource Network
              <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[0.65rem] uppercase tracking-widest text-blue-400 font-bold">Live</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">LHR Topology mapped to active JSON schema</p>
          </div>

          {/* Layer Controls */}
          <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-3 bg-[#0A0A0C]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-widest text-gray-500">
              <Layers size={14} /> Topology Layers
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-9 h-5 rounded-full transition-colors relative ${showConstraints ? 'bg-red-500' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${showConstraints ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <input type="checkbox" className="hidden" checked={showConstraints} onChange={(e) => setShowConstraints(e.target.checked)} />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
                <ShieldAlert size={14} className="text-red-400" /> Adjacency Constraints
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-9 h-5 rounded-full transition-colors relative ${showRoutes ? 'bg-amber-500' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${showRoutes ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <input type="checkbox" className="hidden" checked={showRoutes} onChange={(e) => setShowRoutes(e.target.checked)} />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
                <Footprints size={14} className="text-amber-400" /> Ground Routing
              </span>
            </label>
          </div>
        </div>

        {/* Info Panel */}
        <aside className={`w-80 bg-[#0A0A0C] border-l border-white/10 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${selectedNode ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full z-20'}`}>
          {selectedNode && (
            <>
              <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/[0.02]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                    {selectedNode.type === 'gate' ? 'Terminal Gate' : 'Aircraft Stand'}
                  </div>
                  <h2 className="text-3xl font-bold font-mono text-white">{selectedNode.data.label}</h2>
                  <span className={`inline-block mt-2 px-2.5 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-widest border ${
                    selectedNode.data.terminal === 'T1' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                  }`}>
                    {selectedNode.data.terminal}
                  </span>
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-6">
                {selectedNode.type === 'stand' && (
                  <>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Current Status</span>
                      {selectedNode.data.status === 'occupied' ? (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-emerald-500/20">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><Plane size={20} /></div>
                            <div>
                              <div className="text-lg font-bold font-mono text-emerald-400">{selectedNode.data.flight}</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Aircraft Setup</span>
                            <span className="font-mono font-bold text-gray-200">{selectedNode.data.aircraft}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-medium text-gray-400">
                          Stand is currently empty and available for allocation.
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Properties</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                          <div className="text-[0.65rem] uppercase text-gray-500 mb-1">Max Size Code</div>
                          <div className="font-mono text-sm text-white">{selectedNode.data.maxSize || 'N/A'}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                          <div className="text-[0.65rem] uppercase text-gray-500 mb-1">Boarding Type</div>
                          <div className="font-mono text-sm text-white capitalize">{selectedNode.data.type}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedNode.type === 'gate' && (
                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-sm leading-relaxed text-gray-300">
                    <Info size={16} className="inline mb-1 mr-2 text-blue-400" />
                    This gate acts as a passenger holding node. Check the edges connecting this gate to verify PLB, bus, or walking statuses to individual stands.
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}