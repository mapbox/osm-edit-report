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
    componentDidMount() {
        const el = document.getElementById('filters-bar');
        const parentRight = el.parentNode.parentNode.getBoundingClientRect().right;
        el.style.right = document.body.clientWidth - parentRight + 'px';
    }
    render() {
        const CurComp = this.getComp();
        return (
            <div style={{ position: 'absolute' }} id="filters-bar" className="bg-white z5 filters-bar col col--10 col--6-mm col--4-ml col--3-mxl border border--gray-light p12 round-b">
                    <CurComp 
                        filterValues={this.props.filterValues}
                        onChange={this.props.onChange}
                        onBlur={this.props.onBlur}
                    />
            </div>
        )
    }
}


export default FiltersBar;

