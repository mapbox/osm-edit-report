import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
import {getStats} from './store/stats.actions';
import Header from './components/Header';
import Body from './components/Body';
import Section from './components/Section';
import BarGraph, { BrushGraph } from './components/BarGraph';

class App extends Component {
    static propTypes = {
        actions: React.PropTypes.object
    }

    constructor(props) {
        super(props);
        props.actions.getStats(props.filters);
    }

    render() {
        var d = this.props.stats.data;
        return (
            <div className="viewport-full col--10-ml col--10-mxl col--offl1-ml col--offl1-mxl">
                <Header />
                <div className="flex-parent flex-parent--column align-items--center">
                    {d ?  <Section title="This Week Total Objects ">
                        <BarGraph data={d.timeFormatCMD(d.getByTime('day'), 'objects')} /> 
                    </Section> : null}
                    {d ? <Section title="All nodes ">
                        <BarGraph data={d.timeFormatCMD(d.getByTime('day'), 'nodes')} /> 
                    </Section> : null}
                    {d ? <Section title="All ways ">
                       <BarGraph data={d.timeFormatCMD(d.getByTime('day'), 'ways')} /> 
                    </Section> : null}
                    {d ? <Section title="All relations ">
                        <BarGraph data={d.timeFormatCMD(d.getByTime('day'), 'relations')} />
                    </Section> : null}
                    {d ? <Section title="All tags ">
                        <BarGraph data={d.timeFormatTags(d.getByTime('day'))} />
                    </Section> : null}
                    {d ? <Section title="All Object by users ">
                        <BrushGraph data={d.userFormatAllObj(d.getAllUsers(), 'objects')} />
                    </Section> : null}
                    {d ? <Section title="All tags by users ">
                        <BrushGraph data={d.userFormatAllTag(d.getAllUsers())} />
                    </Section> : null}
                </div>
            </div>
        );
    }
}

App = connect(state => state, (dispatch) => ({
    actions: bindActionCreators({getStats}, dispatch)
}))(App);

export default (App);
