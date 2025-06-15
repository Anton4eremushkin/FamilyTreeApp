import React, { useEffect, useState } from 'react';
import '../../css/app.profile-panel.css';

const ProfilePanel = ({ onClose, onOpen }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        onOpen?.();
        fetch('/user/profile')
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error('Ошибка при загрузке профиля:', err));
    }, []);

    if (!user) return null; // или можно спиннер тут

    return (
        <div className="profile-panel">
            <div className="profile-panel-header">
                <span className="profile-title">Профиль</span>
                <button className="close-button" onClick={onClose}>×</button>
            </div>

            <div className="profile-content">
                <img
                    src={`/storage/${user.url_img || 'default-user.png'}`}
                    alt="Аватар"
                    className="profile-avatar"
                    onError={(e) => {
                        e.target.onerror = null; // чтобы не зациклилось
                        e.target.src = '/storage/default-user.png';
                    }}
                />
                <div className="profile-name">{user.username}</div>

                <button className="profile-btn blue">Загрузить фото</button>
                <button className="profile-btn blue">Изменить имя</button>
                <button className="profile-btn blue">Изменить пароль</button>
                <button className="profile-btn red">Удалить аккаунт</button>
            </div>
        </div>
    );
};

export default ProfilePanel;
