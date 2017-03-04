import React from 'react';
import Section from './Section';
import { abbreviateNumber } from '../helper';
import { Text, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Brush } from 'recharts';
import { PillButton } from './PillButton';
import R from 'ramda';

export default class FirstGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 'day',
            type: props.hasTagFilter ? 'tags' : 'objects'
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.hasTagFilter) {
            this.setState({
                type: 'tags'
            });
        }
    }
    onChangeHour = () => {
        this.setState({
            time: this.state.time === 'day' ? 'hour': 'day'
        })
    }
    onChangeTags = () => {
        this.setState({
            type: 'tags'
        })
    }
    onChangeObjects = () => {
        this.setState({
            type: 'objects'
        })
    }
    onChangeChangeSets = () => {
        this.setState({
            type: 'changesets'
        })
    }
    render() {
        const d = this.props.data;
        if (!d) return null;
        const isHour = this.state.time === 'hour';
        const isDay = this.state.time === 'day';
        const isTags = this.state.type === 'tags';
        const isObjects = this.state.type === 'objects';
        const isChangesets = this.state.type === 'changesets';

        let byTime = d.getByTime(this.state.time);
        let format = d.timeFormatEdits(byTime, this.state.type, 'DD MMM');
        let sum = format.reduce((prev, cur) => prev + cur.c + cur.d + cur.m, 0);
        let lastestEdits = format[format.length - 1];
        lastestEdits = lastestEdits.c + lastestEdits.d + lastestEdits.m;
        if (isHour) {
            format = R.takeLast(24, d.timeFormatEdits(byTime, this.state.type, 'MM/DD HH:00'));
        }
        if (isChangesets) {
            sum = format.reduce((prev, cur) => prev + cur.c, 0);
        }
        const buttons = (
            <div>
                <div className="flex-parent-inline mx12-mm mx12-ml mx12-mxl">
                    <PillButton active={isTags} onClick={this.onChangeTags} classes='btn--pill-hl'>Tags</PillButton>
                    <PillButton active={isObjects} onClick={this.onChangeObjects} classes='btn--pill-hc'>Objects</PillButton>
                    <PillButton active={isChangesets} onClick={this.onChangeChangeSets} classes='btn--pill-hr'>Changesets</PillButton>
                    
                </div>
                <div className="flex-parent-inline mt6">
                    <PillButton active={isHour} onClick={this.onChangeHour} classes='btn--pill-hl'>Hourly</PillButton>
                    <PillButton active={isDay} onClick={this.onChangeHour} classes='btn--pill-hr'>Daily</PillButton>
                </div>
            </div>
        );
        return (
            <Section title="Edits" 
                titleRightBottom={buttons}
                titleBottom={`Total: ${abbreviateNumber(sum)}`}
                titleRight={`Today: ${abbreviateNumber(lastestEdits)}`}
                >
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={format}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        layout={this.props.layout}
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="c" stackId="a" fill="#607d9c" />
                        {!isChangesets ? <Bar dataKey="m" stackId="a" fill="#273d56" /> : null }
                        {!isChangesets ? <Bar dataKey="d" stackId="a" fill="#269561" /> : null }
                    </BarChart>
                </ResponsiveContainer>
            </Section >
        );
    }
}