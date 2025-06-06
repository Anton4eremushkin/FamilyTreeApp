import React, { useState, useEffect } from 'react';
import ConfirmDialog from './ConfirmDialog';
import '../../css/app.Modal.css';
import PersonModalRightCol from './PersonModalRightCol';

export default function PersonModal({ person, onClose, onSave, readOnly = false }) {
    const [form, setForm] = useState({ ...person });
    const [original] = useState({ ...person });
    const [showDeath, setShowDeath] = useState(person.status === 'deceased');
    const [confirm, setConfirm] = useState(false);

    const update = (key, value) => {
        if (readOnly) return;
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const toggleDateMode = (isBirth) => {
        if (readOnly) return;
        const dateKey = isBirth ? 'birth_date' : 'death_date';
        const textKey = isBirth ? 'birth_date_text' : 'death_date_text';
        setForm(prev =>
            prev[textKey] != null
                ? { ...prev, [textKey]: null }
                : { ...prev, [dateKey]: null, [textKey]: '' }
        );
    };

    useEffect(() => setShowDeath(form.status === 'deceased'), [form.status]);

    const isDirty =
        JSON.stringify(form, Object.keys(form).sort()) !==
        JSON.stringify(original, Object.keys(original).sort());

    const attemptClose = () => (isDirty && !readOnly ? setConfirm(true) : onClose());

    const [activeSection, setActiveSection] = useState(null);
    const [sectionData, setSectionData] = useState({
        marriage: [],
        education: [],
        job: [],
        health_record: [],
    });

    const [validationErrors, setValidationErrors] = useState({});

    const handleAddRecord = () => {
        if (!activeSection) return;
        const emptyRecord = {
            marriage: {
                person1_id: person.id,
                premarital_surname1: '',
                person2_id: '',
                premarital_surname2: '',
                type: 'legal',
                begin_date: '',
                begin_date_text: '',
                end_date: '',
                end_date_text: '',
                end_reason: '',
                place: '',
                description: ''
            },
            education: {
                person_id: person.id,
                education_type: '',
                institution: '',
                start_date: '',
                start_date_text: '',
                end_date: '',
                end_date_text: '',
                description: ''
            },
            job: {
                person_id: person.id,
                position: '',
                place: '',
                start_date: '',
                start_date_text: '',
                end_date: '',
                end_date_text: '',
                work_experience: '',
                description: ''
            },
            health_record: {
                person_id: person.id,
                disease_name: '',
                diagnosis_date: '',
                diagnosis_date_text: '',
                medical_organization: '',
                doctor_fullname: '',
                description: ''
            }
        }[activeSection];

        setSectionData(prev => ({
            ...prev,
            [activeSection]: [...prev[activeSection], emptyRecord]
        }));
    };

    const handleFieldChange = (section, index, field, value) => {
        const updated = [...sectionData[section]];
        updated[index][field] = value;
        setSectionData(prev => ({ ...prev, [section]: updated }));
    };

    const handleDelete = (section, index) => {
        const updated = [...sectionData[section]];
        updated.splice(index, 1);
        setSectionData(prev => ({ ...prev, [section]: updated }));
    };

    const validateRecord = (record, requiredFields) => {
        const errors = {};
        requiredFields.forEach(field => {
            if (!record[field] || record[field].toString().trim() === '') {
                errors[field] = 'Обязательное поле';
            }
        });
        return errors;
    };

    const handleSave = (section, index, requiredFields) => {
        const errors = validateRecord(sectionData[section][index], requiredFields);
        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) return;
        alert('Запись успешно сохранена (в реальности пока не сохраняется)');
    };

    return (
        <>
            <div className="person-modal-backdrop" onClick={attemptClose}>
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
                                    disabled={readOnly}
                                />
                            </div>

                            <div className="person-modal-field-box">
                                <span className="person-modal-label">Пол</span>
                                <select
                                    className="person-modal-input"
                                    value={form.gender}
                                    onChange={e => update('gender', e.target.value)}
                                    disabled={readOnly}
                                >
                                    <option value="Мужской">male</option>
                                    <option value="Женский">female</option>
                                    <option value="Неизвестен">other</option>
                                </select>
                            </div>

                            <div className="person-modal-field-box">
                                <span className="person-modal-label">Дата рождения</span>
                                {form.birth_date_text != null ? (
                                    <input
                                        className="person-modal-input"
                                        value={form.birth_date_text}
                                        onChange={e => update('birth_date_text', e.target.value)}
                                        disabled={readOnly}
                                        placeholder="Текстовая дата"
                                    />
                                ) : (
                                    <input
                                        type="date"
                                        className="person-modal-input"
                                        value={form.birth_date || ''}
                                        onChange={e => update('birth_date', e.target.value)}
                                        disabled={readOnly}
                                    />
                                )}
                                {!readOnly && (
                                    <button
                                        type="button"
                                        className="person-modal-text-button"
                                        onClick={() => toggleDateMode(true)}
                                    >
                                        {form.birth_date_text != null ? 'Ввести точную дату' : 'Нет точной даты'}
                                    </button>
                                )}
                            </div>

                            <div className="person-modal-field-box">
                                <span className="person-modal-label">Место рождения</span>
                                <input
                                    className="person-modal-input"
                                    value={form.birth_place || ''}
                                    onChange={e => update('birth_place', e.target.value)}
                                    disabled={readOnly}
                                />
                            </div>

                            <div className="person-modal-field-box">
                                <span className="person-modal-label">Статус</span>
                                <select
                                    className="person-modal-input"
                                    value={form.status}
                                    onChange={e => update('status', e.target.value)}
                                    disabled={readOnly}
                                >
                                    <option value="Живущий">living</option>
                                    <option value="Покойный">deceased</option>
                                    <option value="Неизвестно">unknown</option>
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
                                                disabled={readOnly}
                                                placeholder="Текстовая дата"
                                            />
                                        ) : (
                                            <input
                                                type="date"
                                                className="person-modal-input"
                                                value={form.death_date || ''}
                                                onChange={e => update('death_date', e.target.value)}
                                                disabled={readOnly}
                                            />
                                        )}
                                        {!readOnly && (
                                            <button
                                                type="button"
                                                className="person-modal-text-button"
                                                onClick={() => toggleDateMode(false)}
                                            >
                                                {form.death_date_text != null ? 'Ввести точную дату' : 'Нет точной даты'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="person-modal-field-box">
                                        <span className="person-modal-label">Место смерти</span>
                                        <input
                                            className="person-modal-input"
                                            value={form.death_place || ''}
                                            onChange={e => update('death_place', e.target.value)}
                                            disabled={readOnly}
                                        />
                                    </div>
                                </>
                            )}
                            <div style={{ height: 14 }} />
                        </div>

                        {/* Правая колонка */}
                        <PersonModalRightCol
                            person={person}
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                            sectionData={sectionData}
                            setSectionData={setSectionData}
                            validationErrors={validationErrors}
                            handleAddRecord={handleAddRecord}
                            handleFieldChange={handleFieldChange}
                            handleDelete={handleDelete}
                            handleSave={handleSave} />


                    </div>
                </div>
            </div>

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

            {confirm && (
                <ConfirmDialog
                    onConfirm={() => {
                        setConfirm(false);
                        onClose();
                    }}
                    onCancel={() => setConfirm(false)}
                />
            )}
        </>
    );
}
