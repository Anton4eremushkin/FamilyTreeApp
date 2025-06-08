import React, { useEffect, useState } from 'react';
import '../../css/app.Modal.css';

/** Описание доступных связей */
const relationTypes = [
    { key: 'father',          label: 'Отец',                          typeId: 6,  reverse: false },
    { key: 'mother',          label: 'Мать',                          typeId: 7,  reverse: false },
    { key: 'wife',            label: 'Жена',                          typeId: 8,  reverse: false },
    { key: 'husband',         label: 'Муж',                           typeId: 10, reverse: false },
    { key: 'child_father',    label: 'Ребёнок (назначить отца)',      typeId: 6,  reverse: true  },
    { key: 'child_mother',    label: 'Ребёнок (назначить мать)',      typeId: 7,  reverse: true  },
];

export default function AddRelationModal({
                                             visible,
                                             onClose,
                                             basePersonId,      // id выбранного в дереве человека
                                             basePersonName,
                                             familyTreeId,
                                             onRelationAdded,
                                         }) {
    const [relationKey,    setRelationKey]    = useState('');
    const [targetPersonId, setTargetPersonId] = useState('');
    const [allPersons,     setAllPersons]     = useState([]);
    const [loading,        setLoading]        = useState(false);
    const [error,          setError]          = useState(null);

    /* ───────── загрузка списка всех персон дерева ───────── */
    useEffect(() => {
        if (!visible) return;

        (async () => {
            try {
                const resp = await fetch(`/person/family/${familyTreeId}`);
                if (!resp.ok) throw new Error('Ошибка при загрузке списка персон');
                const data = await resp.json();
                setAllPersons(data.filter(p => p.id !== basePersonId));
            } catch (err) {
                setError(err.message);
            }
        })();
    }, [visible, familyTreeId, basePersonId]);

    /* ───────── отправка ───────── */
    const handleSubmit = async () => {
        if (!relationKey || !targetPersonId) {
            setError('Заполните все поля');
            return;
        }

        const relMeta = relationTypes.find(r => r.key === relationKey);
        if (!relMeta) return;

        const payload = {
            relation_type_id: relMeta.typeId,
            person_from: relMeta.reverse ? targetPersonId : basePersonId,
            person_to:   relMeta.reverse ? basePersonId   : targetPersonId,
        };

        setLoading(true);
        setError(null);

        try {
            const resp = await fetch('/family_relation', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body:    JSON.stringify(payload),
            });

            if (!resp.ok) {
                const err = await resp.json();
                throw new Error(err.error || 'Ошибка при добавлении связи');
            }



            onRelationAdded?.();
            onClose();
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    /* ───────── UI ───────── */
    return (
        <div className="modal-backdrop">
            <div className="modal-window">
                <h2 className="modal-title">Добавить связь</h2>

                <label>
                    Тип связи (кем {basePersonName} приходится выбираемому человеку):
                    <select value={relationKey} onChange={e => setRelationKey(e.target.value)}>
                        <option value="" disabled>Выберите тип</option>
                        {relationTypes.map(rt => (
                            <option key={rt.key} value={rt.key}>{rt.label}</option>
                        ))}
                    </select>
                </label>

                <label>
                    С кем связать:
                    <select value={targetPersonId} onChange={e => setTargetPersonId(e.target.value)}>
                        <option value="" disabled>Выберите человека</option>
                        {allPersons.map(p => (
                            <option key={p.id} value={p.id}>{p.full_name}</option>
                        ))}
                    </select>
                </label>

                {error && <div className="modal-error">{error}</div>}

                <div className="modal-buttons">
                    <button onClick={handleSubmit} disabled={loading} className="btn-primary">
                        {loading ? 'Добавляем...' : 'Добавить'}
                    </button>
                    <button onClick={onClose} disabled={loading} className="btn-secondary">
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}
