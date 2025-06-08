import React, {useState, useEffect} from 'react';
import '../../css/app.Modal.css';
import AddPersonModal from "./AddPersonModal.jsx";
import AddRelationModal from "./AddRelationModal.jsx";

export default function PersonModalRightCol({readOnly, person, familyTreeId, updateGraphData}) {
    const [activeCategory, setActiveCategory] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddRelationOpen, setIsAddRelationOpen] = useState(false);
    const [allPersons, setAllPersons] = useState([]);
    const userRole = window.userRole;
    const isReadOnly = ['guest', 'user'].includes(userRole);


    const categories = [
        {key: 'marriage', label: 'Брак'},
        {key: 'education', label: 'Образование'},
        {key: 'job', label: 'Трудовая деятельность'},
        {key: 'health_record', label: 'Медицинские записи'},
    ];

    const notNullFields = {
        marriage: ['person1_id', 'person2_id', 'type', 'begin_date'],
        education: ['education_type', 'institution'],
        job: ['position'],
        health_record: ['disease_name'],
    };

    const handleCategoryClick = (key) => {
        setActiveCategory(key);
        setErrors({});
        setFormData(emptyDataByCategory[key] || {});
    };

    const updateField = (field, value) => {
        setFormData((prev) => ({...prev, [field]: value}));
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

    const emptyDataByCategory = {
        marriage: {
            person1_id: person.id,
        },
        education: {
            person_id: person.id,
            education_type: '',
            institution: '',
            start_date: '',
            start_date_text: '',
            end_date: '',
            end_date_text: '',
            description: '',
            id: null,
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
            description: '',
            id: null,
        },
        health_record: {
            person_id: person.id,
            disease_name: '',
            diagnosis_date: '',
            diagnosis_date_text: '',
            medical_organization: '',
            doctor_fullname: '',
            description: '',
            id: null,
        },
    };

    useEffect(() => {
        if (!familyTreeId) return;

        (async () => {
            try {
                const resp = await fetch(`/person/family/${familyTreeId}`);
                if (!resp.ok) throw new Error('Ошибка при загрузке списка персон');
                const data = await resp.json();
                setAllPersons(data);
            } catch (err) {
                console.error(err);
            }
        })();
    }, [familyTreeId]);

    useEffect(() => {
        if (person && person.id) {
            setFormData((prev) => ({
                ...prev,
                person1_id: person.id,
            }));
        }
    }, [person]);

    /* ------------ MARRIAGE --------------- */
    useEffect(() => {
        async function fetchMarriage() {
            if (!formData.person1_id) return;

            try {
                const response = await fetch(`/person/${formData.person1_id}/marriage`);
                if (!response.ok) throw new Error('Ошибка сети');
                const data = await response.json();
                if (data && data.length > 0) {
                    const marriageData = data[0];
                    setFormData((prev) => ({
                        ...prev,
                        id: marriageData.id,
                        person1_id: marriageData.person1_id,
                        premarital_surname1: marriageData.premarital_surname1 || '',
                        person2_id: marriageData.person2_id,
                        premarital_surname2: marriageData.premarital_surname2 || '',
                        type: marriageData.type || '',
                        begin_date: marriageData.begin_date || '',
                        begin_date_text: marriageData.begin_date_text || '',
                        end_date: marriageData.end_date || '',
                        end_date_text: marriageData.end_date_text || '',
                        end_reason: marriageData.end_reason || '',
                        place: marriageData.place || '',
                        description: marriageData.description || '',
                    }));
                }
            } catch (e) {
                console.error('Ошибка при загрузке брака:', e);
            }
        }

        fetchMarriage();
    }, [formData.person1_id]);

    /* ------------ EDUCATION --------------- */
    useEffect(() => {
        if (activeCategory !== 'education') return;

        async function fetchEducation(personId) {
            if (!personId) return;

            try {
                const res = await fetch(`/person/${personId}/education`);
                if (!res.ok) throw new Error('Ошибка сети');
                const data = await res.json();

                if (data && data.length > 0) {
                    const edu = data[0];          // первая запись
                    setFormData(prev => ({
                        ...prev,
                        id: edu.id,
                        person_id: edu.person_id,
                        education_type: edu.education_type || '',
                        institution: edu.institution || '',
                        start_date: edu.start_date || '',
                        start_date_text: edu.start_date_text || '',
                        end_date: edu.end_date || '',
                        end_date_text: edu.end_date_text || '',
                        description: edu.description || '',
                    }));
                } else {
                    // нет записей — оставляем форму пустой (id = null)
                    setFormData(emptyDataByCategory.education);
                }
            } catch (e) {
                console.error('Ошибка при загрузке образования:', e);
            }
        }

        fetchEducation(person.id);
    }, [activeCategory, person.id]);

    /* ------------ JOB --------------- */
    useEffect(() => {
        if (activeCategory !== 'job') return;

        async function fetchJob(personId) {
            if (!personId) return;

            try {
                const res = await fetch(`/person/${personId}/job`);
                if (!res.ok) throw new Error('Ошибка сети');
                const data = await res.json();

                if (data && data.length > 0) {
                    const job = data[0];
                    setFormData(prev => ({
                        ...prev,
                        id: job.id,
                        person_id: job.person_id,
                        position: job.position || '',
                        place: job.place || '',
                        start_date: job.start_date || '',
                        start_date_text: job.start_date_text || '',
                        end_date: job.end_date || '',
                        end_date_text: job.end_date_text || '',
                        work_experience: job.work_experience || '',
                        description: job.description || '',
                    }));
                } else {
                    setFormData(emptyDataByCategory.job);  // пустая форма
                }
            } catch (e) {
                console.error('Ошибка при загрузке работы:', e);
            }
        }

        fetchJob(person.id);
    }, [activeCategory, person.id]);

    /* ------------ HEALTH_RECORD --------------- */
    useEffect(() => {
        if (activeCategory !== 'health_record') return;

        async function fetchHealthRecord(personId) {
            if (!personId) return;

            try {
                const res = await fetch(`/person/${personId}/health_record`);
                if (!res.ok) throw new Error('Ошибка сети');
                const data = await res.json();

                if (data && data.length > 0) {
                    const rec = data[0];
                    setFormData(prev => ({
                        ...prev,
                        id: rec.id,
                        person_id: rec.person_id,
                        disease_name: rec.disease_name || '',
                        diagnosis_date: rec.diagnosis_date || '',
                        diagnosis_date_text: rec.diagnosis_date_text || '',
                        medical_organization: rec.medical_organization || '',
                        doctor_fullname: rec.doctor_fullname || '',
                        description: rec.description || '',
                    }));
                } else {
                    setFormData(emptyDataByCategory.health_record);
                }
            } catch (e) {
                console.error('Ошибка при загрузке health_record:', e);
            }
        }

        fetchHealthRecord(person.id);
    }, [activeCategory, person.id]);



    return (
        <div className="person-modal-right-col">
            <div className="person-modal-header">
                {isReadOnly ? <h3>Посмотреть информацию:</h3> : <h3>Добавить информацию:</h3>}
                {!isReadOnly && (
                    <div className="person-modal-button-group">
                        <button
                            type="button"
                            className="person-modal-add-button"
                            onClick={() => setIsAddModalOpen(true)}
                            title="Добавить карточку родственника"
                        >
                            Добавить человека
                        </button>
                        <button
                            type="button"
                            className="person-modal-add-button"
                            onClick={() => setIsAddRelationOpen(true)}
                            title="Добавить связь между людьми"
                        >
                            Добавить связь
                        </button>
                    </div>
                )}
            </div>

            {/* Тут рендерим модалку добавления персоны, если она открыта */}
            {isAddModalOpen && (
                <AddPersonModal
                    visible={true}
                    onClose={() => setIsAddModalOpen(false)}
                    basePersonId={person.id}
                    basePersonName={person.full_name}
                    familyTreeId={person.family_tree_id}
                    userRole={userRole}
                    onAddPerson={(newPerson) => {
                        window.location.reload()
                        updateGraphData();
                        console.log('Добавлен новый человек', newPerson);
                    }}
                />
            )}

            {/* Тут рендерим модалку добавления связи, если она открыта */}
            {isAddRelationOpen && (
                <AddRelationModal
                    visible={true}
                    onClose={() => setIsAddRelationOpen(false)}
                    basePersonId={person.id}
                    basePersonName={person.full_name}
                    familyTreeId={person.family_tree_id}
                    userRole={userRole}
                    onRelationAdded={() => {
                        window.location.reload()
                        updateGraphData();
                        console.log('Связь добавлена');
                    }}
                />
            )}


            <div className="person-modal-category-buttons">
                {categories.map(({key, label}) => (
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
                            {/*<label>*/}
                            {/*    Тут ID этой карточки человека*:*/}
                            {/*    <input*/}
                            {/*        type="number"*/}
                            {/*        value={formData.person1_id}*/}
                            {/*        onChange={(e) => updateField('person1_id', e.target.value)}*/}
                            {/*        disabled={readOnly}*/}
                            {/*    />*/}
                            {/*    {errors.person1_id && <span className="error">{errors.person1_id}</span>}*/}
                            {/*</label>*/}
                            <label>
                                ФИО до свадьбы (текущая карточка):
                                <input
                                    type="text"
                                    value={formData.premarital_surname1}
                                    onChange={(e) => updateField('premarital_surname1', e.target.value)}
                                    disabled={readOnly}
                                />
                            </label>
                            <label>
                                Выберете карточку супруга/супруги*:
                                <select
                                    value={formData.person2_id || ''}
                                    onChange={(e) => updateField('person2_id', e.target.value)}
                                >
                                    <option value="" disabled>Выберите человека</option>
                                    {allPersons.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.full_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.person2_id && <span className="error">{errors.person2_id}</span>}
                            </label>
                            <label>
                                ФИО до свадьбы (карточка супруга/супруги):
                                <input
                                    type="text"
                                    value={formData.premarital_surname2}
                                    onChange={(e) => updateField('premarital_surname2', e.target.value)}
                                />
                            </label>
                            <label>
                            Тип брака*:
                                <select
                                    value={formData.type}
                                    onChange={(e) => updateField('type', e.target.value)}
                                >
                                    <option value="">-- выберите тип брака --</option>
                                    <option value="legal">Гражданский брак</option>
                                    <option value="civil">Фактический брак (неофициальный)</option>
                                    <option value="cherch">Церковный брак</option>
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

                            <div className="person-modal-info-block-buttons">
                                <button
                                    type="button"
                                    className="person-modal-save-button"
                                    onClick={async () => {
                                        // Валидация минимум
                                        const newErrors = {};
                                        if (!formData.person1_id) newErrors.person1_id = 'Обязательно';
                                        if (!formData.person2_id) newErrors.person2_id = 'Обязательно';
                                        if (!formData.type) newErrors.type = 'Обязательно';
                                        if (!formData.begin_date) newErrors.begin_date = 'Обязательно';

                                        if (Object.keys(newErrors).length > 0) {
                                            setErrors(newErrors);
                                            return;
                                        }

                                        setErrors({});

                                        const payload = {
                                            person1_id: Number(formData.person1_id),
                                            premarital_surname1: formData.premarital_surname1,
                                            person2_id: Number(formData.person2_id),
                                            premarital_surname2: formData.premarital_surname2,
                                            type: formData.type,
                                            begin_date: formData.begin_date,
                                            begin_date_text: formData.begin_date_text,
                                            end_date: formData.end_date,
                                            end_date_text: formData.end_date_text,
                                            end_reason: formData.end_reason,
                                            place: formData.place,
                                            description: formData.description,
                                        };

                                        try {
                                            let res;
                                            if (formData.id) {
                                                // Обновляем (PUT)
                                                res = await fetch(`/marriage/${formData.id}`, {
                                                    method: 'PUT',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(payload),
                                                });
                                            } else {
                                                // Создаем (POST)
                                                res = await fetch(`/person/${formData.person1_id}/marriage`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(payload),
                                                });
                                            }

                                            if (!res.ok) {
                                                const errorData = await res.json();
                                                alert('Ошибка сервера: ' + JSON.stringify(errorData));
                                                return;
                                            }

                                            const data = await res.json();
                                            alert('Успешно сохранено!');
                                            // Тут нужно обновить состояние, чтобы подтянуть свежие данные из БД
                                            // Например, вызови функцию загрузки данных заново или обнови formData
                                        } catch (error) {
                                            alert('Ошибка сети: ' + error.message);
                                        }
                                    }}
                                >
                                    Сохранить
                                </button>


                                <button
                                    type="button"
                                    className="person-modal-delete-button"
                                    onClick={async () => {
                                        if (!window.confirm('Точно удалить?')) return;

                                        try {
                                            const res = await fetch(`/marriage/${formData.id}`, {
                                                method: 'DELETE',
                                            });

                                            if (!res.ok) {
                                                alert('Ошибка при удалении');
                                                return;
                                            }

                                            alert('Удалено!');
                                            // Тут обнови состояние — например, очисти formData или закрой модалку
                                        } catch (error) {
                                            alert('Ошибка сети: ' + error.message);
                                        }
                                    }}
                                >
                                    Удалить
                                </button>

                            </div>
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

                            <div className="person-modal-info-block-buttons">
                                <button
                                    type="button"
                                    className="person-modal-save-button"
                                    onClick={async () => {
                                        /* простая минимальная проверка */
                                        const errs = {};
                                        if (!formData.education_type) errs.education_type = 'Обязательно';
                                        if (!formData.institution) errs.institution = 'Обязательно';

                                        if (Object.keys(errs).length) {
                                            setErrors(errs);
                                            return;
                                        }
                                        setErrors({});

                                        const payload = {
                                            person_id: person.id,
                                            education_type: formData.education_type,
                                            institution: formData.institution,
                                            start_date: formData.start_date,
                                            start_date_text: formData.start_date_text,
                                            end_date: formData.end_date,
                                            end_date_text: formData.end_date_text,
                                            description: formData.description,
                                        };

                                        const isUpdate = !!formData.id;


                                        const res = await fetch(
                                            isUpdate
                                                ? `/education/${formData.id}`         // PUT (обновить)
                                                : `/person/${person.id}/education`,   // POST (создать)
                                            {
                                                method: isUpdate ? 'PUT' : 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Accept': 'application/json',
                                                },
                                                body: JSON.stringify(payload),
                                            }
                                        );

                                        if (!res.ok) {
                                            let message = 'Неизвестная ошибка';
                                            try {
                                                const err = await res.json();
                                                message = JSON.stringify(err);
                                            } catch (_) {
                                            }
                                            alert('Ошибка сервера: ' + message);
                                            return;
                                        }

                                        alert('Сохранено!');
                                        /* после сохранения перезагрузи данные, чтобы форма обновилась */
                                        fetchEducation(person.id);

                                    }}
                                >
                                    Сохранить
                                </button>


                                {formData.id && (
                                    <button
                                        type="button"
                                        className="person-modal-delete-button"
                                        onClick={async () => {
                                            if (!window.confirm('Точно удалить?')) return;

                                            try {
                                                const res = await fetch(`/education/${formData.id}`, {
                                                    method: 'DELETE',
                                                });

                                                if (!res.ok) {
                                                    alert('Ошибка при удалении');
                                                    return;
                                                }

                                                alert('Удалено!');
                                                /* очистить форму */
                                                setFormData(prev => ({
                                                    ...prev,
                                                    id: null,
                                                    education_type: '',
                                                    institution: '',
                                                    start_date: '',
                                                    start_date_text: '',
                                                    end_date: '',
                                                    end_date_text: '',
                                                    description: '',
                                                }));
                                            } catch (e) {
                                                alert('Ошибка сети: ' + e.message);
                                            }
                                        }}
                                    >
                                        Удалить
                                    </button>
                                )}
                            </div>

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
                            <div className="person-modal-info-block-buttons">
                                <button
                                    type="button"
                                    className="person-modal-save-button"
                                    onClick={async () => {
                                        /* валидация */
                                        const errs = {};
                                        if (!formData.position) errs.position = 'Обязательно';
                                        if (Object.keys(errs).length) {
                                            setErrors(errs);
                                            return;
                                        }
                                        setErrors({});

                                        const payload = {
                                            person_id: person.id,
                                            position: formData.position,
                                            place: formData.place,
                                            start_date: formData.start_date,
                                            start_date_text: formData.start_date_text,
                                            end_date: formData.end_date,
                                            end_date_text: formData.end_date_text,
                                            work_experience: formData.work_experience,
                                            description: formData.description,
                                        };

                                        const isUpdate = !!formData.id;
                                        const res = await fetch(
                                            isUpdate
                                                ? `/job/${formData.id}`              // PUT
                                                : `/person/${person.id}/job`,        // POST
                                            {
                                                method: isUpdate ? 'PUT' : 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Accept': 'application/json'
                                                },
                                                body: JSON.stringify(payload),
                                            }
                                        );

                                        if (!res.ok) {
                                            alert('Ошибка сервера');
                                            return;
                                        }

                                        alert('Сохранено!');
                                        /* перезагрузить данные */
                                        setActiveCategory(null);           // закрыть блок
                                        setActiveCategory('job');          // открыть снова → хук fetchJob сработает
                                    }}
                                >
                                    Сохранить
                                </button>

                                {formData.id && (
                                    <button
                                        type="button"
                                        className="person-modal-delete-button"
                                        onClick={async () => {
                                            if (!window.confirm('Точно удалить?')) return;

                                            const res = await fetch(`/job/${formData.id}`, {method: 'DELETE'});
                                            if (!res.ok) {
                                                alert('Ошибка при удалении');
                                                return;
                                            }

                                            alert('Удалено!');
                                            setFormData(emptyDataByCategory.job);
                                        }}
                                    >
                                        Удалить
                                    </button>
                                )}
                            </div>

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
                            <div className="person-modal-info-block-buttons">
                                <button
                                    type="button"
                                    className="person-modal-save-button"
                                    onClick={async () => {
                                        const errs = {};
                                        if (!formData.disease_name) errs.disease_name = 'Обязательно';

                                        if (Object.keys(errs).length) {
                                            setErrors(errs);
                                            return;
                                        }
                                        setErrors({});

                                        const payload = {
                                            person_id: person.id,
                                            disease_name: formData.disease_name,
                                            diagnosis_date: formData.diagnosis_date,
                                            diagnosis_date_text: formData.diagnosis_date_text,
                                            medical_organization: formData.medical_organization,
                                            doctor_fullname: formData.doctor_fullname,
                                            description: formData.description,
                                        };

                                        const isUpdate = !!formData.id;

                                        const res = await fetch(
                                            isUpdate
                                                ? `/health_record/${formData.id}`       // PUT
                                                : `/person/${person.id}/health_record`, // POST
                                            {
                                                method: isUpdate ? 'PUT' : 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    Accept: 'application/json',
                                                },
                                                body: JSON.stringify(payload),
                                            }
                                        );

                                        if (!res.ok) {
                                            let message = 'Неизвестная ошибка';
                                            try {
                                                const err = await res.json();
                                                message = JSON.stringify(err);
                                            } catch (_) {
                                            }
                                            alert('Ошибка сервера: ' + message);
                                            return;
                                        }

                                        alert('Сохранено!');
                                        fetchHealthRecord(person.id);  // обновить форму
                                    }}
                                >
                                    Сохранить
                                </button>

                                {formData.id && (
                                    <button
                                        type="button"
                                        className="person-modal-delete-button"
                                        onClick={async () => {
                                            if (!window.confirm('Точно удалить?')) return;

                                            try {
                                                const res = await fetch(`/health_record/${formData.id}`, {
                                                    method: 'DELETE',
                                                });

                                                if (!res.ok) {
                                                    alert('Ошибка при удалении');
                                                    return;
                                                }

                                                alert('Удалено!');
                                                setFormData(emptyDataByCategory.health_record);
                                            } catch (e) {
                                                alert('Ошибка сети: ' + e.message);
                                            }
                                        }}
                                    >
                                        Удалить
                                    </button>
                                )}
                            </div>

                        </>
                    )}
                </div>
            )}
        </div>
    );
}
