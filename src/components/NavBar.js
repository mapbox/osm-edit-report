import React from 'react';
import moment from 'moment';
const lastUpdated = moment();
function stickyHeader(sticky) {
    let nav = document.getElementsByTagName('nav')[0]
    if (!nav) return;
    nav = nav.getBoundingClientRect();
    if (sticky) {
        return {
            position: 'fixed',
            top: 0,
            right: document.body.clientWidth - nav.right,
            width: nav.width,
            left: nav.left,
            borderBottom: '1px solid #c6d2e1'
        }
    }
    return {
        width: nav.width,
    }
}
class LastUpdated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromNow: props.time.toNow(true)
        }
    }
    componentDidMount() {
        setInterval(() => {
            this.setState({
                fromNow: this.props.time.toNow(true)
            });
        }, 60 * 1000)
    }
    render() {
        return <span className="txt-xs pl6" >Last Updated {this.state.fromNow} ago</span>
    }
}
export default ({ toggleUsers, toggleTags, toggleDate, toggleBbox, selectedFilter, sticky, filters, loading, timeOfReceive }) => (
    <div className="px12 pt12">
        <nav>
            <div className="flex-parent flex-parent--row-ml  flex-parent--row-mxl flex-parent--column space-between">
                <div className="align-items--center flex-parent">
                    <div className="flex-child mb-logo mb-logo--gray-dark"/>
                    <span className="border-l border--2 txt-fancy color-gray txt-l inline-block pl12 ml12">OSM Edit Report</span>
                </div>
            </div>
            <div className="flex-parent flex-parent--row-reverse">
                <div className={`z5 flex-parent flex-parent--row  bg-white ${sticky ? '' : 'w-full'}`} style={stickyHeader(sticky)}>
                    <div className="flex-child flex-child--grow">
                        {!loading ? <LastUpdated time={timeOfReceive} /> : null}
                        <div className={`${loading ? 'loading' : ''} loading--s`} style={{ marginTop: 6 }}/>
                    </div>
                    <div className="flex-child flex-parent flex-parent--row">
                        <div className="header-filters flex-child">
                            <MyButton filled={filters.users} selectedFilter={selectedFilter} onClick={toggleUsers} >Users</MyButton>
                            <MyButton filled={filters.tags} selectedFilter={selectedFilter} onClick={toggleTags} >Tags</MyButton>
                            <MyButton filled={filters.dateFrom || filters.dateTo} selectedFilter={selectedFilter} onClick={toggleDate}>Date</MyButton>
                            <MyButton filled={filters.bbox} selectedFilter={selectedFilter} onClick={toggleBbox}>Bbox</MyButton>
                        </div>
                        <div className="header-button flex-child">
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
);


export const MyButton = ({children, onClick, selectedFilter, filled}) => {
    const type = children && children.toLowerCase();
    const active = selectedFilter === type;
    let color = !active ? 'bg-gray-faint-on-hover' : 'bg-gray-faint unround-b';
    let count = ''
    if (filled) {
        color = 'bg-gray-faint';
        if (type === 'users' || type === 'tags') {
            count = ' (' + filled.split(',').length + ')';
        }
    }

    return (
        <span>
            <a onClick={onClick} data-for={type} className={`cursor-pointer txt-s txt-capitalize-first color-gray inline-block txt-bold transition round mb6 mb0-mm px12 py6 mr6 ${color}`}>
                {children}{count}
            </a>
        </span>
    );
}

