// resources/js/components/TreeHeader.jsx
import React from 'react';

export default function TreeHeader({ userRole, onSearchClick, onUsersClick }) {
    const isCreator = ['creator'].includes(userRole);
    const isResearcher = ['researcher'].includes(userRole);

    return (
        <div className="tree-view-header">
            <div className="left-buttons">
                <a href="/"><button>На главную</button></a>
                {(isCreator || isResearcher) && <button>Пригласить в древо</button>}
            </div>
            <div className="right-buttons">
                <button onClick={onSearchClick}>Поиск</button>
                {isCreator && <>
                    <button onClick={onUsersClick}>Пользователи</button>
                    <button>Настройки древа</button>
                </>}
                <button>Профиль</button>
            </div>
        </div>
    );
}

