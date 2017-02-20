import React from 'react';
import FiltersBar from './FiltersBar';
import NavBar from './NavBar';

export default class Header extends React.Component {
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
        console.log(filters);
        this.setState({
            filters
        });
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