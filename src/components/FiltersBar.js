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
        if (!el) return;
        const parent = el.parentNode.parentNode.getBoundingClientRect();
        el.style.right = (document.body.clientWidth - parent.right) + 'px';
    }
    render() {
        const CurComp = this.getComp();
        const { sticky } = this.props;
        return (
            <div style={{ position: 'fixed', top: sticky ? 30 :''}} id="filters-bar" className="bg-white z5 filters-bar col col--10 col--6-mm col--4-ml col--3-mxl border border--gray-light p12 round-b">
                    <CurComp 
                        filterValues={this.props.filterValues}
                        onChange={this.props.onChange}
                        topTags={this.props.topTags}
                    />
            </div>
        )
    }
}


export default FiltersBar;

