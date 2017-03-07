import React from 'react';
import moment from 'moment';
import {abbreviateNumber} from '../helper';
import {Table, Column, Cell } from 'fixed-data-table-2';
import Section from './Section';
import R from 'ramda';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import ProfilePic from './ProfilePic';
import { PillButton } from './PillButton';
import DataTeam from 'mapbox-data-team';
const dataTeam = R.zipObj(R.pluck('username', DataTeam.getEverything()), DataTeam.getEverything());

var SortTypes = {
    ASC: 'ASC',
    DESC: 'DESC',
};
function isObject(val) {
    return (typeof val === 'object');
}
function reverseSortDirection(sortDir) {
    return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}
function sumCdm(cdm) {
    if (typeof cdm === 'number') return cdm;
    return (cdm.c || 0) +( cdm.d || 0)+ (cdm.m || 0);
}
function getTodayIcon(avg, latestEdits) {
    if (latestEdits >=  1.2 * avg && latestEdits !== 0) {
        return <svg className='icon inline color-green'><use xlinkHref='#icon-chevron-up' /></svg>;
    }
    else if (latestEdits < 0.5 * avg && latestEdits !== 0) {
        return <svg className='icon inline color-red'><use xlinkHref='#icon-chevron-down' /></svg>;
    } else {
        return null;
    }
}
class SortHeaderCell extends React.Component {
    render() {
        var {sortDir, children, onSortChange, ...props} = this.props;
        return (
            <Cell {...props}>
                <a onClick={this._onSortChange} className="cursor-pointer">
                    {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
                </a>
            </Cell>
        );
    }

    _onSortChange = (e) => {
        e.preventDefault();
        if (this.props.onSortChange) {
            this.props.onSortChange(
                this.props.columnKey,
                this.props.sortDir ?
                    reverseSortDirection(this.props.sortDir) :
                    SortTypes.DESC
            );
        }
    }
}
const ImageCell = ({rowIndex, data, ...props}) => (
    <div style={{ paddingLeft: 4.5, paddingTop: 4.5, height: 45 }} className={`border border--1 border--gray-light border-t--0 border-l--0 border-r--0 ${rowIndex % 2 ? 'bg-white' : ''}`}>
        <ProfilePic
            src={`https://github.com/${dataTeam[data.getObjectAt(rowIndex)[0]].github}.png`}
        />
    </div>
);

const NumberCell = ({rowIndex, data, dataType,range,  columnKey, ...props}) => {
    const userEdits = data.getObjectAt(rowIndex)[1]; // { time: {editObj}}
    const userEditsForCol = userEdits && userEdits[columnKey];
    let cell = 0;
    let raw = 0;
    if (userEditsForCol) {
        cell = userEditsForCol[dataType];
        if (dataType === 'objects') {
            cell = cell.c + cell.m + cell.d;
        }
        raw = cell;
        cell = abbreviateNumber(cell);
    }
    return (
        <Cell {...props} className={`color-gray-dark align-center border border--1 border--gray-light border-t--0 border-l--0 border-r--0`} style={{ backgroundColor: range(raw) }}>
            {cell}
        </Cell>
    )
};
const TextCell = ({rowIndex, data, columnKey, ...props}) => {
    let cell = data.getObjectAt(rowIndex)[columnKey];
    
    return (
        <Cell style={{ textAlign: 'center' }} {...props} className={rowIndex % 2 ? 'bg-white' : ''}>
            {cell}
        </Cell>
    );
};
const OsmCell = ({rowIndex, data, ...props}) => {
    let cell = data.getObjectAt(rowIndex);
    return (
        <Cell {...props} className={`border border--1 border--gray-light border-t--0 border-l--0 border-r--0 ${rowIndex % 2 ? 'bg-white' : ''}`}>
            <a href={`https://www.openstreetmap.org/user/${cell[0]}`} className="link link--gray">{cell[0]}</a>
            {getTodayIcon(cell[2], cell[4])}
        </Cell>
    );
};

const TopTagsCell = ({rowIndex, data, columnKey, ...props}) => {
  
    return (
        <Cell {...props} className={`border border--1 border--gray-light border-t--0 border-l--0 border-r--0 ${rowIndex % 2 ? 'bg-white' : ''}`}>
            {null}
        </Cell>
    );
};
   

class DataListWrapper {
    constructor(indexMap, data) {
        this._indexMap = indexMap;
        this._data = data;
    }

