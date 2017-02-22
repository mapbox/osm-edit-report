import React from 'react';

export default function Section({children, title}) {
    return (
        <div className="flex-parent flex-parent--column border border--gray-light mx12 my48 round">
            <div className="prose bg-teal-faint border-b border--gray-light p12">
                <h4> {title} </h4>
            </div>
                {children}
            <div></div>
        </div>
    )
}