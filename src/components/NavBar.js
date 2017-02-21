import React from 'react';


export default ({ users, showFiltersBar, toggleFiltersBar }) => (
    <div className={`border border--gray-light p12 round-t ${!showFiltersBar ? 'round-b' : ''}`}>
        <nav>
            <div className="flex-parent flex-parent--row-ml  flex-parent--row-mxl flex-parent--column space-between">
                <div className="flex-child">
                    {users || 'Mapbox'}
                </div>
                <div className="flex-child flex-parent flex-parent--row">
                    <div className="header-filters flex-child">
                        <FilterButton>filer1</FilterButton>
                        <FilterButton>filer1</FilterButton>
                        <FilterButton>filer1</FilterButton>
                    </div>
                    <div className="header-button flex-child">
                        <a onClick={toggleFiltersBar} className='flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3 is-active' href='#'>
                            <svg className='icon mr3'><use xlinkHref='#icon-inspect'/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    </div>
);


const FilterButton = ({text, children}) => {
    return (
        <div className='bg-orange-faint mx3 color-orange-dark inline-block px6 py3 txt-xs txt-bold round-full'>
            <span>{children}</span>
            <button>
                <svg className='icon icon--s inline-block align-middle ml3'><use xlinkHref='#icon-close'></use></svg>
            </button>
        </div>
    );
}

