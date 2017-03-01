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
            <div style={{ position: 'absolute'}} className="bg-white z5 filters-bar col col--offl6 col--4 border border--gray-light p12 round-b">
                    <CurComp 
                        filterValues={this.props.filterValues}
                        onChange={this.props.onChange}
                    />
            </div>
        )
    }
}


export default FiltersBar;

