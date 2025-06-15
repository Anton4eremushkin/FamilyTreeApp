import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import '../../css/app.search-panel.css';

const SearchPanel = ({ familyTreeId, onPersonSelect, onClose, onOpen }) => {
    const [persons, setPersons] = useState([]);
    const [filteredPersons, setFilteredPersons] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        onOpen?.();
    }, []);

    useEffect(() => {
        fetch(`/person/family/${familyTreeId}`)
            .then(res => res.json())
            .then(data => {
                setPersons(data);
                setFilteredPersons(data.slice(0, 7));
            })
            .catch(error => console.error('Ошибка при получении людей:', error));
    }, [familyTreeId]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredPersons(persons.slice(0, 7));
            return;
        }

        const fuse = new Fuse(persons, {
            keys: ['full_name'],
            threshold: 0.3, // чем меньше — тем точнее поиск
        });

        const results = fuse.search(searchQuery);
        setFilteredPersons(results.map(result => result.item).slice(0, 7));
    }, [searchQuery, persons]);

    return (
        <div className="search-panel">
            <div className="search-panel-header">
                <span className="search-title">Поиск людей в древе</span>
                <button className="close-button" onClick={onClose}>×</button>
            </div>

            <input
                className="search-input"
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />

            <ul className="person-list">
                {filteredPersons.map((person, index) => (
                    <React.Fragment key={person.id}>
                        <li
                            className="person-item"
                            onDoubleClick={() => {
                                onPersonSelect(person.id);
                                onClose();
                            }}
                        >
                            <img
                                src={`/storage/${person.url_img}`}
                                alt={person.full_name}
                                className="person-avatar"
                            />
                            <span className="person-name">{person.full_name}</span>
                        </li>
                        {index < filteredPersons.length - 1 && (
                            <li className="person-divider" />
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </div>
    );
};

export default SearchPanel;
