import React from 'react';
import TagsSelect from './TagsSelect';
import UsersSelect from './UsersSelect';
import DateSelect from './DateSelect';
import MapSelect from './MapSelect';

class FiltersBar extends React.Component {

    getComp() {
        switch (this.props.selectedFilter) {
        case 'users':
            return UsersSelect;
        case 'tags':
            return TagsSelect;
        case 'date':
            return DateSelect
        case 'bbox':
            return MapSelect;
        default:
            return () => {};
        }
    }
    render() {
        const CurComp = this.getComp();
        return (
            <div className="col col--offl8 col--4 border border--gray-light p12 round-b border-t--0">
                <nav>
                    <CurComp 
                        filterValues={this.props.filterValues}
                        onChange={this.props.onChange}
                    />
                </nav>
            </div>
        )
    }
}


export default FiltersBar;

