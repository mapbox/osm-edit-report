import React from 'react';
import FiltersBar from './FiltersBar';
import NavBar from './NavBar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getStats, setFilter } from '../store/actions';

class Header extends React.Component {
    static propTypes = {
        getStats: React.PropTypes.func,
        setUsers: React.PropTypes.func,
        setBbox: React.PropTypes.func,
        setDateFrom: React.PropTypes.func,
        setDateTo: React.PropTypes.func,
        setTags: React.PropTypes.func,
        filters: React.PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            showFiltersBar: false,
            selectedFilter: null
        }
    }

    toggleTags = () => {
        if (this.state.selectedFilter === 'tags') {
            return this.setState({ selectedFilter: null });
        }
        this.setState({ selectedFilter: 'tags'});
    }
    toggleUsers = () => {
        if (this.state.selectedFilter === 'users') {
            return this.setState({ selectedFilter: null });
        }
        this.setState({ selectedFilter: 'users' });
    }
    toggleDate = () => {
        if (this.state.selectedFilter === 'date') {
            return this.setState({ selectedFilter: null });
        }
        this.setState({ selectedFilter: 'date' });
    }

    onChange = (filters) => {
        this.props.setFilter(filters);
        this.props.getStats(filters);
    }

    render() {
        return (
            <div className="">
                <NavBar
                    toggleDate={this.toggleDate}
                    toggleUsers={this.toggleUsers}
                    toggleTags={this.toggleTags}
                    selectedFilter={this.state.selectedFilter}
                    filters={this.props.filters}
                    />
                <div className="grid">
                    {this.state.selectedFilter ?
                        <FiltersBar
                            selectedFilter={this.state.selectedFilter}
                            filterValues={this.props.filters}
                            onChange={this.onChange}
                        /> : null
            }

                </div>
            </div>
        );
    }
}

Header = connect(state => state, (dispatch) => ({
    ...bindActionCreators({ getStats, setFilter }, dispatch)
}))(Header);

export default  Header;
