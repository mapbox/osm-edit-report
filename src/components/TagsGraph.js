import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { abbreviateNumber } from '../helper';
import Section from './Section';

export default function TagsGraph({ data }) {
    if (!data) return null;
    const byEdits = data.getEdits();
    const {tagsCreated, tagsModified, tagsDeleted} = byEdits;
    const tagsSum = tagsCreated + tagsModified + tagsDeleted
    const format = data.topTagsFormat(byEdits).slice(0, 5);
    return (
        <Section
            title="Tags"
            titleBottom={`Total: ${abbreviateNumber(tagsSum)}`}
            titleRight="&nbsp;">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={format}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" dataKey="count" />
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
