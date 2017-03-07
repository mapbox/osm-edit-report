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
    getTodayIcon(avg, latestEdits) {
        if (latestEdits > (1.2 * avg)) {
            return <svg className='icon inline color-green'><use xlinkHref='#icon-chevron-up'/></svg>;
        }
        else if (latestEdits < 0.8 * avg) {
            return <svg className='icon inline color-red'><use xlinkHref='#icon-chevron-down' /></svg>;
        } else {
            return null;
        }
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
        let sum = format.reduce((prev, cur) => prev + cur.c + (cur.d || 0) + (cur.m || 0), 0);
        const avg = sum/format.length;

        let latestEdits = format[format.length - 1];
        latestEdits = latestEdits.c + (latestEdits.d || 0) + (latestEdits.m || 0);
        
        const todayIcon = this.getTodayIcon(avg, latestEdits);
        const titleRight = (
            <span>
                <span>{`${isHour ? 'Last hour' : 'Today'} ${abbreviateNumber(latestEdits)}`} {todayIcon} </span>
            </span>
        )

        if (isHour) {
            format = R.takeLast(150, d.timeFormatEdits(byTime, this.state.type, 'MM/DD HH:00'));
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
                titleRight={titleRight}
                >
                <ResponsiveContainer width="100%" height={300} className="no-select">
                    <BarChart data={format}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        layout={this.props.layout}
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend payload={isChangesets ? undefined : [{ type: 'rect', dataKey: 'c', value: 'created', color: '#607d9c' }, { type: 'rect', dataKey: 'd', value: 'deleted', color: '#269561' }, { type: 'rect', dataKey: 'm', value: 'modified', color: '#273d56' }]}/>
                        <Bar dataKey="c" stackId="a" fill="#607d9c" />
                        {format.length > 20 ? <Brush dataKey='name' height={40} startIndex={Math.max(0, format.length - 1 - 24)} stroke="#607d9c" /> : null}
                        {!isChangesets ? <Bar dataKey="m" stackId="a" fill="#273d56" /> : null }
                        {!isChangesets ? <Bar dataKey="d" stackId="a" fill="#269561" /> : null }
                    </BarChart>
                </ResponsiveContainer>
            </Section >
        );
    }
}