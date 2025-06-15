import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmDialog from './ConfirmDialog';
import '../../css/app.Modal.css';
import '../../css/app.eventEditor.css';          // <-- новый стиль для поля событий

export default function PersonEvent({
                                        person,
                                        onClose,
                                        onSave,           // пока не нужен, но пусть остаётся
                                        onDelete,         // не нужен в этом окне – можно удалить, если хочешь
                                        familyTreeId,
                                        readOnly = false
                                    }) {
    /* ---------- базовые поля (левая колонка) ---------- */
    const [form]        = useState({ ...person });
    const [showDeath]   = useState(person.status === 'deceased'); // нам уже не нужно менять статус
    const [confirm, setConfirm] = useState(false);

    const attemptClose = () => (confirm ? setConfirm(true) : onClose());

    /* ---------- состояние событий (правая колонка) ---------- */
    const [events, setEvents]               = useState([]);
    const [selectedId, setSelectedId]       = useState(null);   // id выбранного события
    const [text, setText]                   = useState('');     // текст в textarea
    const [isLoading, setIsLoading]         = useState(true);

    /* —–––  helpers –––– */
    const Url = `/person/${person.id}/events`;

    const loadEvents = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(Url);
            setEvents(data);
            if (data.length) {
                setSelectedId(data[0].id);
                setText(data[0].description);
            }
        } catch (e) {
            console.error('Не удалось получить события', e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = id => {
        setSelectedId(id);
        const ev = events.find(e => e.id === id);
        setText(ev?.description || '');
    };

    const handleSave = async () => {
        if (!selectedId) return;
        try {
            await axios.put(`${Url}/${selectedId}`, { description: text });
            await loadEvents(); // перезагружаем список
        } catch (e) {
            console.error('Ошибка сохранения', e);
        }
    };

    const handleCreate = async () => {
        const title = prompt('Название события:');
        if (!title) return;
        try {
            await axios.post(Url, { title, description: '' });
            await loadEvents();
        } catch (e) {
            console.error('Ошибка создания', e);
        }
    };

    useEffect(() => { loadEvents(); }, []);


    return (
        <>
            <div className="person-modal-backdrop-no-back" onClick={attemptClose}>
                <div className="person-modal-window" onClick={e => e.stopPropagation()}>
                    <div className="person-modal-content-wrapper">
                        {/* Левая колонка */}
                        <div className="person-modal-left-col">
                            <img
                                src={`/storage/${form.url_img}`}
                                alt={form.full_name}
                                className="person-modal-img"
                            />

                            <div className="person-modal-field-box">
                                <span className="person-modal-label">Полное имя</span>
                                <input
                                    className="person-modal-input"
                                    value={form.full_name}
                                    onChange={e => update('full_name', e.target.value)}
                                    disabled={true}
                                />
                            </div>

                            <div className="person-modal-field-box">
                                <span className="person-modal-label">Пол</span>
                                <select
                                    className="person-modal-input"
                                    value={form.gender}
                                    onChange={e => update('gender', e.target.value)}
                                    disabled={true}
                                >
                                    <option value="male">Мужской</option>
                                    <option value="female">Женский</option>
                                    <option value="other">Неизвестен</option>
                                </select>
                            </div>

                            <div className="person-modal-field-box">
                                <span className="person-modal-label">Дата рождения</span>
                                {form.birth_date_text != null ? (
                                    <input
                                        className="person-modal-input"
                                        value={form.birth_date_text}
                                        onChange={e => update('birth_date_text', e.target.value)}
                                        disabled={true}
                                        placeholder="Текстовая дата"
                                    />
                                ) : (
                                    <input
                                        type="date"
                                        className="person-modal-input"
                                        value={form.birth_date || ''}
                                        onChange={e => update('birth_date', e.target.value)}
                                        disabled={true}
                                    />
                                )}

                            </div>

                            <div className="person-modal-field-box">
                                <span className="person-modal-label">Место рождения</span>
                                <input
                                    className="person-modal-input"
                                    value={form.birth_place || ''}
                                    onChange={e => update('birth_place', e.target.value)}
                                    disabled={true}
                                />
                            </div>

                            <div className="person-modal-field-box">
                                <span className="person-modal-label">Статус</span>
                                <select
                                    className="person-modal-input"
                                    value={form.status}
                                    onChange={e => update('status', e.target.value)}
                                    disabled={true}
                                >
                                    <option value="living">Живущий</option>
                                    <option value="deceased">Покойный</option>
                                    <option value="unknown">Неизвестно</option>
                                </select>
                            </div>

                            {showDeath && (
                                <>
                                    <div className="person-modal-field-box">
                                        <span className="person-modal-label">Дата смерти</span>
                                        {form.death_date_text != null ? (
                                            <input
                                                className="person-modal-input"
                                                value={form.death_date_text}
                                                onChange={e => update('death_date_text', e.target.value)}
                                                disabled={true}
                                                placeholder="Текстовая дата"
                                            />
                                        ) : (
                                            <input
                                                type="date"
                                                className="person-modal-input"
                                                value={form.death_date || ''}
                                                onChange={e => update('death_date', e.target.value)}
                                                disabled={true}
                                            />
                                        )}
                                    </div>

                                    <div className="person-modal-field-box">
                                        <span className="person-modal-label">Место смерти</span>
                                        <input
                                            className="person-modal-input"
                                            value={form.death_place || ''}
                                            onChange={e => update('death_place', e.target.value)}
                                            disabled={true}
                                        />
                                    </div>
                                </>
                            )}
                            <div style={{ height: 14 }} />
                        </div>

                        {/* ПРАВАЯ КОЛОНКА  */}
                        <div className="person-modal-right-col">

                            {/* верхняя панель */}
                            <div className="event-editor-header">
                                <select
                                    className="event-selector"
                                    disabled={isLoading || events.length === 0}
                                    value={selectedId || ''}
                                    onChange={e => handleSelect(Number(e.target.value))}
                                >
                                    {events.map(ev => (
                                        <option key={ev.id} value={ev.id}>
                                            {ev.title}
                                        </option>
                                    ))}
                                    {events.length === 0 && <option>Нет событий</option>}
                                </select>
                                <div>
                                    <button
                                        type="button"
                                        className="event-add-btn"
                                        onClick={handleCreate}
                                        disabled={readOnly}
                                        style={{ marginRight: '8px' }}
                                    >
                                        + Добавить новое
                                    </button>
                                    <button
                                        type="button"
                                        className="event-add-btn"
                                        onClick={attemptClose}
                                    >
                                        Вернуться назад
                                    </button>
                                </div>
                            </div>

                            {/* текстовое поле */}
                            <textarea
                                className="event-editor-textarea"
                                placeholder="Описание события…"
                                value={text}
                                onChange={e => setText(e.target.value)}
                                disabled={readOnly || !selectedId}
                            />

                            {/* сохранить (только если не readOnly) */}
                            {!readOnly && (
                                <button
                                    className="event-save-btn"
                                    onClick={handleSave}
                                    disabled={!selectedId}
                                >
                                    Сохранить описание
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <>
                {/* кнопки Сохранить и Закрыть */}
                <div className="person-modal-global-buttons">
                    {!readOnly && (
                        <button
                            type="button"
                            className="person-modal-save-button"
                            onClick={() => onSave(form)}
                        >
                            Сохранить
                        </button>
                    )}
                    <button
                        type="button"
                        className="person-modal-close-button"
                        onClick={attemptClose}
                    >
                        Закрыть
                    </button>
                </div>

                {/* кнопка удаления */}
                {!readOnly && (
                    <div className="person-modal-delete-button-wrapper">
                        <button
                            type="button"
                            className="person-modal-delete-person-button"
                            onClick={() => {
                                onDelete(person.id);
                            }}
                        >
                            Удалить персону
                        </button>
                    </div>
                )}

                {confirm && (
                    <ConfirmDialog
                        text="У вас есть несохранённые изменения. Вы уверены, что хотите закрыть?"
                        onYes={() => {
                            setConfirm(false);
                            onClose();
                        }}
                        onNo={() => setConfirm(false)}
                    />
                )}
            </>
        </>
    );
}
