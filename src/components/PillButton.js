import React from 'react';
export function PillButton ({active, disable, onClick, classes, children}) {
    return (
        <button onClick={!disable && onClick} className={`${active ? 'is-active' : '' } btn btn--pill btn--s ${disable && 'cursor-notallowed'} color-gray btn--gray-faint ${classes}`}>{children}</button>
    );
}