import { useState, useEffect } from 'react';

const BLOCKS = ['marriage', 'education', 'job', 'health'];

export default function InfoBlocks({ selectedType, isReadOnly }) {
    const [form, setForm] = useState(null);

    const blank = (type) => {
        switch (type) {
            case 'marriage':
                return {
                    type,
                    person2_id: '',
                    premarital_surname2: '',
                    marriage_type: 'legal',
                    begin_date: '',
                    begin_date_text: '',
                    end_date: '',
                    end_date_text: '',
                    end_reason: '',
                    place: '',
                    description: '',
                };
            case 'education':
                return {
                    type,
                    education_type: '',
                    institution: '',
                    start_date: '',
                    start_date_text: '',
                    end_date: '',
                    end_date_text: '',
                    description: '',
                };
            case 'job':
                return {
                    type,
                    position: '',
                    place: '',
                    start_date: '',
                    start_date_text: '',
                    end_date: '',
                    end_date_text: '',
                    work_experience: '',
                    description: '',
                };
            case 'health':
            default:
                return {
                    type,
                    disease_name: '',
                    diagnosis_date: '',
                    diagnosis_date_text: '',
                    medical_organization: '',
                    doctor_fullname: '',
                    description: '',
                };
        }
    };

    useEffect(() => {
        if (selectedType) {
            setForm(blank(selectedType));
        } else {
            setForm(null);
        }
    }, [selectedType]);

    if (!form) return null;

    // ... ниже твой код отрисовки блока с формой, но вместо массива forms — один form и setForm для обновления
    // Нужно заменить все вызовы setForms и forms на setForm и form

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // Вот пример для 'marriage', остальное аналогично
    return (
        <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
            {form.type === 'marriage' && (
                <>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                        Тип брака*
                        <select
                            style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '6px 8px' }}
                            value={form.marriage_type}
                            onChange={(e) => updateField('marriage_type', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option value="legal">legal</option>
                            <option value="civil">civil</option>
                            <option value="cherch">cherch</option>
                        </select>
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                        Дата начала*
                        <input
                            style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '6px 8px' }}
                            type="date"
                            value={form.begin_date}
                            onChange={(e) => updateField('begin_date', e.target.value)}
                            disabled={isReadOnly}
                        />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                        Текстовая дата
                        <input
                            style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '6px 8px' }}
                            value={form.begin_date_text}
                            onChange={(e) => updateField('begin_date_text', e.target.value)}
                            disabled={isReadOnly}
                        />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                        Описание
                        <input
                            style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '6px 8px' }}
                            value={form.description}
                            onChange={(e) => updateField('description', e.target.value)}
                            disabled={isReadOnly}
                        />
                    </label>
                </>
            )}

            {/* Аналогично сделай для остальных типов: education, job, health */}

            {!isReadOnly && (
                <button
                    style={{
                        background: '#4caf50',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginTop: '16px',
                    }}
                    onClick={() => alert('Сохраняем блок — сделаешь потом')}
                >
                    Сохранить
                </button>
            )}
        </div>
    );
}
