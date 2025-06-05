import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import PersonNode from './components/PersonNode';
import { generateGraphData } from './graphGenerator';
import CustomFamilyEdge from './components/CustomFamilyEdge';
import PersonModal from './components/PersonModal';

const nodeTypes = {
    person: PersonNode,
};

const edgeTypes = {
    familyEdge: CustomFamilyEdge,
};

const TreeApp = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [loadingPerson, setLoadingPerson] = useState(false);

    useEffect(() => {
        const people = window.peopleData || [];
        const relations = window.relationData || [];
        const { nodes, edges } = generateGraphData(people, relations);
        setNodes(nodes);
        setEdges(edges);
    }, []);

    // При двойном клике делаем запрос на бэк за полной персоной по ID
    const handleNodeDoubleClick = async (_, node) => {
        setLoadingPerson(true);
        try {
            const res = await fetch(`/person/${node.id}`); // предполагаем, что id у node — это person_id
            if (!res.ok) throw new Error('Ошибка загрузки персоны');
            const data = await res.json();
            setSelectedPerson(data);
        } catch (e) {
            alert(e.message);
        } finally {
            setLoadingPerson(false);
        }
    };

    // Сохраняем изменения, обновляем nodes
    const handleSavePerson = async (updated) => {
        try {
            const res = await fetch(`/person/${updated.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
            });
            if (!res.ok) throw new Error('Ошибка сохранения');
            const savedPerson = await res.json();

            // Обновим узлы, чтобы изменения появились на дереве
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === savedPerson.id
                        ? { ...node, data: { ...node.data, ...savedPerson } }
                        : node
                )
            );

            setSelectedPerson(null);
            alert('Сохранено успешно');
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                onNodeDoubleClick={handleNodeDoubleClick}
            >
                <Background />
                <Controls /*...*/ />
                <MiniMap /*...*/ />
            </ReactFlow>

            {selectedPerson && !loadingPerson && (
                <PersonModal
                    person={selectedPerson}
                    onClose={() => setSelectedPerson(null)}
                    onSave={handleSavePerson}
                />
            )}
            {loadingPerson && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        padding: 20,
                        borderRadius: 8,
                        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                    }}
                >
                    Загрузка...
                </div>
            )}
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('react-flow-root')).render(<TreeApp />);
