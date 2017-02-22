import dataTeam from 'mapbox-data-team';
import React from 'react';
import Select from 'react-select';

export default class UsersSelect extends React.Component {
    constructor(props) {
        super(props);
        this.options = dataTeam.getEverything().map(n => ({ name: n.fullname, value: n.username }));
    }
    onChange = (users) => {
        let filterValues = this.props.filterValues;
        if (!users || users.length === 0) {
            filterValues.users = undefined;
        } else {
            let _users = users.map(v => v.value).join(',');
            filterValues.users = _users;
        }
        this.props.onChange(filterValues)
    }
    render() {
        const value = this.props.filterValues && this.props.filterValues.users;

        const data = dataTeam.getEverything();
        const _value = value && value.split(',').map(v => {
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
        return (
            <div>
                <Select
                    multi
                    value={_value}
                    options={this.options}
                    onChange={this.onChange}
                    valueKey="value"
                    labelKey="name"
                    placeholder="User filters"
                    autoBlur
                />
            </div>
        );
    }
}
