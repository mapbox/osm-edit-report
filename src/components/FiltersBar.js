import React from "react";
import debounce from "lodash.debounce";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';

const DateField = ({ input }) => {
    const { value, onChange } = input;
    return (
        <DatePicker
            selected={value}
            onChange={onChange}
        />
    )
};

class FiltersBar extends React.Component {
    render() {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit} className="border border--gray-light p12 round-b border-t--0">
                <nav>
                    <div className="flex-parent flex-parent--row space-between">
                        <div className="flex-child">
                            <Field className="input" placeholder="Users" component="input" type="text" name="users" />
                        </div>
                        <div className="flex-child">
                            <Field className="input" placeholder="Tags" component="input" type="text" name="tags" />
                        </div>
                        <div className="flex-child"> 
                            <Field component={DateField} placeholder="From" name="dateFrom" />
                        </div>
                        <div className="flex-child">
                            <Field component={DateField} placeholder="To" name="dateTo" />
                        </div>
                        <div className="flex-child">
                            <Field className="input" placeholder="Bbox" component="input" type="text" name="bbox" />
                        </div>
                    </div>
                    <button type="submit">Submit</button>
                </nav>
            </form>
        )
    }
    
}

FiltersBar = reduxForm({
    form: "filters"
})(FiltersBar);

export default FiltersBar;

