import React, { useEffect, useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import ConfirmDialog from './ConfirmDialog'; // если рядом
import '../../css/app.user-panel.css';

const UserPanel = ({ familyTreeId, onClose, onOpen, currentUserRole }) => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmDialog, setConfirmDialog] = useState(null);

    useEffect(() => {
        onOpen?.();
    }, []);

    useEffect(() => {
        fetch(`/users/by-tree/${familyTreeId}`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Ошибка при получении пользователей:', error));
    }, [familyTreeId]);

    const fuse = useMemo(() => {
        return new Fuse(users, {
            keys: ['name'],
            threshold: 0.3,
        });
    }, [users]);

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;
        return fuse.search(searchQuery).map(result => result.item);
    }, [searchQuery, fuse, users]);

    const toggleRole = async (user) => {
        const newRoleName = user.role === 3 ? 'исследователь' : 'пользователь';

        setConfirmDialog({
            text: `Сменить роль пользователя "${user.name}" на "${newRoleName}"?`,
            onYes: async () => {
                try {
                    await fetch('/users/toggle-role', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: user.id, familyTreeId }),
                    });

                    // обновим юзеров
                    const res = await fetch(`/users/by-tree/${familyTreeId}`);
                    const data = await res.json();
                    setUsers(data);
                } catch (err) {
                    console.error('Ошибка при смене роли:', err);
                }
                setConfirmDialog(null);
            },
            onNo: () => setConfirmDialog(null),
        });
    };

    const removeUser = (user) => {
        setConfirmDialog({
            text: `Удалить пользователя "${user.name}" из текущего древа?`,
            onYes: async () => {
                try {
                    await fetch('/users/remove', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: user.id, familyTreeId }),
                    });

                    // обновим юзеров
                    const res = await fetch(`/users/by-tree/${familyTreeId}`);
                    const data = await res.json();
                    setUsers(data);
                } catch (err) {
                    console.error('Ошибка при удалении пользователя:', err);
                }
                setConfirmDialog(null);
            },
            onNo: () => setConfirmDialog(null),
        });
    };

    return (
        <div className="search-panel">
            <div className="search-panel-header">
                <span className="search-title">Пользователи древа</span>
                <span className="search-close" onClick={onClose}>×</span>
            </div>

            <input
                className="search-input"
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />

            <ul className="person-list">
                {filteredUsers.map(user => {
                    const isCreator = user.role === 1;
                    return (
                        <li key={user.id} className="person-item">
                            <img className="person-avatar" src="/storage/default-user.png" alt={user.name} />
                            <span className="person-name">{user.name}</span>

                            {!isCreator && (
                                <div className="user-actions">
                                    <button
                                        className="user-role-toggle"
                                        title="Сменить роль"
                                        onClick={() => toggleRole(user)}
                                    >
                                        {user.role === 3 ? '↑' : '↓'}
                                    </button>
                                    <button
                                        className="user-remove"
                                        title="Удалить"
                                        onClick={() => removeUser(user)}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>

            {confirmDialog && (
                <ConfirmDialog
                    text={confirmDialog.text}
                    onYes={confirmDialog.onYes}
                    onNo={confirmDialog.onNo}
                />
            )}
        </div>
    );
};

export default UserPanel;