    getSize() {
        return this._indexMap.length;
    }

    getObjectAt(index) {
        return this._data[
            this._indexMap[index]
        ];
    }
}


class MyTable extends React.Component {
    constructor(props) {
        super(props);
        const allUsers = this.props.data;
        this._defaultSortIndexes = R.range(0, allUsers.length);
        this._dataList = new DataListWrapper(R.range(0, allUsers.length), allUsers);
        this.state = {
            sortedDataList: this._dataList,
            colSortDirs: {
                'username': 'DESC'
            },
        };
        this._onSortChange = this._onSortChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const allUsers = nextProps.data;
        this._dataList = new DataListWrapper(R.range(0, allUsers.length), allUsers);
        this.setState({
            sortedDataList: this._dataList,
            colSortDirs: {
                'username': 'DESC'
            }});
    }
   
    _onSortChange(columnKey, sortDir) {
        function usernameSort(a, b) {
            var valueA = this._dataList.getObjectAt(a)[0];
            var valueB = this._dataList.getObjectAt(b)[0];
            return valueA.localeCompare(valueB);
        }
        function cmdSort(a, b) {
            let valueA = 0;
            let valueB = 0;
    
            const userEditsA = this._dataList.getObjectAt(a)[1]; // { time: {editObj}}
            let userEditsForColA = userEditsA && userEditsA[columnKey];
            if (userEditsForColA) {
                valueA = userEditsForColA[this.props.dataType];
                if (this.props.dataType === 'objects') {
                    valueA = valueA.c + valueA.m + valueA.d;
                }
            }

            const userEditsB = this._dataList.getObjectAt(b)[1]; // { time: {editObj}}
            let userEditsForColB = userEditsB && userEditsB[columnKey];
            if (userEditsForColB) {
                valueB = userEditsForColB[this.props.dataType];
                if (this.props.dataType === 'objects') {
                    valueB = valueB.c + valueB.m + valueB.d;
                }
            }
  
            let sortVal = 0;
            if (valueA > valueB) {
                sortVal = 1;
            }
            if (valueA < valueB) {
                sortVal = -1;
            }
            return sortVal;
        }
        var sortIndexes = this._defaultSortIndexes.slice();
        sortIndexes.sort((indexA, indexB) => {
            var sortVal = 0;
            if (columnKey === 'username') {
                sortVal = usernameSort.call(this, indexA, indexB);
            } else if (this.props.dataType === 'objects') {
                sortVal = cmdSort.call(this, indexA, indexB);
            } else {
                var valueA = this._dataList.getObjectAt(indexA)[columnKey];
                var valueB = this._dataList.getObjectAt(indexB)[columnKey];
                if (valueA > valueB) {
                    sortVal = 1;
                }
                if (valueA < valueB) {
                    sortVal = -1;
                }
            }
    
            if (sortVal !== 0 && sortDir === SortTypes.ASC) {
                sortVal *= -1;
            }

            return sortVal;
        });

        this.setState({
            sortedDataList: new DataListWrapper(sortIndexes, this._dataList._data),
            colSortDirs: {
                [columnKey]: sortDir,
            },
        });
    }

