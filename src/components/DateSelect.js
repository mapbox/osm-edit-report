// import DatePicker from 'react-datepicker';
import React from 'react';
import moment from 'moment';
import { PillButton } from './PillButton';
import 'react-day-picker/lib/style.css';
import DayPicker, { DateUtils } from 'react-day-picker';

export class DateSelect extends React.Component {
  //   constructor(props) {
  // super(props);
  // this.state = {
    // dateFrom: moment(
    //   props.filterValues && props.filterValues.dateFrom.toISOString()
    // ),
    // dateTo: moment(
    //   props.filterValues && props.filterValues.dateTo.toISOString()
    // )
  // };
  //   }
  onChangeFrom = date => {
    // let dateFrom = _d.clone().toISOString();
    // dateFrom = dateFrom.slice(0, dateFrom.indexOf('T')) + 'T00:00:00.000Z';
    // dateFrom = moment(dateFrom);
    // console.log(dateFrom.clone().toISOString());
    console.log('here', date.clone().toISOString());
    // this.setState({ dateFrom: date.clone() });
  };
  onChangeTo = date => {
    // let dateTo = _d.clone().toISOString();
    // console.log(dateTo);
    // dateTo = dateTo.slice(0, dateTo.indexOf('T')) + 'T23:59:59.000Z';
    // dateTo = moment(dateTo);
    // console.log(dateTo.clone().toISOString())
    console.log(date.clone().toISOString());
    // this.setState({ dateTo: date.clone() });
  };
  handleClick = () => {
    let filterValues = this.props.filterValues;
    filterValues.dateFrom = this.state.dateFrom;
    filterValues.dateTo = this.state.dateTo;
    this.props.onChange(filterValues);
  };
  handleDayClick = day => {
    console.log(day.toISOString());
    this.setState({
      selectedDay: day
    });
  };

  render() {
    return (
      <div className="flex-parent flex-parent--column space-around">
        <div className="flex-parent flex-parent--row space-around">
          <RangePicker />
        </div>

      </div>
    );
  }
}
const initialState = {
  from: null,
  to: null,
  enteredTo: null // Keep track of the last day for mouseEnter.
};

function isSelectingFirstDay(from, to, day) {
  const firstDayIsNotSelected = !from;
  const selectedDayIsBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
  const rangeIsSelected = from && to;
  return (
    firstDayIsNotSelected || selectedDayIsBeforeFirstDay || rangeIsSelected
  );
}

export default class RangePicker extends React.Component {
  state = {
    from: this.props.filterValues && this.props.filterValues.dateFrom && this.props.filterValues.dateFrom.toDate(),
    to: this.props.filterValues && this.props.filterValues.dateTo && this.props.filterValues.dateTo.toDate(),
    enteredTo: this.props.filterValues && this.props.filterValues.dateTo && this.props.filterValues.dateTo.toDate(),
  }

  handleApply = () => {
    let filterValues = this.props.filterValues;
   console.log( moment(this.state.from).toISOString());
    this.props.onChange({
      ...filterValues,
      dateFrom: moment(this.state.from),
      dateTo: moment(this.state.to)
    });
  };
  handleDayClick = day => {
    const { from, to } = this.state;

    if (from && to && day >= from && day <= to) {
      this.reset();
      return;
    }

    if (isSelectingFirstDay(from, to, day)) {
      this.setState({
        from: moment(day).subtract(12, 'hour').toDate(),
        to: null,
        enteredTo: null
      });
    } else {
      this.setState({
        to: moment(day).add(719, 'minute').toDate(),
        enteredTo: moment(day).add(719, 'minute').toDate()
      });
    }
  };

  handleDayMouseEnter = day => {
    const { from, to } = this.state;

    if (!isSelectingFirstDay(from, to, day)) {
      this.setState({
        enteredTo: day
      });
    }
  };

  reset = () => {
    this.setState(initialState);
  };

  render() {
    const { from, to, enteredTo } = this.state;
    const modifiers = { start: from, end: enteredTo };
    const disabledDays = { before: this.state.from };
    const selectedDays = [from, { from, to: enteredTo }];
    return (
      <div className="flex-parent flex-parent--column  flex-parent--center-cross">
        <div className="flex-child">
          {!from && !to && <p>Please select the <strong>first day</strong>.</p>}
          {from && !to && <p>Please select the <strong>last day</strong>.</p>}
        </div>
        <div className="flex-parent flex-parent--row space-around">
          <DayPicker
            className="Range"
            numberOfMonths={2}
            toMonth={new Date()}
            fixedWeeks
            selectedDays={selectedDays}
            disabledDays={disabledDays}
            modifiers={modifiers}
            onDayClick={this.handleDayClick}
            onDayMouseEnter={this.handleDayMouseEnter}
          />
        </div>
        {from &&
          to &&
          <p className="txt-s align-center">
            <span className="txt-bold">Local: {moment(from).format('Do MMM h:mma')} to</span>
            <span className="txt-bold">
             &nbsp;{moment(enteredTo).format('Do MMM h:mma z')}
            </span>
          </p>}
           {from &&
          to &&
          <p className="txt-s align-center">
            <span className="txt-em">UTC:&nbsp;
              {moment(from).clone().utc().format('Do MMM h:mma')} to
            </span>
            <span className="txt-em">
              {' '}{moment(enteredTo).clone().utc().format('Do MMM h:mma')}
            </span>.

          </p>}
        <span className="txt-xs pl6">
          * Please note time in UTC is {moment().utcOffset() / 60}{' '}
          hours of your local time.
        </span>
        <div className="block align-center mt12">
          <PillButton classes="mx6" onClick={this.reset}>
            Reset
          </PillButton>
          <PillButton disable={!(from && to)} classes="mx6" onClick={this.handleApply}>
            Apply
          </PillButton>
        </div>
      </div>
    );
  }
}
