import React, { useState, useEffect } from 'react';
import ConfirmDialog from './ConfirmDialog';

const fieldBox = { marginBottom: 12, display: 'flex', flexDirection: 'column' };
const label    = { fontSize: 12, color: '#656', marginBottom: 4 };
const input    = {
    padding: '6px 8px',
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 14,
};

export default function PersonModal({ person, onClose, onSave }) {
    /* ---------------- state ---------------- */
    const [form, setForm]       = useState({ ...person });
    const [original]            = useState({ ...person });
    const [showDeath, setShowDeath] = useState(person.status === 'deceased');
    const [confirm, setConfirm] = useState(false);

    /* ---------------- helpers ---------------- */
    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    // переключатель «точная ↔ текстовая» дат рождения / смерти
    const toggleDateMode = (isBirth) => {
        const dateKey = isBirth ? 'birth_date' : 'death_date';
        const textKey = isBirth ? 'birth_date_text' : 'death_date_text';

        setForm(prev => (
            prev[textKey] != null                               // сейчас текстовый режим?
                ? { ...prev, [textKey]: null }                   // → вернуть дату
                : { ...prev, [dateKey]: null, [textKey]: '' }    // → включить текст
        ));
    };

    /* следим за сменой статуса */
    useEffect(() => setShowDeath(form.status === 'deceased'), [form.status]);

    /* dirty-флаг */
    const isDirty =
        JSON.stringify(form, Object.keys(form).sort()) !==
        JSON.stringify(original, Object.keys(original).sort());

    /* попытка закрытия */
    const attemptClose = () => (isDirty ? setConfirm(true) : onClose());

    /* ---------------- render ---------------- */
    return (
        <>
            {/* затемнённая подложка */}
            <div
                style={{
                    position: 'fixed', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 999,
                }}
                onClick={attemptClose}
            >
                {/* белое окно */}
                <div
                    style={{
                        width: '66vw', height: '66vh',
                        background: '#fff', borderRadius: 16, padding: 24,
                        overflowY: 'auto', display: 'flex', gap: 24,
                        position: 'relative',
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* ---------- левая колонка ---------- */}
                    <div style={{ flex: '0 0 33%' }}>
                        <img
                            src={`/storage/${form.url_img}`}
                            alt={form.full_name}
                            style={{
                                width: '100%', aspectRatio: '1/1', objectFit: 'cover',
                                borderRadius: 12, marginBottom: 16,
                            }}
                        />

                        {/* ФИО */}
                        <div style={fieldBox}>
                            <span style={label}>Полное имя</span>
                            <input
                                style={input}
                                value={form.full_name}
                                onChange={e => update('full_name', e.target.value)}
                            />
                        </div>

                        {/* Пол */}
                        <div style={fieldBox}>
                            <span style={label}>Пол</span>
                            <select
                                style={input}
                                value={form.gender}
                                onChange={e => update('gender', e.target.value)}
                            >
                                <option value="male">male</option>
                                <option value="female">female</option>
                                <option value="other">other</option>
                            </select>
                        </div>

                        {/* Дата рождения */}
                        <div style={fieldBox}>
                            <span style={label}>Дата рождения</span>
                            {form.birth_date_text != null ? (
                                <input
                                    style={input}
                                    value={form.birth_date_text}
                                    onChange={e => update('birth_date_text', e.target.value)}
                                    placeholder="Текстовая дата"
                                />
                            ) : (
                                <input
                                    type="date"
                                    style={input}
                                    value={form.birth_date || ''}
                                    onChange={e => update('birth_date', e.target.value)}
                                />
                            )}
                            <button
                                type="button"
                                style={{ marginTop: 4, fontSize: 12, cursor: 'pointer' }}
                                onClick={() => toggleDateMode(true)}
                            >
                                {form.birth_date_text != null ? 'Ввести точную дату' : 'Нет точной даты'}
                            </button>
                        </div>

                        {/* Место рождения */}
                        <div style={fieldBox}>
                            <span style={label}>Место рождения</span>
                            <input
                                style={input}
                                value={form.birth_place || ''}
                                onChange={e => update('birth_place', e.target.value)}
                            />
                        </div>

                        {/* Статус */}
                        <div style={fieldBox}>
                            <span style={label}>Статус</span>
                            <select
                                style={input}
                                value={form.status}
                                onChange={e => update('status', e.target.value)}
                            >
                                <option value="living">living</option>
                                <option value="deceased">deceased</option>
                                <option value="unknown">unknown</option>
                            </select>
                        </div>

                        {/* Блок смерти (если deceased) */}
                        {showDeath && (
                            <>
                                {/* Дата смерти */}
                                <div style={fieldBox}>
                                    <span style={label}>Дата смерти</span>
                                    {form.death_date_text != null ? (
                                        <input
                                            style={input}
                                            value={form.death_date_text}
                                            onChange={e => update('death_date_text', e.target.value)}
                                            placeholder="Текстовая дата"
                                        />
                                    ) : (
                                        <input
                                            type="date"
                                            style={input}
                                            value={form.death_date || ''}
                                            onChange={e => update('death_date', e.target.value)}
                                        />
                                    )}
                                    <button
                                        type="button"
                                        style={{ marginTop: 4, fontSize: 12, cursor: 'pointer' }}
                                        onClick={() => toggleDateMode(false)}
                                    >
                                        {form.death_date_text != null ? 'Ввести точную дату' : 'Нет точной даты'}
                                    </button>
                                </div>

                                {/* Место смерти */}
                                <div style={fieldBox}>
                                    <span style={label}>Место смерти</span>
                                    <input
                                        style={input}
                                        value={form.death_place || ''}
                                        onChange={e => update('death_place', e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <div style={{ height: 14 }} /> {/* нижний отступ */}
                    </div>

                    {/* ---------- правая колонка ---------- */}
                    <div style={{ flex: 1 }}>
                        <h3 style={{ marginTop: 0 }}>Доп. информация</h3>
                        <p style={{ color: '#666' }}>
                            Тут будет остальной контент (биография, заметки, связи и&nbsp;т.д.).
                        </p>
                    </div>
                </div>
            </div>

            {/* ---------- глобальные кнопки ---------- */}
            <div
                style={{
                    position: 'fixed',
                    top: 16,
                    right: 24,
                    zIndex: 1000,
                    display: 'flex',
                    gap: 12,
                }}
            >
                <button
                    style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        border: 'none',
                        background: '#4caf50',
                        color: '#fff',
                        cursor: 'pointer',
                    }}
                    onClick={() => onSave?.(form)}
                >
                    Сохранить
                </button>
                <button
                    style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        border: 'none',
                        background: '#f44336',
                        color: '#fff',
                        cursor: 'pointer',
                    }}
                    onClick={attemptClose}
                >
                    Закрыть
                </button>
            </div>

            {/* ---------- confirm dialog ---------- */}
            {confirm && (
                <ConfirmDialog
                    text="Несохранённые изменения будут потеряны. Закрыть?"
                    onYes={() => {
                        setConfirm(false);
                        onClose();
                    }}
                    onNo={() => setConfirm(false)}
                />
            )}
        </>
    );
}
