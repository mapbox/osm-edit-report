export function setUserFilter(filter) {
    return {
        type: 'SET_USER_FILTER',
        filter
    };
}

export function setTagFilter(filter) {
    return {
        type: 'SET_TAG_FILTER',
        filter
    };
}

export function setTimeFilter(filter) {
    return {
        type: 'SET_TIME_FILTER',
        filter
    };
}

export function setBboxFilter(filter) {
    return {
        type: 'SET_BBOX_FILTER',
        filter
    };
}