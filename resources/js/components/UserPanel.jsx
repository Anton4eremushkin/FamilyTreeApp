import React, { useEffect, useState } from 'react';
import '../../css/app.profile-panel.css';

const ProfilePanel = ({ onClose, onOpen }) => {
    const [user, setUser] = useState(null);

    // Для модалок
    const [showRename, setShowRename] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Временные поля
    const [newUsername, setNewUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [deletePassword, setDeletePassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        onOpen?.();
        fetch('/user/profile')
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
                setNewUsername(data.username);
            })
            .catch((err) => console.error('Ошибка при загрузке профиля:', err));
    }, []);

    if (!user) return null;

    // Хэндлеры кнопок

    const handleRename = async () => {
        if (!newUsername.trim()) {
            setError('Имя не может быть пустым');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/user/profile/rename', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUsername }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Ошибка при изменении имени');
            }
            setUser((u) => ({ ...u, username: newUsername }));
            setShowRename(false);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('Заполните все поля');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Новые пароли не совпадают');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/user/profile/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Ошибка при изменении пароля');
            }
            setShowChangePassword(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            setError('Введите пароль для подтверждения удаления');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/user/profile/delete-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: deletePassword }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Ошибка при удалении аккаунта');
            }
            // Логично после удаления редиректить куда-то (выйти с сайта)
            window.location.href = '/logout';
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-panel">
            <div className="profile-panel-header">
                <span className="profile-title">Профиль</span>
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
            </div>

            <div className="profile-content">
                <img
                    src={`/storage/${user.url_img || 'default-user.png'}`}
                    alt="Аватар"
                    className="profile-avatar"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/storage/default-user.png';
                    }}
                />
                <div className="profile-name">{user.username}</div>

                {/* Кнопки */}
                <button className="profile-btn blue" onClick={() => setShowRename(true)}>
                    Изменить имя
                </button>
                <button className="profile-btn blue" onClick={() => setShowChangePassword(true)}>
                    Изменить пароль
                </button>
                <button className="profile-btn red" onClick={() => setShowDeleteConfirm(true)}>
                    Удалить аккаунт
                </button>
            </div>

            {/* Модалки */}

            {/* Изменение имени */}
            {showRename && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Изменить имя</h3>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            disabled={loading}
                        />
                        {error && <p className="error">{error}</p>}
                        <div className="modal-buttons">
                            <button onClick={() => setShowRename(false)} disabled={loading}>
                                Отмена
                            </button>
                            <button onClick={handleRename} disabled={loading}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Изменение пароля */}
            {showChangePassword && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Изменить пароль</h3>
                        <input
                            type="password"
                            placeholder="Текущий пароль"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            disabled={loading}
                        />
                        <input
                            type="password"
                            placeholder="Новый пароль"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={loading}
                        />
                        <input
                            type="password"
                            placeholder="Повторите новый пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                        {error && <p className="error">{error}</p>}
                        <div className="modal-buttons">
                            <button onClick={() => setShowChangePassword(false)} disabled={loading}>
                                Отмена
                            </button>
                            <button onClick={handleChangePassword} disabled={loading}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Подтверждение удаления */}
            {showDeleteConfirm && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Удалить аккаунт</h3>
                        <p>Введите пароль для подтверждения удаления аккаунта</p>
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            disabled={loading}
                        />
                        {error && <p className="error">{error}</p>}
                        <div className="modal-buttons">
                            <button onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
                                Отмена
                            </button>
                            <button onClick={handleDeleteAccount} disabled={loading} className="red">
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePanel;
