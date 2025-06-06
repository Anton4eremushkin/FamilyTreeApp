import React, { useState } from 'react';
import '../../css/app.personModal.css';

export default function PersonModalRightCol({ readOnly }) {
    const [activeCategory, setActiveCategory] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const categories = [
        { key: 'marriage', label: 'Брак' },
        { key: 'education', label: 'Образование' },
        { key: 'job', label: 'Трудовая деятельность' },
        { key: 'health_record', label: 'Медицинские записи' },
    ];

    const notNullFields = {
        marriage: ['person1_id', 'person2_id', 'type', 'begin_date'],
        education: ['education_type', 'institution'],
        job: ['position'],
        health_record: ['disease_name'],
    };

    const handleCategoryClick = (key) => {
        if (readOnly) return;
        setActiveCategory(key);
        setFormData(emptyData[key]);
        setErrors({});
    };

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        const required = notNullFields[activeCategory] || [];
        let newErrors = {};
        required.forEach((field) => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                newErrors[field] = 'Обязательное поле';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        alert('Данные сохранены (здесь будет логика сохранения)');
        setActiveCategory(null);
    };

    const handleDelete = () => {
        if (window.confirm('Удалить запись?')) {
            alert('Удалено (здесь будет логика удаления)');
            setActiveCategory(null);
        }
    };

    if (readOnly) {
        return null;
    }

    return (
        <div className="person-modal-right-col">
            <div className="person-modal-header">
                <h3>Добавить информацию:</h3>
                <button
                    type="button"
                    className="person-modal-add-button"
                    onClick={() => alert('Добавить новую запись')}
                    title="Добавить карточку родственника"
                >
                    +
                </button>
            </div>

            <div className="person-modal-category-buttons">
                {categories.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        className={`person-modal-category-button ${
                            activeCategory === key ? 'active' : ''
                        }`}
                        onClick={() => handleCategoryClick(key)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {activeCategory && (
                <div className="person-modal-info-block">
                    {/* Форма для каждой категории */}
                    {activeCategory === 'marriage' && (
                        <>
                            <label>
                                Person1 ID*:
                                <input
                                    type="number"
                                    value={formData.person1_id}
                                    onChange={(e) => updateField('person1_id', e.target.value)}
                                />
                                {errors.person1_id && <span className="error">{errors.person1_id}</span>}
                            </label>
                            <label>
                                Premarital Surname 1:
                                <input
                                    type="text"
                                    value={formData.premarital_surname1}
                                    onChange={(e) => updateField('premarital_surname1', e.target.value)}
                                />
                            </label>
                            <label>
                                Person2 ID*:
                                <input
                                    type="number"
                                    value={formData.person2_id}
                                    onChange={(e) => updateField('person2_id', e.target.value)}
                                />
                                {errors.person2_id && <span className="error">{errors.person2_id}</span>}
                            </label>
                            <label>
                                Premarital Surname 2:
                                <input
                                    type="text"
                                    value={formData.premarital_surname2}
                                    onChange={(e) => updateField('premarital_surname2', e.target.value)}
                                />
                            </label>
                            <label>
                                Тип*:
                                <select
                                    value={formData.type}
                                    onChange={(e) => updateField('type', e.target.value)}
                                >
                                    <option value="legal">legal</option>
                                    <option value="civil">civil</option>
                                    <option value="cherch">cherch</option>
                                </select>
                                {errors.type && <span className="error">{errors.type}</span>}
                            </label>
                            <label>
                                Начало*:
                                <input
                                    type="date"
                                    value={formData.begin_date}
                                    onChange={(e) => updateField('begin_date', e.target.value)}
                                />
                                {errors.begin_date && <span className="error">{errors.begin_date}</span>}
                            </label>
                            <label>
                                Начало (текст):
                                <input
                                    type="text"
                                    value={formData.begin_date_text}
                                    onChange={(e) => updateField('begin_date_text', e.target.value)}
                                />
                            </label>
                            <label>
                                Конец:
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => updateField('end_date', e.target.value)}
                                />
                            </label>
                            <label>
                                Конец (текст):
                                <input
                                    type="text"
                                    value={formData.end_date_text}
                                    onChange={(e) => updateField('end_date_text', e.target.value)}
                                />
                            </label>
                            <label>
                                Причина окончания:
                                <select
                                    value={formData.end_reason}
                                    onChange={(e) => updateField('end_reason', e.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="divorce">divorce</option>
                                    <option value="death">death</option>
                                    <option value="annulment">annulment</option>
                                </select>
                            </label>
                            <label>
                                Место:
                                <input
                                    type="text"
                                    value={formData.place}
                                    onChange={(e) => updateField('place', e.target.value)}
                                />
                            </label>
                            <label>
                                Описание:
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                />
                            </label>
                        </>
                    )}

                    {activeCategory === 'education' && (
                        <>
                            <label>
                                Тип образования*:
                                <input
                                    type="text"
                                    value={formData.education_type}
                                    onChange={(e) => updateField('education_type', e.target.value)}
                                />
                                {errors.education_type && <span className="error">{errors.education_type}</span>}
                            </label>
                            <label>
                                Учебное заведение*:
                                <input
                                    type="text"
                                    value={formData.institution}
                                    onChange={(e) => updateField('institution', e.target.value)}
                                />
                                {errors.institution && <span className="error">{errors.institution}</span>}
                            </label>
                            <label>
                                Дата начала:
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => updateField('start_date', e.target.value)}
                                />
                            </label>
                            <label>
                                Дата начала (текст):
                                <input
                                    type="text"
                                    value={formData.start_date_text}
                                    onChange={(e) => updateField('start_date_text', e.target.value)}
                                />
                            </label>
                            <label>
                                Дата окончания:
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => updateField('end_date', e.target.value)}
                                />
                            </label>
                            <label>
                                Дата окончания (текст):
                                <input
                                    type="text"
                                    value={formData.end_date_text}
                                    onChange={(e) => updateField('end_date_text', e.target.value)}
                                />
                            </label>
                            <label>
                                Описание:
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                />
                            </label>
                        </>
                    )}

                    {activeCategory === 'job' && (
                        <>
                            <label>
                                Должность*:
                                <input
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => updateField('position', e.target.value)}
                                />
                                {errors.position && <span className="error">{errors.position}</span>}
                            </label>
                            <label>
                                Место работы:
                                <input
                                    type="text"
                                    value={formData.place}
                                    onChange={(e) => updateField('place', e.target.value)}
                                />
                            </label>
                            <label>
                                Дата начала:
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => updateField('start_date', e.target.value)}
                                />
                            </label>
                            <label>
                                Дата начала (текст):
                                <input
                                    type="text"
                                    value={formData.start_date_text}
                                    onChange={(e) => updateField('start_date_text', e.target.value)}
                                />
                            </label>
                            <label>
                                Дата окончания:
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => updateField('end_date', e.target.value)}
                                />
                            </label>
                            <label>
                                Дата окончания (текст):
                                <input
                                    type="text"
                                    value={formData.end_date_text}
                                    onChange={(e) => updateField('end_date_text', e.target.value)}
                                />
                            </label>
                            <label>
                                Стаж работы (в годах):
                                <input
                                    type="text"
                                    value={formData.work_experience}
                                    onChange={(e) => updateField('work_experience', e.target.value)}
                                />
                            </label>
                            <label>
                                Описание:
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                />
                            </label>
                        </>
                    )}

                    {activeCategory === 'health_record' && (
                        <>
                            <label>
                                Название болезни*:
                                <input
                                    type="text"
                                    value={formData.disease_name}
                                    onChange={(e) => updateField('disease_name', e.target.value)}
                                />
                                {errors.disease_name && <span className="error">{errors.disease_name}</span>}
                            </label>
                            <label>
                                Дата диагноза:
                                <input
                                    type="date"
                                    value={formData.diagnosis_date}
                                    onChange={(e) => updateField('diagnosis_date', e.target.value)}
                                />
                            </label>
                            <label>
                                Дата диагноза (текст):
                                <input
                                    type="text"
                                    value={formData.diagnosis_date_text}
                                    onChange={(e) => updateField('diagnosis_date_text', e.target.value)}
                                />
                            </label>
                            <label>
                                Медицинская организация:
                                <input
                                    type="text"
                                    value={formData.medical_organization}
                                    onChange={(e) => updateField('medical_organization', e.target.value)}
                                />
                            </label>
                            <label>
                                ФИО врача:
                                <input
                                    type="text"
                                    value={formData.doctor_fullname}
                                    onChange={(e) => updateField('doctor_fullname', e.target.value)}
                                />
                            </label>
                            <label>
                                Описание:
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                />
                            </label>
                        </>
                    )}

                    <div className="person-modal-info-block-buttons">
                        <button
                            type="button"
                            className="person-modal-save-button"
                            onClick={handleSave}
                        >
                            Сохранить
                        </button>
                        <button
                            type="button"
                            className="person-modal-delete-button"
                            onClick={handleDelete}
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
