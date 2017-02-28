import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
import {getStats, closeErrorModal} from './store/actions';
import Header from './components/Header';
import { MyButton } from './components/NavBar';
import R from 'ramda';
import Body from './components/Body';
import Section from './components/Section';
import BarGraph, { BrushGraph } from './components/BarGraph';
import ErrorModal from './components/ErrorModal';
import { Text,  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Brush } from 'recharts';
import { abbreviateNumber } from './helper';
import FirstGraph from './components/FirstGraph';

class App extends Component {
    static propTypes = {
        actions: React.PropTypes.object
    }

    constructor(props) {
        super(props);
        props.actions.getStats(props.filters);
        this.state = {
            firstGraph: {},
            topTags: {}





        }
    }

    firstGraph(d) {
     
    }
    topTags(d) {
        if (!d) return null;
        const byEdits = d.getEdits();
        const {tagsChanged, tagsModified, tagsDeleted} = byEdits;
        const tagsSum = tagsChanged + tagsModified + tagsDeleted
        const format = d.topTagsFormat(byEdits).slice(0,5);
        return (
            <Section 
                 title="Tags"
                 titleBottom={`Total: ${abbreviateNumber(tagsSum)}`}
                 titleRight="&nbsp;">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={format}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" dataKey="count"/>
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} tickFormatter={(t) => t.length > 12 ? t.slice(0, 11) + '..' : t} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" stackId="a" fill="#607d9c" />
                    </BarChart>
                </ResponsiveContainer>
            </Section >
        );
    }
    render() {
        const { showErrorModal, errorMessage } = this.props.modals;
        const { closeErrorModal } = this.props.actions;
        var d = this.props.stats.data;
        var data = d && d.getByTime('day');
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
                    {this.topTags(d)}
                </div>
            </div>
        );
    }
}

App = connect(state => state, (dispatch) => ({
    actions: bindActionCreators({getStats, closeErrorModal}, dispatch)
}))(App);

export default (App);

// {
//     d ? <Section title="All nodes ">
//         <BarGraph data={d.timeFormatCMD(d.getByTime('day'), 'nodes')} />
//     </Section> : null
// }
// {
//     d ? <Section title="All ways ">
//         <BarGraph data={d.timeFormatCMD(d.getByTime('day'), 'ways')} />
//     </Section> : null
// }
// {
//     d ? <Section title="All relations ">
//         <BarGraph data={d.timeFormatCMD(d.getByTime('day'), 'relations')} />
//     </Section> : null
// }
// {
//     d ? <Section title="All tags ">
//         <BarGraph data={d.timeFormatTags(d.getByTime('day'))} />
//     </Section> : null
// }
// {
//     d ? <Section title="All Object by users ">
//         <BrushGraph data={d.userFormatAllObj(d.getAllUsers(), 'objects')} />
//     </Section> : null
// }
// {
//     d ? <Section title="All tags by users ">
//         <BrushGraph data={d.userFormatAllTag(d.getAllUsers())} />
//     </Section> : null
// }