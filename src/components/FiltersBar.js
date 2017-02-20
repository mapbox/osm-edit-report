import React from 'react';
import debounce from 'lodash.debounce';

export default class FiltersBar extends React.Component {
    static propTypes = {
        handleFilters: React.PropTypes.func,
        filters: React.PropTypes.object
    }
    constructor(props) {
        super(props);
        this.state = {
            tags: this.props.filters.tags || '',
            bbox: this.props.filters.bbox || '',
            time: this.props.filters.time || '',
            users: this.props.filters.users || '',
        }
        this._debouncedUpdate = debounce(() => {
            this.props.handleFilters(this.state);
        }, 700);
    }
    handleBbox = (e) => {
        this.setState({
            bbox: e.target.value
        });
        this._debouncedUpdate();
    }
    handleUsers = (e) => {
        this.setState({
            users: e.target.value
        });
        this._debouncedUpdate();
    }
    handleTags = (e) => {
        this.setState({
            tags: e.target.value
        });
        this._debouncedUpdate();
    }
    handleTime = (e) => {
        this.setState({
            time: e.target.value
        });
        this._debouncedUpdate();
    }
    render() {

        return (
            <div className="border border--gray-light p12 round-b border-t--0">
                <nav>
                    <div className="flex-parent flex-parent--row space-between">
                        <div className="flex-child">
                            <input className='input' value={this.state.users} placeholder='Users' onChange={this.handleUsers} />
                        </div>
                        <div className="flex-child">
                            <input className='input' value={this.state.tags} placeholder='Tags' onChange={this.handleTags} />
                        </div>
                        <div className="flex-child">
                            <input className='input' value={this.state.time} placeholder='Time' onChange={this.handleTime} />
                        </div>
                        <div className="flex-child">
                            <input className='input' value={this.state.bbox} placeholder='Bbox' onChange={this.handleBbox} />
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
    
}({ users, showFiltersBar, handleUsers, handleTags, handleTime, handleBbox }) => (
    <div className="border border--gray-light p12 round-b border-t--0">
        <nav>
            <div className="flex-parent flex-parent--row space-between">
                <div className="flex-child">
                    <input className='input' placeholder='Users' onChange={handleUsers} />
                </div>
                <div className="flex-child">
                    <input className='input' placeholder='Tags' onChange={handleTags} />
                </div>
                <div className="flex-child">
                    <input className='input' placeholder='Time' onChange={handleTime} />
                </div>
                <div className="flex-child">
                    <input className='input' placeholder='Bbox' onChange={handleBbox} />
                </div>
            </div>
        </nav>
    </div>
);
