import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import PersonNode from './components/PersonNode';
import { generateGraphData } from './graphGenerator';

const nodeTypes = {
    person: PersonNode,
};

const TreeApp = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        const people = window.peopleData || [];
        const relations = window.relationData || [];
        const { nodes, edges } = generateGraphData(people, relations);
        setNodes(nodes);
        setEdges(edges);
    }, []);

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
                <Background />
                <Controls
                    position="top-right"
                    style={{
                        width: '40px',
                        height: 'auto',
                        top: '40%',
                        right: '5px',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        padding: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                />
                <MiniMap
                    nodeColor="rgba(169, 169, 169, 1)"
                    maskColor="rgba(100, 100, 100, 0.1)"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #aaa',
                        boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                    }}
                />
            </ReactFlow>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('react-flow-root')).render(<TreeApp />);
