import React from 'react';
export function PillButton ({active, onClick, classes, children}) {
    return (
        <button onClick={onClick} className={`${active ? 'is-active' : '' } btn btn--pill btn--s color-gray btn--gray-faint ${classes}`}>{children}</button>
    );
}