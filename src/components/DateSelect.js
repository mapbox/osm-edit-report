import DatePicker from 'react-datepicker';
import React from 'react';
import moment from 'moment';
import {PillButton} from './PillButton';
export default class DateSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateFrom: moment(props.filterValues && props.filterValues.dateFrom.toISOString()),
            dateTo: moment(props.filterValues && props.filterValues.dateTo.toISOString())
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            dateFrom: moment(nextProps.filterValues && nextProps.filterValues.dateFrom.toISOString()),
            dateTo: moment(nextProps.filterValues && nextProps.filterValues.dateTo.toISOString())
        });
    }
    onChangeFrom = (_d) => {
        const d = moment(_d.toISOString());
        this.setState({dateFrom: d.startOf('day').add(0.5, 'hour')});
    }
    onChangeTo = (_d) => {
        const d = moment(_d.toISOString());
        let dateTo;
        if (d.startOf('day').isSame(moment(), 'day')) {
            dateTo = moment().endOf('hour');
        } else {
            dateTo = d.clone().endOf('day').subtract(0.5, 'hour')
        ;
        }
        this.setState({dateTo});
    }
    handleClick = () => {
        let filterValues = this.props.filterValues;
        filterValues.dateFrom = this.state.dateFrom;
        filterValues.dateTo = this.state.dateTo;
        this.props.onChange(filterValues)
    }
    render() {

        return (
            <div className="flex-parent flex-parent--row space-around">
                <DatePicker
                    className="input my6 w-full"
                    selectsStart
                    selected={this.state.dateFrom}
                    startDate={this.state.dateFrom}
                    placeholderText="Enter from"
                    endDate={this.state.dateTo}
                    onChange={this.onChangeFrom}
                    maxDate={moment()}
                />
                <DatePicker
                    selectsEnd
                    className="input my6 w-full"
                    placeholderText="Enter To"
                    selected={this.state.dateTo}
                    startDate={this.state.dateFrom}
                    endDate={this.state.dateTo}
                    onChange={this.onChangeTo}
                    maxDate={moment()}
                />
                <div className="block align-center mt12">
                    <PillButton classes="mx6" onClick={this.handleClick}>Apply</PillButton>
                </div>
            </div>
        )
    }
}