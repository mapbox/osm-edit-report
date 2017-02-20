import React from 'react';
import FiltersBar from './FiltersBar';
import NavBar from './NavBar';

export default class Header extends React.Component {
    static propTypes = {
        getStats: React.PropTypes.func
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
        this.setState({
            filters
        });
        this.applyFilters();
    }
    applyFilters = () => {
        var filters = {};
        Object.assign(filters, this.state.filters);
    
        if (filters.users) {
            filters.users = filters.users.split(' ');
        }
        if (filters.tags) {
            filters.tags = filters.tags.split(' ');
        }
        console.log('applying', this.state.filters);
        this.props.getStats(filters);
    }
    render() {
        return (
            <div className="">
                <NavBar showFiltersBar={this.state.showFiltersBar} toggleFiltersBar={this.toggleFiltersBar} />
                {this.state.showFiltersBar ?
                    <FiltersBar handleFilters={this.handleFilters} filters={this.state.filters} />
                    : null}
            </div>
        );
    }
}