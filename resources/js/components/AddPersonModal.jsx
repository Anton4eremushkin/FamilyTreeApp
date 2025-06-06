import React, { useState, useEffect } from 'react';
import '../../css/app.Modal.css';

const relationOptions = [
    { label: 'Мать', value: 'mother', gender: 'female', relation_type_id: 7 },
    { label: 'Отец', value: 'father', gender: 'male', relation_type_id: 6 },
    { label: 'Муж', value: 'husband', gender: 'male', relation_type_id: 10 },
    { label: 'Жена', value: 'wife', gender: 'female', relation_type_id: 8 },
    { label: 'Сын', value: 'son', gender: 'male', relation_type_id: null },  // отношение к ребенку - чуть позже разберём
    { label: 'Дочь', value: 'daughter', gender: 'female', relation_type_id: null },
];

export default function AddPersonModal({
                                       visible,
                                       onClose,
                                       onAddPerson,
                                       basePersonId,
                                       basePersonName,
                                       familyTreeId
                                   }) {
    const [relation, setRelation] = useState(null);
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('other');
    const [urlImg, setUrlImg] = useState(''); // для простоты пока URL, позже можно drag&drop
    const [birthDate, setBirthDate] = useState('');
    const [status, setStatus] = useState('living');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Когда меняется relation, автоматически ставим пол
    useEffect(() => {
        if (!relation) return;
        const found = relationOptions.find(r => r.value === relation);
        if (found) setGender(found.gender);
    }, [relation]);

    if (!visible) return null;

    const handleSubmit = async () => {
        if (!relation || !fullName || !urlImg) {
            setError('Заполните обязательные поля');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Создаем новую персону
            const createResp = await fetch('/person', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'Accept':       'application/json',  },
                body: JSON.stringify({
                    family_tree_id: familyTreeId,
                    full_name: fullName,
                    url_img: urlImg,
                    gender: gender,
                    status: status,
                }),
            });

            if (!createResp.ok) {
                const errData = await createResp.json();
                throw new Error(errData.error || 'Ошибка при создании персоны');
            }

            const newPerson = await createResp.json();

            // Теперь создаем связь в family_relation
            // Определяем, кто from, кто to, и relation_type_id
            // Если relation - отец или мать, значит от новой персоны к базовой
            // Если relation - муж/жена, то двунаправленная связь (делаем одну, для начала)
            // Если relation - сын/дочь, связь от базовой персоны к новой (родитель к ребенку)

            let person_from = null;
            let person_to = null;
            let relation_type_id = null;

            switch(relation) {
                case 'mother':
                    person_from = newPerson.id;
                    person_to = basePersonId;
                    relation_type_id = 7;
                    break;
                case 'father':
                    person_from = newPerson.id;
                    person_to = basePersonId;
                    relation_type_id = 6;
                    break;
                case 'wife':
                    person_from = basePersonId;
                    person_to = newPerson.id;
                    relation_type_id = 8;
                    break;
                case 'husband':
                    person_from = basePersonId;
                    person_to = newPerson.id;
                    relation_type_id = 10;
                    break;
                case 'son':
                    person_from = basePersonId;
                    person_to = newPerson.id;
                    relation_type_id = 6;  // Для сына relation_type_id: father (6) — корректнее?
                    break;
                case 'daughter':
                    person_from = basePersonId;
                    person_to = newPerson.id;
                    relation_type_id = 7;  // Для дочери relation_type_id: mother (7)
                    break;
                default:
                    break;
            }

            const relResp = await fetch('/family_relation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'Accept':       'application/json',  },
                body: JSON.stringify({
                    person_from,
                    person_to,
                    relation_type_id,
                }),
            });

            if (!relResp.ok) {
                const errRel = await relResp.json();
                throw new Error(errRel.error || 'Ошибка при создании связи');
            }

            onAddPerson(newPerson);
            onClose();
        } catch(e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-window">
                <h2 className="modal-title">Добавить родственника для человека {basePersonName}</h2>

                <label>
                    Тип связи:
                    <select value={relation || ''} onChange={e => setRelation(e.target.value)}>
                        <option value="" disabled>Выберите связь</option>
                        {relationOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Имя (полное):
                    <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                    />
                </label>

                <label>
                    URL картинки:
                    <input
                        type="text"
                        value={urlImg}
                        onChange={e => setUrlImg(e.target.value)}
                        placeholder="Введите URL изображения"
                    />
                </label>

                <label>
                    Статус:
                    <select value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="living">Живой</option>
                        <option value="deceased">Умерший</option>
                        <option value="unknown">Неизвестно</option>
                    </select>
                </label>

                {error && <div className="modal-error">{error}</div>}

                <div className="modal-buttons">
                    <button onClick={handleSubmit} disabled={loading} className="btn-primary">
                        {loading ? 'Сохраняем...' : 'Добавить'}
                    </button>
                    <button onClick={onClose} disabled={loading} className="btn-secondary">
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );

}
