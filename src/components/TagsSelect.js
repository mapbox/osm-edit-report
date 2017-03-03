import { AsyncCreatable } from 'react-select';
import React from 'react';
import debounce from 'lodash.debounce';

export default class TagsSelect extends React.Component {
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
                    options: d.data.map(i => ({ tag: i.key + '=*', value: i.key + '=*' })),
                    complete: true
                }
                callback(null, data);
            });

    }

    onChange = (tags) => {
        let filterValues = this.props.filterValues;
        if (!tags || tags.length === 0) {
            filterValues.tags = undefined;
        } else {
            let _tags = tags.map(v => v.value).join(',');
            filterValues.tags = _tags;
        }
        this.props.onChange(filterValues)
    }

    render() {
        const value = this.props.filterValues && this.props.filterValues.tags;
        const _value = value && value.split(',').map(v => ({ value: v, tag: v }));
        return (
            <div>
                <AsyncCreatable
                    promptTextCreator={(label) => `Add ${label} tag`}
                    multi
                    autoBlur
                    value={_value}
                    onChange={this.onChange}
                    valueKey="value"
                    labelKey="tag"
                    placeholder="Tag filters"
                    loadOptions={this.getTags} />
            </div>
        )
    }
}