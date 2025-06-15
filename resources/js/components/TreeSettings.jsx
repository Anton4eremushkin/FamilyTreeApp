import React, { useEffect, useState } from 'react';
import '../../css/app.tree-settings.css';
import ConfirmDialog from './ConfirmDialog';

const TreeSettings = ({ familyTreeId, treeName, onClose, onOpen }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        onOpen?.();
    }, []);

    const handleRename = async () => {
        const newName = prompt('Введите новое название древа', treeName);
        if (!newName || newName.trim() === '' || newName === treeName) return;

        try {
            const response = await fetch(`/family-tree/${familyTreeId}/rename`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ name: newName }),
            });

            if (response.ok) {
                location.reload(); // Обновить страницу с новым названием
            } else {
                alert('Ошибка при переименовании');
            }
        } catch (err) {
            console.error(err);
            alert('Ошибка при соединении');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/family-tree/${familyTreeId}`, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (response.ok) {
                window.location.href = '/'; // Или на страницу создания древа
            } else {
                alert('Ошибка при удалении');
            }
        } catch (err) {
            console.error(err);
            alert('Ошибка при соединении');
        }
    };

    return (
        <div className="tree-settings-panel">
            <div className="tree-settings-header">
                <span className="tree-settings-title">Настройки {treeName}</span>
                <button className="close-button" onClick={onClose}>×</button>
            </div>

            <div className="tree-settings-content">
                <button className="settings-button rename" onClick={handleRename}>
                    Переименовать древо
                </button>
                <button className="settings-button delete" onClick={() => setShowConfirm(true)}>
                    Удалить древо
                </button>
            </div>

            {showConfirm && (
                <ConfirmDialog
                    text="Вы уверены, что хотите удалить это древо? Это действие необратимо."
                    onYes={handleDelete}
                    onNo={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
};

export default TreeSettings;
