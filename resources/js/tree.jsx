import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

const generateGraph = (people) => {
    const nodes = people.map((person, index) => ({
        id: String(person.id),
        type: 'default',
        data: {
            label: (
                <div style={{ textAlign: 'center' }}>
                    <img
                        src={`/storage/${person.url_img}`}
                        alt={person.full_name}
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                    />
                    <div>
                        <strong>{person.full_name}</strong><br />
                        {person.birth_date?.slice(0, 4)}
                    </div>
                </div>
            ),
        },
        position: {
            x: index * 250,
            y: 100,
        },
    }));

    const edges = [];

    return { nodes, edges };
};

const TreeApp = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        const people = window.peopleData || [];
        const { nodes, edges } = generateGraph(people);
        setNodes(nodes);
        setEdges(edges);
    }, []);

    return (
        <div style={{width: '100vw', height: '100vh', position: 'relative'}}>
            <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background/>

                {/* Перемещаем Controls вправо и центрируем по высоте */}
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


                {/* Делаем MiniMap более заметной */}
                <MiniMap
                    nodeColor="rgba(169, 169, 169, 1)"
                    maskColor="rgba(100, 100, 100, 0.1)" // более тёмная маска
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
