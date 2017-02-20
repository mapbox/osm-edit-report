import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
// import logo from './logo.svg';
import {getStats} from './store/actions';
import Header from './components/Header';
import Body from './components/Body';

class App extends Component {
    static propTypes = {
        actions: React.PropTypes.object,
    }

    constructor(props) {
        super(props);
        props.actions.getStats();
    }

    render() {
        return (
            <div className="viewport-full">
                <Header />
                <Body />
                <div className="flex-parent flex-parent--column">
                    {
                    Array.isArray(this.props.stats) && this.props.stats.map((e,i) => {
                        return <div key={i} className="m6 color-gray-dark bg-yellow-light flex-child">{JSON.stringify(e, null, 2)}</div>
                    })  
                    }
                </div>
            </div>
        );
    }
}

App = connect(state => state, (dispatch) => ({
    actions: bindActionCreators({getStats}, dispatch)
}))(App);

export default (App);

