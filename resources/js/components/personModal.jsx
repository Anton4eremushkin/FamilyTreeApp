import React, { useState, useEffect } from 'react';

const fieldBox = { marginBottom: 12, display: 'flex', flexDirection: 'column' };
const label = { fontSize: 12, color: '#656', marginBottom: 4 };
const input = {
    padding: '6px 8px',
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 14,
};

export default function PersonModal({ person, onClose, onSave }) {
    // локальное редактируемое состояние
    const [form, setForm] = useState({ ...person });
    const [showDeath, setShowDeath] = useState(person.status === 'deceased');

    // helper-функция для обновления полей
    const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    // при изменении статуса решаем, надо ли рендерить поля смерти
    useEffect(() => setShowDeath(form.status === 'deceased'), [form.status]);


    // основной рендер
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999,
            }}
            onClick={onClose} // клик по подложке закрывает
        >
            <div
                style={{
                    width: '66vw',
                    height: '66vh',
                    background: '#fff',
                    borderRadius: 16,
                    padding: 24,
                    overflowY: 'auto',
                    display: 'flex',
                    gap: 24,
                }}
                onClick={(e) => e.stopPropagation()} // не закрывать, если кликаем внутри
            >
                {/* ==== ЛЕВАЯ КОЛОНКА (1/3) ==== */}
                <div style={{flex: '0 0 33%'}}>
                    <img
                        src={`/storage/${form.url_img}`}
                        alt={form.full_name}
                        style={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            objectFit: 'cover',
                            borderRadius: 12,
                            marginBottom: 16,
                        }}
                    />

                    {/* Полное имя */}
                    <div style={fieldBox}>
                        <span style={label}>Полное имя</span>
                        <input
                            style={input}
                            value={form.full_name}
                            onChange={(e) => set('full_name', e.target.value)}
                        />
                    </div>

                    {/* Пол */}
                    <div style={fieldBox}>
                        <span style={label}>Пол</span>
                        <select
                            style={input}
                            value={form.gender}
                            onChange={(e) => set('gender', e.target.value)}
                        >
                            <option value="male">male</option>
                            <option value="female">female</option>
                            <option value="other">other</option>
                        </select>
                    </div>

                    {/* Дата рождения + “нет точной” */}
                    <div style={fieldBox}>
                        <span style={label}>Дата рождения</span>
                        {form.birth_date_text ? (
                            <input
                                style={input}
                                value={form.birth_date_text}
                                placeholder="Текстовая дата"
                                onChange={(e) => set('birth_date_text', e.target.value)}
                            />
                        ) : (
                            <input
                                type="date"
                                style={input}
                                value={form.birth_date || ''}
                                onChange={(e) => set('birth_date', e.target.value)}
                            />
                        )}
                        <button
                            style={{marginTop: 4, fontSize: 12, cursor: 'pointer'}}
                            onClick={() =>
                                set(
                                    form.birth_date_text ? 'birth_date_text' : 'birth_date',
                                    ''
                                )
                            }
                        >
                            {form.birth_date_text ? 'Ввести точную дату' : 'Нет точной даты'}
                        </button>
                    </div>

                    {/* Место рождения */}
                    <div style={fieldBox}>
                        <span style={label}>Место рождения</span>
                        <input
                            style={input}
                            value={form.birth_place || ''}
                            onChange={(e) => set('birth_place', e.target.value)}
                        />
                    </div>

                    {/* Статус */}
                    <div style={fieldBox}>
                        <span style={label}>Статус</span>
                        <select
                            style={input}
                            value={form.status}
                            onChange={(e) => set('status', e.target.value)}
                        >
                            <option value="living">living</option>
                            <option value="deceased">deceased</option>
                            <option value="unknown">unknown</option>
                        </select>
                    </div>

                    {/* Блок “смерть” появляется, если статус=deceased */}
                    {showDeath && (
                        <>
                            {/* Дата смерти */}
                            <div style={fieldBox}>
                                <span style={label}>Дата смерти</span>
                                {form.death_date_text ? (
                                    <input
                                        style={input}
                                        value={form.death_date_text}
                                        placeholder="Текстовая дата"
                                        onChange={(e) => set('death_date_text', e.target.value)}
                                    />
                                ) : (
                                    <input
                                        type="date"
                                        style={input}
                                        value={form.death_date || ''}
                                        onChange={(e) => set('death_date', e.target.value)}
                                    />
                                )}
                                <button
                                    style={{marginTop: 4, fontSize: 12, cursor: 'pointer'}}
                                    onClick={() =>
                                        set(
                                            form.death_date_text ? 'death_date_text' : 'death_date',
                                            ''
                                        )
                                    }
                                >
                                    {form.death_date_text
                                        ? 'Ввести точную дату'
                                        : 'Нет точной даты'}
                                </button>
                            </div>

                            {/* Место смерти */}
                            <div style={fieldBox}>
                                <span style={label}>Место смерти</span>
                                <input
                                    style={input}
                                    value={form.death_place || ''}
                                    onChange={(e) => set('death_place', e.target.value)}
                                />
                            </div>
                        </>
                    )}
                    <div style={{height: 14}}/>  {/* Отступ в конце, чтобы последнее поле с низом не сливалось */}
                </div>

                {/* ==== ПРАВАЯ ЧАСТЬ (2/3) ==== */}
                <div style={{ flex: 1 /* пока пусто, будет заполнено позже */ }}>
                    <h3 style={{ marginTop: 0 }}>Доп. информация</h3>
                    <p style={{ color: '#666' }}>
                        Тут будет остальной контент (биография, заметки, связи и т.д.).
                    </p>
                </div>

                {/* ==== КНОПКИ СВЕРХУ СПРАВА ==== */}
                <div
                    style={{
                        position: 'absolute',
                        top: 16,
                        right: 24,
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
                        onClick={onClose}
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}
