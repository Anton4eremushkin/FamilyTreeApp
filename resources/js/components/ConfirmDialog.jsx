import React, { useEffect, useRef } from 'react';

export default function ConfirmDialog({ text, onYes, onNo }) {
    const yesButtonRef = useRef();

    useEffect(() => {
        yesButtonRef.current?.focus();
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
            onClick={onNo}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    minWidth: 300,
                    background: '#fff',
                    borderRadius: 12,
                    padding: 24,
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
            >
                <p style={{ marginBottom: 20 }}>{text}</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button
                        ref={yesButtonRef}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 8,
                            border: 'none',
                            background: '#4caf50',
                            color: '#fff',
                            cursor: 'pointer',
                        }}
                        onClick={onYes}
                    >
                        Да
                    </button>
                    <button
                        style={{
                            padding: '8px 16px',
                            borderRadius: 8,
                            border: 'none',
                            background: '#f44336',
                            color: '#fff',
                            cursor: 'pointer',
                        }}
                        onClick={onNo}
                    >
                        Нет
                    </button>
                </div>
            </div>
        </div>
    );
}
