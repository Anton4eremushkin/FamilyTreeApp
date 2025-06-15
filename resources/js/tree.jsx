import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import ReactFlow, {Background, Controls, MiniMap} from 'reactflow';
import 'reactflow/dist/style.css';
import PersonNode from './components/PersonNode';
import {generateGraphData} from './graphGenerator';
import CustomFamilyEdge from './components/CustomFamilyEdge';
import PersonModal from './components/PersonModal';
import TreeHeader from './components/TreeHeader.jsx';
import SearchPanel from './components/SearchPanel.jsx';
import UserPanel from "./components/UserPanel.jsx";


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
    const userRole = window.userRole;
    const isReadOnly = ['guest', 'user'].includes(userRole);
    const familyTreeId = window.familyTreeId;
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUsersOpen, setIsUsersOpen] = useState(false);


    //апдейт графа
    useEffect(() => {
        const people = window.peopleData || [];
        const relations = window.relationData || [];
        const {nodes, edges} = generateGraphData(people, relations);
        setNodes(nodes);
        setEdges(edges);
    }, []);

    // При двойном клике делаем запрос на бэк за полной персоной по ID
    const handleNodeDoubleClick = async (_, node) => {
        setLoadingPerson(true);
        try {
            const res = await fetch(`/person/${node.id}`);
            if (!res.ok) throw new Error('Ошибка загрузки персоны');
            const data = await res.json();
            setSelectedPerson(data);
        } catch (e) {
            alert(e.message);
        } finally {
            setLoadingPerson(false);
        }
    };

    const handlePersonSearchSelect = async (personId) => {
        setLoadingPerson(true);
        try {
            const res = await fetch(`/person/${personId}`);
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
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updated),
            });
            if (!res.ok) throw new Error('Ошибка сохранения');
            const savedPerson = await res.json();

            // Обновим узлы, чтобы изменения появились на дереве
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === savedPerson.id
                        ? {...node, data: {...node.data, ...savedPerson}}
                        : node
                )
            );

            setSelectedPerson(null);
            alert('Сохранено успешно');
        } catch (e) {
            alert(e.message);
        }
    };

    const handleDeletePerson = async (personId) => {
        if (!window.confirm("Ты точно хочешь удалить эту персону? Это необратимо!")) {
            return;
        }

        try {
            const response = await fetch(`/person/${personId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                window.location.reload();
                alert("Персона успешно удалена");
            } else {
                const errorData = await response.json();
                alert(`Ошибка при удалении: ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            alert(`Ошибка сети: ${error.message}`);
        }
    };

    const updateGraphData = () => {
        const {nodes, edges} = generateGraphData(window.peopleData, window.relationData);
        setNodes(nodes);
        setEdges(edges);
        setSelectedPerson(null);
    };

    useEffect(() => {
        updateGraphData();
    }, []);

    return (
        <div className="tree-view" style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <TreeHeader userRole={window.userRole}
            onSearchClick={() => setIsSearchOpen(prev => !prev)}
            onUsersClick={() => setIsUsersOpen(prev => !prev)}

            />
            <div style={{flexGrow: 1, position: 'relative'}}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    onNodeDoubleClick={handleNodeDoubleClick}
                    proOptions={{ hideAttribution: true }}
                    style={{width: '100%', height: '100%'}}
                >
                    <Background/>
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
                    {isSearchOpen && (
                        <SearchPanel
                            onOpen={() => setIsUsersOpen(false)}
                            onClose={() => setIsSearchOpen(false)}
                            onPersonSelect={handlePersonSearchSelect}
                            familyTreeId={familyTreeId}
                        />
                    )}
                    {isUsersOpen && (
                        <UserPanel
                            onOpen={() => setIsSearchOpen(false)}
                            onClose={() => setIsUsersOpen(false)}
                            familyTreeId={familyTreeId}
                        />
                    )}
                </ReactFlow>

                {selectedPerson && !loadingPerson && (
                    <PersonModal
                        person={selectedPerson}
                        onClose={() => setSelectedPerson(null)}
                        onDelete={handleDeletePerson}
                        updateGraphData={updateGraphData}
                        onSave={handleSavePerson}
                        readOnly={isReadOnly}
                        familyTreeId={familyTreeId}
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
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('react-flow-root')).render(<TreeApp/>);
