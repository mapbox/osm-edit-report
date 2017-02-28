import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Brush } from 'recharts';
const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

export default class BarGraph extends React.Component {
    render() {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={this.props.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                    layout={this.props.layout}
                    
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={this.props.dataKey[0]} stackId="a" fill="#8884d8" />
                    <Bar dataKey={this.props.dataKey[1]} stackId="a" fill="#82ca9d" />
                    <Bar dataKey={this.props.dataKey[2]} stackId="a" fill="#cbf2f1" />
                </BarChart>
            </ResponsiveContainer>
        )
    }
}
export const BrushGraph = ({data}) => 
    <BarChart width={600} height={300} data={data}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
        <ReferenceLine y={0} stroke='#000' />
        <Brush dataKey='name' height={30} stroke="#8884d8" />
        <Bar dataKey="c" fill="#8884d8" />
        <Bar dataKey="m" fill="#82ca9d" />
        <Bar dataKey="d" fill="#cbf2f1" />
    </BarChart>