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
        console.log(_d.toISOString())
        this.setState({dateFrom: _d});
    }
    onChangeTo = (_d) => {
        console.log(_d.toISOString())
        this.setState({ dateTo: _d});
    }
    handleClick = () => {
        let filterValues = this.props.filterValues;
        filterValues.dateFrom = this.state.dateFrom;
        filterValues.dateTo = this.state.dateTo;
        this.props.onChange(filterValues)
    }
    render() {

        return (
            <div className="flex-parent flex-parent--column space-around">
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
                <span className="txt-xs pl6">* Please note time is in UTC. This is {(moment().utcOffset()) / 60 } hours of your local time.
                </span>

            </div>
        )
    }
}