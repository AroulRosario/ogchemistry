import { Folder, Layers, Save } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { addEdge, Background, Controls, Handle, Position, ReactFlow, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';

const ComicNode = ({ data, isConnectable }) => {
    return (
        <div className="card" style={{
            padding: '1.25rem',
            background: data.type === 'lesson' ? 'var(--blue)' : 'var(--white)',
            color: data.type === 'lesson' ? 'white' : 'var(--black)',
            minWidth: '220px',
            border: `1px solid ${data.type === 'lesson' ? 'var(--blue)' : 'var(--border)'}`,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            borderRadius: '1rem'
        }}>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={{ background: '#94A3B8', width: 10, height: 10, border: '2px solid white' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                {data.type === 'lesson' ? <Folder size={20} color="white" /> : <Layers size={20} color="var(--blue)" />}
                <h4 className="bangers" style={{ margin: 0, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>{data.label}</h4>
            </div>
            {data.description && (
                <p style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    opacity: data.type === 'lesson' ? 0.9 : 0.6,
                    lineHeight: '1.4'
                }}>
                    {data.description}
                </p>
            )}

            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={{ background: '#94A3B8', width: 10, height: 10, border: '2px solid white' }} />
        </div>
    );
};

export default function VisualPathBuilder({ lessons, chapters, showNotification }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const nodeTypes = useMemo(() => ({ comic: ComicNode }), []);

    useEffect(() => {
        // Build initial layout
        const initialNodes = [];
        const initialEdges = [];

        let yOffset = 50;

        // Sort lessons by order
        const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

        sortedLessons.forEach((lesson, index) => {
            initialNodes.push({
                id: `lesson-${lesson.id}`,
                type: 'comic',
                position: { x: 400, y: yOffset },
                data: { label: lesson.title, description: lesson.description || 'Module', type: 'lesson' },
                draggable: true,
            });

            // Connect lesson sequentially
            if (index > 0) {
                initialEdges.push({
                    id: `e-lesson-${sortedLessons[index - 1].id}-${lesson.id}`,
                    source: `lesson-${sortedLessons[index - 1].id}`,
                    target: `lesson-${lesson.id}`,
                    animated: true,
                    style: { stroke: '#CBD5E1', strokeWidth: 2 },
                });
            }

            const lessonChapters = chapters.filter(c => c.lesson_id === lesson.id).sort((a, b) => a.order - b.order);

            yOffset += 150;

            lessonChapters.forEach((chapter, cIndex) => {
                initialNodes.push({
                    id: `chapter-${chapter.id}`,
                    type: 'comic',
                    position: { x: 700, y: yOffset - 150 + (cIndex * 150) },
                    data: { label: chapter.title, description: 'Chapter', type: 'chapter' },
                    draggable: true,
                });

                // Connect chapter to lesson
                initialEdges.push({
                    id: `e-chapter-${lesson.id}-${chapter.id}`,
                    source: `lesson-${lesson.id}`,
                    target: `chapter-${chapter.id}`,
                    type: 'step',
                    style: { stroke: '#CBD5E1', strokeWidth: 2, strokeDasharray: '5,5' },
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
        // You would handle connecting logic here
        // For now we'll just show a notification since true dependency mapping requires DB changes.
        showNotification('Connection mapped! (Requires saving)', 'success');
        setEdges((eds) => addEdge(params, eds));
    }, [showNotification, setEdges]);

    return (
        <div className="fade-in" style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h2 className="bangers" style={{ fontSize: '2.5rem', margin: 0, color: 'var(--black)' }}>VISUAL ARCHITECTURE</h2>
                    <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.5rem' }}>Map out the student journey across the chemistry universe.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', border: 'none' }}>
                        <Save size={18} /> SAVE ARCHITECTURE
                    </button>
                </div>
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
                    <Background color="#CBD5E1" gap={20} size={1} variant="lines" />
                    <Controls showInteractive={false} />
                </ReactFlow>
            </div>
        </div>
    );
}
