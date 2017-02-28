import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
import {getStats, closeErrorModal} from './store/actions';
import Header from './components/Header';
import ErrorModal from './components/ErrorModal';
import FirstGraph from './components/FirstGraph';
import TagsGraph from './components/TagsGraph';
import Table from './components/Table';

class App extends Component {
    static propTypes = {
        actions: React.PropTypes.object
    }

    constructor(props) {
        super(props);
        props.actions.getStats(props.filters);
    }

    render() {
        const { showErrorModal, errorMessage } = this.props.modals;
        const { closeErrorModal } = this.props.actions;
        var d = this.props.stats.data;
        return (
            <div className="viewport-full col--10-ml col--10-mxl col--offl1-ml col--offl1-mxl">
                <Header />
                <ErrorModal
                    showModal={showErrorModal}
                    message={errorMessage}
                    onClose={closeErrorModal}
                />
                <div className="flex-parent flex-parent--column align-items--center">
                    <FirstGraph data={d} />
                    <TagsGraph data={d} />
                    <Table data={d} />
                    
                </div>
            </div>
        );
    }
}

App = connect(state => state, (dispatch) => ({
    actions: bindActionCreators({getStats, closeErrorModal}, dispatch)
}))(App);

export default (App);
