import React from 'react';


export default ({ toggleUsers, toggleTags, toggleDate }) => (
    <div className={`border border--gray-light p12 round-t`}>
        <nav>
            <div className="flex-parent flex-parent--row-ml  flex-parent--row-mxl flex-parent--column space-between">
                <div className="flex-child">
                    {'Mapbox'}
                </div>
                <div className="flex-child flex-parent flex-parent--row">
                    <div className="header-filters flex-child">
                        <FilterButton onClick={toggleUsers} >Users</FilterButton>
                        <FilterButton onClick={toggleTags} >Tags</FilterButton>
                        <FilterButton onClick={toggleDate}>Time</FilterButton>
                    </div>
                    <div className="header-button flex-child">
                       
                    </div>
                </div>
            </div>
        </nav>
    </div>
);


const FilterButton = ({text, children, onClick}) => {
    return (
        <div onClick={onClick} className='bg-orange-faint mx3 color-orange-dark inline-block px6 py3 txt-xs txt-bold round-full'>
            <span>{children}</span>
            <button>
                <svg className='icon icon--s inline-block align-middle ml3'><use xlinkHref='#icon-close'></use></svg>
            </button>
        </div>
    );
}

