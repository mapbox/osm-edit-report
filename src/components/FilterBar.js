import React from 'react';

export default ({ users, showFilterBar }) => (
    <div className="border border--gray-light p12 round-b border-t--0">
        <nav>
            <div className="flex-parent flex-parent--row space-between">
                <div className="flex-child">
                    <input className='input' placeholder='Users' />
                </div>
                <div className="flex-child">
                    <input className='input' placeholder='Tags' />
                </div>
                <div className="flex-child">
                    <input className='input' placeholder='Time' />
                </div>
                <div className="flex-child">
                    <input className='input' placeholder='Bbox' />
                </div>
            </div>
        </nav>
    </div>
);
