import React from 'react';


export default ({ toggleUsers, toggleTags, toggleDate, selectedFilter, filters }) => (
    <div className={`border border--gray-light p12 round-t`}>
        <nav>
            <div className="flex-parent flex-parent--row-ml  flex-parent--row-mxl flex-parent--column space-between">
                <div className="flex-child">
                    {'Mapbox'}
                </div>
                <div className="flex-child flex-parent flex-parent--row">
                    <div className="header-filters flex-child">
                        <FilterButton filled={filters.users} selectedFilter={selectedFilter} onClick={toggleUsers} >Users</FilterButton>
                        <FilterButton filled={filters.tags} selectedFilter={selectedFilter} onClick={toggleTags} >Tags</FilterButton>
                        <FilterButton filled={filters.dateFrom || filters.dateTo} selectedFilter={selectedFilter} onClick={toggleDate}>Date</FilterButton>
                    </div>
                    <div className="header-button flex-child">
                       
                    </div>
                </div>
            </div>
        </nav>
    </div>
);


const FilterButton = ({children, onClick, selectedFilter, filled}) => {
    console.log(filled);
    const type = children && children.toLowerCase();
    const active = selectedFilter === type;
    const mapping = {
        'users': 'btn--red',
        'tags': 'btn--teal',
        'date': 'btn-purple'
    };
    let color = active ? mapping[type] : 'btn--darken50';
    if (filled) {
        color = mapping[type];
    }  else {
        color += ' btn--stroke';
    }
    return (
        <div onClick={onClick} className="inline-block mr18">
            <button className={`btn btn--s btn-border--1 ${color}`}>{children}</button>
            {/*<button>
                <svg className='icon icon--s inline-block align-middle ml3'><use xlinkHref='#icon-close'></use></svg>
            </button>*/}
        </div>
    );
}
//bg-orange-faint mx3 color-orange-dark inline-block px6 py3 txt-xs txt-bold round-full

