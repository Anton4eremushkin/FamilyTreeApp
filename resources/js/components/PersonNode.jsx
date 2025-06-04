import React from 'react';
import { Handle, Position } from 'reactflow';

const PersonNode = ({ data }) => {
    const { full_name, birth_date, death_date, url_img } = data;
    const birthYear = birth_date ? new Date(birth_date).getFullYear() : '';
    const deathYear = death_date ? new Date(death_date).getFullYear() : '';
    const dateLabel = birthYear && deathYear ? `${birthYear} - ${deathYear}` : birthYear || '';

    const [firstName, lastName, patronymic] = full_name.split(' ');

    return (
        <div style={{
            width: 110,
            height: 150,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        }}>
            <img
                src={`/storage/${url_img}`}
                alt={full_name}
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: 4
                }}
            />

            <div style={{fontWeight: 'bold', fontSize: '14px', textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {firstName}
            </div>
            <div style={{fontWeight: 'bold', fontSize: '14px', textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {lastName}
            </div>
            <div style={{fontWeight: 'bold', fontSize: '14px', textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {patronymic}
            </div>

            <div style={{fontSize: '12px', color: '#555'}}>{dateLabel}</div>

            {/* Узлы соединения */}
            <Handle type="target" position={Position.Top} id="topParents" style={{  width: 0, height: 0, opacity: 0, pointerEvents: 'none'  }}/>
            <Handle type="source" position={Position.Bottom} id="bottomChildren" style={{  width: 0, height: 0, opacity: 0, pointerEvents: 'none'  }}/>

            {/* Для прочих связей, если надо */}
            <Handle type="source" position={Position.Right} id="right" style={{  width: 0, height: 0, opacity: 0, pointerEvents: 'none'  }}/>
            <Handle type="target" position={Position.Left} id="left" style={{  width: 0, height: 0, opacity: 0, pointerEvents: 'none'  }}/>
        </div>
    );
};

export default PersonNode;
