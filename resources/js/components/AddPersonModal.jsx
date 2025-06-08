import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import '../../css/app.Modal.css';

const relationOptions = [
    { label: 'Мать', value: 'mother', gender: 'female', relation_type_id: 7 },
    { label: 'Отец', value: 'father', gender: 'male', relation_type_id: 6 },
    { label: 'Муж', value: 'husband', gender: 'male', relation_type_id: 10 },
    { label: 'Жена', value: 'wife', gender: 'female', relation_type_id: 8 },
    { label: 'Сын', value: 'son', gender: 'male', relation_type_id: null },
    { label: 'Дочь', value: 'daughter', gender: 'female', relation_type_id: null },
];

export default function AddPersonModal({
                                           visible,
                                           onClose,
                                           onAddPerson,
                                           basePersonId,
                                           basePersonName,
                                           familyTreeId,
                                       }) {
    const [relation, setRelation] = useState(null);
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('other');
    const [file, setFile] = useState(null); // uploaded File object
    const [preview, setPreview] = useState(null); // preview URL
    const [status, setStatus] = useState('living');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //Automatically set gender when relation changes
    useEffect(() => {
        if (!relation) return;
        const found = relationOptions.find((r) => r.value === relation);
        if (found) setGender(found.gender);
    }, [relation]);

    // Generate preview when file selected
    useEffect(() => {
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    // Dropzone setup
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'image/*': [],
        },
    });

    if (!visible) return null;

    const handleSubmit = async () => {
        if (!relation || !fullName || !file) {
            setError('Заполните обязательные поля, включая изображение');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1️⃣ Upload image first
            const formData = new FormData();
            formData.append('image', file);

            const uploadResp = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResp.ok) {
                const errUpload = await uploadResp.json();
                throw new Error(errUpload.error || 'Ошибка при загрузке изображения');
            }

            const { url: urlImg } = await uploadResp.json(); // backend should return { url: "storage/..." }

            // 2️⃣ Create new person
            const createResp = await fetch('/person', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
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

            // 3️⃣ Determine relation mapping
            let person_from = null;
            let person_to = null;
            let relation_type_id = null;

            switch (relation) {
                case 'mother': {
                    person_from = newPerson.id;
                    person_to = basePersonId;
                    relation_type_id = 7;
                    break;
                }
                case 'father': {
                    person_from = newPerson.id;
                    person_to = basePersonId;
                    relation_type_id = 6;
                    break;
                }
                case 'wife': {
                    person_from = basePersonId;
                    person_to = newPerson.id;
                    relation_type_id = 8;
                    break;
                }
                case 'husband': {
                    person_from = basePersonId;
                    person_to = newPerson.id;
                    relation_type_id = 10;
                    break;
                }
                case 'son': {
                    person_from = basePersonId;
                    person_to = newPerson.id;
                    relation_type_id = 6; // father
                    break;
                }
                case 'daughter': {
                    person_from = basePersonId;
                    person_to = newPerson.id;
                    relation_type_id = 7; // mother
                    break;
                }
                default:
                    break;
            }

            // 4️⃣ Create relation
            const relResp = await fetch('/family_relation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
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
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-window max-w-lg w-full">
                <h2 className="modal-title">Добавить родственника</h2>

                {/* Relation selector */}
                <label className="block text-sm mb-2">
                    Тип связи (кем приходится добавляемый человеку {basePersonName}):
                    <select
                        value={relation || ''}
                        onChange={(e) => setRelation(e.target.value)}
                        className="add-person-modal"
                    >
                        <option value="" disabled>
                            Выберите связь
                        </option>
                        {relationOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Full name */}
                <label className="block text-sm mb-2">
                    Имя (полное):
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="add-person-modal"
                    />
                </label>

                {/* Drag & Drop Image uploader */}
                <section className="mt-4">
                    <p className="text-sm mb-1 text-gray-300">Фотография:</p>
                    <div
                        {...getRootProps({
                            className: `drag-drop-box ${isDragActive ? 'drag-active' : ''}`,
                        })}
                    >
                        <input {...getInputProps()} />
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="preview-image"
                            />
                        ) : (
                            <p>
                            {isDragActive
                                    ? 'Отпустите файл сюда'
                                    : 'Перетащите изображение сюда или кликните, чтобы выбрать'}
                            </p>
                        )}
                    </div>
                </section>

                {/* Status selector */}
                <label className="block text-sm mt-4 mb-2">
                    Статус:
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="living">Живой</option>
                        <option value="deceased">Умерший</option>
                        <option value="unknown">Неизвестно</option>
                    </select>
                </label>

                {error && <div className="modal-error mt-2 text-red-600">{error}</div>}

                <div className="modal-buttons mt-6 flex justify-end gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Сохраняем...' : 'Добавить'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="btn-secondary bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}
