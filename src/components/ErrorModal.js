import React from 'react';

const ErrorModal = ({ showModal, message, onClose }) => {
    const isActive = showModal ? 'is-active' : 'none';

    return (
        <div className={`grid col--offl2 col--offr2 col--8 align-items--center space-between p12 bg-red-light round-b ${isActive}`}>
            <div className="flex-child">
                <span className="txt-bold pr12">Error.</span>
                <span>{JSON.stringify(message)}</span>
            </div>
            <button className="flex-child align-r p12" onClick={onClose}>
                <svg className="icon link color-darken50">
                    <use xlinkHref="#icon-close"></use>
                </svg>
            </button>
        </div>
    );
}

export default ErrorModal;
