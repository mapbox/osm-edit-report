import React from 'react';
import FiltersBar from './FiltersBar';
import NavBar from './NavBar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setFilters } from '../store/filters.action';
import { getStats } from '../store/stats.actions';

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
            filters: {}
        }
    }
    toggleFiltersBar= () => {
        this.setState({
            showFiltersBar: !this.state.showFiltersBar
        });
    }
    handleFilters = (filters) => {
        this.props.setFilters(filters);
        this.props.getStats(filters);
    }
    render() {
        return (
            <div className="">
                <NavBar showFiltersBar={this.state.showFiltersBar} toggleFiltersBar={this.toggleFiltersBar} />
                <div style={{ display: this.state.showFiltersBar ? 'block': 'none'}}>
                    <FiltersBar initialValues={this.props.filters} onSubmit={this.handleFilters}/>
                </div>
            </div>
        );
    }
}

Header = connect(state => state, (dispatch) => ({
    ...bindActionCreators({ getStats, setFilters }, dispatch)
}))(Header);

export default  Header;