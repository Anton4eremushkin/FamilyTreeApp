import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import '../../css/app.profile-panel.css';

const ProfilePanel = ({ onClose, onOpen }) => {
    const [user, setUser] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        onOpen?.();
        fetchUser();
    }, []);

    const fetchUser = () => {
        fetch('/user/profile')
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error('Ошибка при загрузке профиля:', err));
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
            setError(null);
            setPreview(URL.createObjectURL(acceptedFiles[0]));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'image/*': [] },
    });

    const uploadPhoto = async () => {
        if (!file) {
            setError('Выберите файл для загрузки');
            return;
        }
        setUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const resp = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            if (!resp.ok) {
                const errData = await resp.json();
                throw new Error(errData.error || 'Ошибка при загрузке изображения');
            }

            const { url } = await resp.json();

            // Обновляем фото профиля
            const updateResp = await fetch('/user/profile/update-photo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url_img: url }),
            });

            if (!updateResp.ok) {
                const errData = await updateResp.json();
                throw new Error(errData.error || 'Ошибка при обновлении фото профиля');
            }

            setPreview(null);
            setFile(null);
            setIsUploading(false);
            fetchUser();
        } catch (e) {
            setError(e.message);
        } finally {
            setUploading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="profile-panel">
            <div className="profile-panel-header">
                <span className="profile-title">Профиль</span>
                <button className="close-button" onClick={onClose}>×</button>
            </div>

            <div className="profile-content">
                {!isUploading ? (
                    <>
                        <img
                            src={`/storage/${user.url_img || 'default-user.png'}`}
                            alt="Аватар"
                            className="profile-avatar"
                            onError={e => {
                                e.target.onerror = null;
                                e.target.src = '/storage/default-user.png';
                            }}
                        />
                        <div className="profile-name">{user.username}</div>

                        <button className="profile-btn blue" onClick={() => setIsUploading(true)}>Загрузить фото</button>
                        <button className="profile-btn blue" onClick={() => setShowRename(true)}>Изменить имя</button>
                        <button className="profile-btn blue" onClick={() => setShowChangePassword(true)}>Изменить пароль</button>
                        <button className="profile-btn red" onClick={() => setShowDeleteConfirm(true)}>Удалить аккаунт</button>

                    </>
                ) : (
                    <>
                        <section
                            {...getRootProps({ className: `drag-drop-box ${isDragActive ? 'drag-active' : ''}` })}
                            style={{ marginBottom: '10px' }}
                        >
                            <input {...getInputProps()} />
                            {preview ? (
                                <img src={preview} alt="Preview" className="preview-image" />
                            ) : (
                                <p>{isDragActive ? 'Отпустите файл сюда' : 'Перетащите изображение сюда или кликните, чтобы выбрать'}</p>
                            )}
                        </section>

                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <button
                            className="profile-btn blue"
                            onClick={uploadPhoto}
                            disabled={uploading || !file}
                        >
                            {uploading ? 'Загрузка...' : 'Загрузить'}
                        </button>
                        <button
                            className="profile-btn red"
                            onClick={() => {
                                setIsUploading(false);
                                setFile(null);
                                setPreview(null);
                                setError(null);
                            }}
                            disabled={uploading}
                        >
                            Отмена
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePanel;
