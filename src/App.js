import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
import logo from './logo.svg';
import {getStats} from './store/actions';

class App extends Component {
    static propTypes = {
        actions: React.PropTypes.object,
    }

    render() {
        return (
          <div className="App" onClick={() => {
              this.props.actions.getStats();
          }}>
            <div className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h2>Welcome to React</h2>
            </div>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
            </p>
            <svg className="icon"><use xlinkHref="#icon-bike"/></svg>
          </div>
        );
    }
}

App = connect(state => state, (dispatch) => ({
    actions: bindActionCreators({getStats}, dispatch)
}))(App);

export default (App);
