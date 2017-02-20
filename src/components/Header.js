import React from 'react';
import FilterBar from './FilterBar';
import NavBar from './NavBar';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFilterBar: false
        }
    }
    toggleFilterBar= () => {
        this.setState({
            showFilterBar: !this.state.showFilterBar
        });
    }
    render() {
        return (
            <div className="">
                <NavBar showFilterBar={this.state.showFilterBar} toggleFilterBar={this.toggleFilterBar} />
                {this.state.showFilterBar ?
                    <FilterBar />
                    : null}
            </div>
        );
    }
}