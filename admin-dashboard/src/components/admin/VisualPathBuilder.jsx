import { Folder, Layers, Save } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { addEdge, Background, Controls, Handle, Position, ReactFlow, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';

const EliteNode = ({ data, isConnectable }) => {
    return (
        <div className="card" style={{
            padding: '1rem',
            background: data.type === 'lesson' ? 'var(--blue)' : 'var(--white)',
            color: data.type === 'lesson' ? 'white' : 'var(--black)',
            minWidth: '200px',
            border: `1px solid ${data.type === 'lesson' ? 'var(--blue)' : 'var(--border)'}`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            borderRadius: '0.75rem',
            transition: 'all 0.2s ease'
        }}>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={{ background: '#94A3B8', width: 8, height: 8, border: '2px solid white' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                {data.type === 'lesson' ? <Folder size={16} color="white" /> : <Layers size={16} color="var(--blue)" />}
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>{data.label}</h4>
            </div>
            {data.description && (
                <p style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    opacity: data.type === 'lesson' ? 0.8 : 0.5,
                    lineHeight: '1.4'
                }}>
                    {data.description}
                </p>
            )}

            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={{ background: '#94A3B8', width: 8, height: 8, border: '2px solid white' }} />
        </div>
    );
};

export default function VisualPathBuilder({ lessons, chapters, showNotification }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const nodeTypes = useMemo(() => ({ elite: EliteNode }), []);

    useEffect(() => {
        const initialNodes = [];
        const initialEdges = [];

        let yOffset = 50;
        const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

        sortedLessons.forEach((lesson, index) => {
            initialNodes.push({
                id: `lesson-${lesson.id}`,
                type: 'elite',
                position: { x: 400, y: yOffset },
                data: { label: lesson.title, description: lesson.description || 'Module', type: 'lesson' },
                draggable: true,
            });

            if (index > 0) {
                initialEdges.push({
                    id: `e-lesson-${sortedLessons[index - 1].id}-${lesson.id}`,
                    source: `lesson-${sortedLessons[index - 1].id}`,
                    target: `lesson-${lesson.id}`,
                    animated: true,
                    style: { stroke: '#CBD5E1', strokeWidth: 1.5 },
                });
            }

            const lessonChapters = chapters.filter(c => c.lesson_id === lesson.id).sort((a, b) => a.order - b.order);
            yOffset += 150;

            lessonChapters.forEach((chapter, cIndex) => {
                initialNodes.push({
                    id: `chapter-${chapter.id}`,
                    type: 'elite',
                    position: { x: 650, y: yOffset - 150 + (cIndex * 150) },
                    data: { label: chapter.title, description: 'Chapter', type: 'chapter' },
                    draggable: true,
                });

                initialEdges.push({
                    id: `e-chapter-${lesson.id}-${chapter.id}`,
                    source: `lesson-${lesson.id}`,
                    target: `chapter-${chapter.id}`,
                    type: 'step',
                    style: { stroke: '#CBD5E1', strokeWidth: 1.5, strokeDasharray: '4,4' },
                });
            });

            if (lessonChapters.length > 0) {
                yOffset += (lessonChapters.length * 150);
            } else {
                yOffset += 50;
            }
        });

        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [lessons, chapters, setNodes, setEdges]);

    const onConnect = useCallback((params) => {
        showNotification('Connection mapped! (Requires saving)', 'success');
        setEdges((eds) => addEdge(params, eds));
    }, [showNotification, setEdges]);

    return (
        <div className="fade-in" style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Visual Architecture</h2>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Mapping the elite student journey.</p>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.4rem 1.5rem' }}>
                    <Save size={16} /> Update Schematic
                </button>
            </div>

            <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', border: '1px solid var(--border)', background: '#F8FAFC' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    attributionPosition="bottom-right"
                    snapToGrid={true}
                    snapGrid={[20, 20]}
                >
                    <Background color="#E2E8F0" gap={20} size={1} variant="dots" />
                    <Controls showInteractive={false} />
                </ReactFlow>
            </div>
        </div>
    );
}
