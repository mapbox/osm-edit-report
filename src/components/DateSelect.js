import DatePicker from 'react-datepicker';
import React from 'react';
import moment from 'moment';
export default class DateSelect extends React.Component {
    onChangeFrom = (_d) => {
        const d = moment(_d.toISOString());
        let filterValues = this.props.filterValues;
        filterValues.dateFrom = d.startOf('day');
        this.props.onChange(filterValues);
    }
    onChangeTo = (_d) => {
        const d = moment(_d.toISOString());
        let filterValues = this.props.filterValues;
        if (d.startOf('day').isSame(moment(), 'day')) {
            filterValues.dateTo = moment().endOf('hour');
            console.log(filterValues.dateTo.toISOString())
        } else {
            filterValues.dateTo = d.clone().endOf('day');
        }
        this.props.onChange(filterValues)
    }
    render() {
        const dateFrom = moment(this.props.filterValues && this.props.filterValues.dateFrom.toISOString());
        const dateTo = moment(this.props.filterValues && this.props.filterValues.dateTo.toISOString());
        
        return (
            <div className="flex-parent flex-parent--row space-around">
                <DatePicker
                    className="input my6 w-full"
                    selectsStart
                    selected={dateFrom}
                    startDate={dateFrom}
                    placeholderText="Enter from"
                    endDate={dateTo}
                    onChange={this.onChangeFrom}
                />
                <DatePicker
                    selectsEnd
                    className="input my6 w-full"
                    placeholderText="Enter To"
                    selected={dateTo}
                    startDate={dateFrom}
                    endDate={dateTo}
                    onChange={this.onChangeTo}
                    onBlur={this.props.onBlur}
                />
            </div>
        )
    }
}