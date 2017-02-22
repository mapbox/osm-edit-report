import DatePicker from 'react-datepicker';
import React from 'react';

export default class DateSelect extends React.Component {
    onChangeFrom = (d) => {
        let filterValues = this.props.filterValues;
        filterValues.dateFrom = d;
        this.props.onChange(filterValues);
    }
    onChangeTo = (d) => {
        let filterValues = this.props.filterValues;
        filterValues.dateTo = d;
        this.props.onChange(filterValues)
    }
    render() {
        const dateFrom = this.props.filterValues && this.props.filterValues.dateFrom;
        const dateTo = this.props.filterValues && this.props.filterValues.dateTo;
        
        return (
            <div>
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
                />
            </div>
        )
    }
}