    render() {
        var {sortedDataList, colSortDirs} = this.state;
        return (
            <Table
                rowHeight={45}
                rowsCount={sortedDataList.getSize()}
                headerHeight={60}
                width={this.props.containerWidth}
                height={Math.max(document.body.clientWidth/2, 600)}
                touchScrollEnabled={true}
                >
                <Column
                    header={<SortHeaderCell className="bg-white color-gray"/>}
                    cell={<ImageCell data={sortedDataList} col="avatar" />}
                    fixed={true}
                    width={45}
                />
                <Column
                    columnKey="username"
                    header={
                        <SortHeaderCell
                            onSortChange={this._onSortChange}
                            className="bg-white color-gray"
                            sortDir={colSortDirs.username}>
                            Username
                        </SortHeaderCell>
                    }
                    cell={<OsmCell data={sortedDataList} />}
                    width={160}
                />
                {
                    this.props.timeKeys.map(t => 
                        <Column
                            key={t}
                            columnKey={t}
                            header={
                                <Cell
                                    style={{ textAlign: 'center' }}
                                    className="bg-white color-gray">
                                    {moment(t).format(this.props.timeFormat)}
                                </Cell>
                            }
                            cell={<NumberCell range={this.props.range} dataType={this.props.dataType} data={sortedDataList} style={{ textAlign: 'center' }} />}
                            width={75}
                            flexGrow={1}
                        />
                    )
                }
              
            </Table>
        );
    }
}
MyTable = Dimensions()(MyTable);

export default class UserTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 'day',
            type: 'objects'
        }
        this.notEmpty = R.compose(R.not, R.isEmpty);
        this.flatten = R.curry((dataType, data) => R.compose(R.unnest, R.values, R.pluck(dataType))(data));
    }
    onChangeHour = () => {
        this.setState({
            time: this.state.time === 'day' ? 'hour' : 'day'
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
    // [[uname, edit, avg, max]] => hslColorFunc
    findMaxColor(metrics) {
        var maxUsers = metrics.map(d => d[3]);
        return this.mapper(0, R.apply(Math.max, maxUsers));
    }
    // ([uname, edit], timeKeysLen) => [[name, edit, avg, max]]
    findUserMetrics(byUsers, timeKeys) {
        const findNLatestEdit = (n, d) => {
            const timeEntry = timeKeys[timeKeys.length - n]; 
            var edit = d[1][timeEntry];
            return edit ? sumCdm(edit[this.state.type]) : 0;
        }
        return byUsers.map(d => {
            let flat = this.flatten(this.state.type, d[1]);
            const hourSinceDayStart = moment().hour();
            const latestPerformance = (hourSinceDayStart / 24) * findNLatestEdit(1, d) + ((24 - hourSinceDayStart)/24)* findNLatestEdit(2,d);
            
            if (this.state.type === 'objects') {
                flat = R.compose(R.unnest, R.map(R.values))(flat);
            }

            const avg = parseInt(R.sum(flat) / timeKeys.length, 10);
            
            return [d[0], d[1], avg, R.apply(Math.max, flat), latestPerformance];
        });
    }
    findAvg(metrics) {
        var avgUsers = metrics.map(d => d[2])
        let avg = parseInt(R.sum(avgUsers) / avgUsers.length, 10);
        return abbreviateNumber(avg);
    }
    mapper(min, max) {
        const color = {
            h:213, s:27, l:60
        };
        let m = 0;
        if (max !== 0) {
            m = (color.l - 100)/Math.sqrt(max);
        }
        return (val) => {
            return `hsl(${color.h}, ${color.s}%, ${m*Math.sqrt(val) + 100}%)`;
        }
    }
    render() {
        const data = this.props.data;
        if (!data) return null;
        const byUsers = R.toPairs(data.getByUsersByTime(this.state.time)).sort((a, b) => a[0].localeCompare(b[0])).filter(a => this.notEmpty(a[1]));
        const isHour = this.state.time === 'hour';
        const isDay = this.state.time === 'day';
        const isObjects = this.state.type === 'objects';
        const isChangesets = this.state.type === 'changesets';
        let timeKeys = Object.keys(data.getByTime(this.state.time))
            .sort((a, b) => moment(a).diff(moment(b)));
        const metrics = this.findUserMetrics(byUsers, timeKeys);

        let timeFormat = 'DD MMM';

        if (isHour) {
            timeFormat = 'MM/DD HH:00';
            timeKeys = R.takeLast(48, timeKeys);
        }
        const range = this.findMaxColor(metrics);
        const buttons = (
            <div>
                <div className="flex-parent-inline mx12-mm mx12-ml mx12-mxl">
                    <PillButton active={isObjects} onClick={this.onChangeObjects} classes='btn--pill-hl'>Objects</PillButton>
                    <PillButton active={isChangesets} onClick={this.onChangeChangeSets} classes='btn--pill-hr'>Changesets</PillButton>

                </div>
                <div className="flex-parent-inline mt6">
                    <PillButton active={isHour} onClick={this.onChangeHour} classes='btn--pill-hl'>Hourly</PillButton>
                    <PillButton active={isDay} onClick={this.onChangeHour} classes='btn--pill-hr'>Daily</PillButton>
                </div>
            </div>
        );
        return (
            <Section title="Users"
                titleRightBottom={buttons}
                titleBottom={`Average: ${this.findAvg(metrics)}`}
                titleRight="&nbsp;"
            >
                <div className="mx18 mt18">
                    <MyTable range={range} data={metrics} timeKeys={timeKeys} timeFormat={timeFormat} dataType={this.state.type}/>
                </div>
            </Section>
        )
    }
}

