import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import Select, { AsyncCreatable } from 'react-select';
import { Field, reduxForm } from 'redux-form';
import debounce from 'lodash.debounce';
import dataTeam from 'mapbox-data-team';

const DateField = ({ input }) => {
    const { value, onChange } = input;
    return (
        <DatePicker
            selected={value}
            onChange={onChange}
        />
    )
};

class UsersField extends React.Component{
    constructor(props) {
        super(props);
        this.options = dataTeam.getEverything().map(n => ({ name: n.fullname, value: n.username }));
    }
    onChange = (values) => {
        let _values = values.map(v => v.value).join(',');
        this.props.input.onChange(_values);
    }
    render() {
        const { value } = this.props.input;
        console.log(value);
        const data = dataTeam.getEverything();
        const _value = value  && value.split(',').map(v => {
            let name;
            let match = data.filter(d => d.username === v)[0];
            if (!match) {
                name = v
            } else {
                name = match.fullname
            }
            return {
                name,
                value: v
            };
        });
        console.log(_value);
        return (
            <Select
                multi
                value={_value}
                options={this.options}
                onChange={this.onChange}
                valueKey="value"
                labelKey="name"
            />
        );
    }
}
class TagSelect extends React.Component {
    constructor(props) {
        super(props);
        this.getTags = debounce(this.getTags.bind(this), 1000);
    }
    fetchTags(query) {
        var url = `https://taginfo.openstreetmap.org/api/4/keys/all?page=1&query=${query}&rp=20&sortname=count_nodes&sortorder=desc`
        return fetch(url)
            .then(d => d.json())
            .catch(e => console.log(e));
    }
    getTags(input, callback) {
        input = input.toLowerCase();
        if (input === '') return callback();
        this.fetchTags(input)
            .then((d) => {
                const data = {
                    options: d.data.map(i => ({ tag: i.key + '=*', value: i.key + '=*'})),
                    complete: true
                }
                callback(null, data);
            });
        
    }
    _onChange = (values) => {
        let _values = values.map(v => v.value).join(',');
        console.log(values, _values);
        this.props.input.onChange(_values);
    }
    render() {
        const { value } = this.props.input;
        const _value = value && value.split(',').map(v => ({value: v, tag: v}));
        return (
            <div>
                <AsyncCreatable
                    multi
                    value={_value}
                    onChange={this._onChange}
                    valueKey="value"
                    labelKey="tag"
                    loadOptions={this.getTags} />
            </div>
        )
    }
}

class FiltersBar extends React.Component {
    render() {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit} className="border border--gray-light p12 round-b border-t--0">
                <nav>
                    <div className="flex-parent flex-parent--row space-between">
                        <div className="flex-child">
                            <Field component={UsersField} placeholder="Users" name="users" />
                        </div>
                        <div className="flex-child">
                            <Field component={TagSelect} placeholder="Tags" name="tags" />
                        </div>
                        <div className="flex-child"> 
                            <Field component={DateField} placeholder="From" name="dateFrom" />
                        </div>
                        <div className="flex-child">
                            <Field component={DateField} placeholder="To" name="dateTo" />
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

