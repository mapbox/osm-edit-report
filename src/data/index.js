import R from 'ramda';
import moment from 'moment';
import dataTeam from 'mapbox-data-team';
window.R = R;
window.moment = moment;
var usernames = dataTeam.getUsernames();
var dataTeamEverything = dataTeam.getEverything();
function getOtherAcs(team) {
    var zipAcs = t => R.zip(R.pluck('username', t), R.pluck('other_accounts', t))
    return R.compose(R.fromPairs, R.map(x => [x[0], R.pluck('username', x[1])]), R.filter(u => u[1]), zipAcs)(team);
}
var dataTeamOtherAcs = getOtherAcs(dataTeamEverything);

window.usernames = usernames;

const renameKeysBy = R.curry((fn, obj) => R.pipe(R.toPairs, R.map(R.adjust(fn, 0)), R.fromPairs)(obj));

/* Utils */
// mapValues :: (v -> v) -> Object -> Object
const mapValues = R.curry((fn, obj) =>
    R.fromPairs(R.map(R.adjust(fn, 1), R.toPairs(obj))));

// {k: [v]} -> {k: [v]} -> {k: [v]}
const concatValues = R.mergeWith(R.concat);

const transformDate = R.curry((unit, date) => moment(date).startOf(unit).toISOString());

// data -> [names]
const getAllUserNames = R.compose(R.uniq, R.flatten, R.map(R.keys), R.values);

// name -> data -> [{edits}]
const getEditsByName = (name) => R.compose(sumEditObjs, R.filter(R.identity), R.pluck(name), R.values);

// name -> data -> [[time: {edits}]

/* Transforms */

// type Data = {time:{user:{edit},...}
// getEdits :: Data -> [{edits}]
const getEdits = R.pipe(R.values, R.map(R.values), R.flatten, sumEditObjs);

// getEditsByUser :: Data -> {user:[{edits}]}
const getEditsByAllUsers = (data) => R.zipObj(
        usernames, 
        R.juxt(usernames.map(getEditsByName))(data)
    );

// getEditsByTime :: Data -> {time:[{edits}]}
const getEditsByTime = (unit) =>
    R.pipe(R.toPairs,
        R.map(([date, edits]) => R.fromPairs([[transformDate(unit)(date), R.values(edits)]])),
        R.reduce(concatValues, {}));


const sumEditsByTime = R.curry((unit, data) => {
    return mapValues(sumEditObjs, getEditsByTime(unit)(data));
});
window.sumEditsByTime = sumEditsByTime;
// [{edit}] -> {editSummed}
function sumEditObjs(editArray) {
    var infoKeys = ['nodes', 'ways', 'relations', 'tags_created', 'tags_modified', 'tags_deleted', 'changesets'];
    const pluck = R.map(R.pluck, infoKeys);
    // adds an array of similar object [{obj}] -> {obj}
    const addSameObjs = R.curry((base, data) => R.reduce(R.mergeWith(R.add), base)(data));
    
    let zip = R.zipObj(infoKeys, R.juxt(pluck)(editArray))
    // zip = nodes: {c,m,d}, ways: {c,m,d}, rel: {c,m,d}
    const nodes = addSameObjs({c:0, m:0, d:0}, zip.nodes);
    const ways = addSameObjs({ c: 0, m: 0, d: 0 }, zip.ways);
    const relations = addSameObjs({ c: 0, m: 0, d: 0 }, zip.relations);
    const objects = addSameObjs({ c: 0, m: 0, d: 0 }, [nodes, ways, relations]);


    /**
     * Tags Struct
     * tags: [{
     *          osmTagKey: {
     *              osmTagValue1: value,
     *              osmTagValue2: value
     *          }
     *      }, {..}]
     * 
     */

    const get2ndLevelTags = R.compose(R.sum, R.flatten, R.map(R.values), R.values);
    const getTags = R.compose(R.sum, R.map(get2ndLevelTags));

    // sums all the tags and returns an array of summations
    const sumTags = R.compose(R.map(R.sum), R.map(R.values), R.values);

    // returns a key value pair of key and sum of all the values eg. {building: 45, lanes: 10}
    const zipTags = (obj) => R.zipObj(R.keys(obj), sumTags(obj));

    // sums up all the edit objects into one fat object
    const sumAllTags = R.compose(addSameObjs({}), R.map(zipTags));

    // sums up across tags_modified, tags_created...
    const sumAllTagTypes = (z) => addSameObjs({}, [
        sumAllTags(z.tags_modified),
        sumAllTags(z.tags_created),
        sumAllTags(z.tags_deleted)
    ]);

    const sortTopTags = R.compose(R.sort((a, b) => b[1] - a[1]), R.toPairs, sumAllTagTypes);

    const tagsModified = getTags(zip.tags_modified);
    const tagsDeleted = getTags(zip.tags_deleted);
    const tagsCreated = getTags(zip.tags_created);
    return {
        nodes,
        ways,
        relations,
        objects,
        changesets: R.flatten(zip.changesets).length,
        tagsModified,
        tagsCreated,
        tagsDeleted,
        tags: tagsModified + tagsCreated + tagsDeleted,
        topTags: sortTopTags(zip)
    };
}

// {{time: {edit}}} -> { {usernames: {{time: {edit}} }
function getEditsByUsersByTime(unit, data) {

    const groupByTime = R.groupBy(a => a[0]);

    // { time: ['timeStamp', editObject], time2: ['timeStamp', editObject]] => {time: editObject, time2: editObject}
    const removeUnwantedData = R.map(R.map(arr => arr[1]));


    const getEditsByTime = (unit) => {
        return R.compose(removeUnwantedData, groupByTime, R.map(d => [transformDate(unit)(d[0]), d[1]]), R.toPairs);
    }
    // ('hour; { time: [{editObjs}] }) note: the general sumEditsByTime takes ('hour; { time: {user: [{editObjs}]})
    const sumEditsByTime = R.curry((unit, data) => {
        return mapValues(sumEditObjs, getEditsByTime(unit)(data));
    });
    const pluckUsers = (username, data) => {
        const incBySecond = R.curry((n, x) => x.replace('00.000Z', `0${n}.000Z`));
        var usersData = R.pluck(username, data);
        const otherAcs = dataTeamOtherAcs[username] || [];
        
        // tiny hack which adds i seconds to timestamp to prevent main accs 
        // date key from colliding with other_accounts key
        var otherAcsData = otherAcs.map((ac, i) => {
            return R.compose(renameKeysBy(incBySecond(i)), R.filter(R.identity), R.pluck(ac))(data);
        });
      
        usersData = Object.assign(usersData, ...otherAcsData);
        return R.filter(R.identity, usersData);
    }
    const applySumEditsByTimeToUser = R.curry((username, data) => sumEditsByTime(
        unit, pluckUsers(username, data)));

    const applySumEditsByTimeToAllUsers = R.map(applySumEditsByTimeToUser, usernames);

    return R.zipObj(
        usernames,
        R.juxt(applySumEditsByTimeToAllUsers)(data)
    );
}
window.getEditsByUsersByTime = getEditsByUsersByTime;
export default class Data {
    constructor(data) {
        this._data = data;
        this._edits  = getEdits(data);
        this._dataTeam = dataTeam.getEverything();
        this._dataTeam = R.zipObj(R.pluck('username', this._dataTeam), this._dataTeam);

        this._byTime = {
            hour: sumEditsByTime('hour', data),
            day: sumEditsByTime('day', data),
            week: sumEditsByTime('week', data),
            month: sumEditsByTime('month', data),
        }
        this._byUser = {
            hour: getEditsByUsersByTime('hour', data),
            day: getEditsByUsersByTime('day', data),
            week: getEditsByUsersByTime('week', data),
            month: getEditsByUsersByTime('month', data),
        }

        window.data = this;
        window.getEditsByTime = getEditsByTime;
    }
    getByUsersByTime(t) {
        return this._byUser[t];
    }
    getRawData() {
        return this._data;
    }
    getTotals() {
        return R.reduce();
    }
    getByUser(username = []) {
        return null;
    }
    getByTime(t) {
        return this._byTime[t];
    }
    getEdits() {
        return this._edits;
    }

    // graph specific getters
    topTagsFormat = (data) => data.topTags.map(t => ({
        name: t[0],
        count: t[1]
    }))

    timeFormatChangesets(data, dateFormat) {
        return R.keys(data).map((d) => {
            return {
                name: moment(d).format(dateFormat),
                changesets: data.changesets.length,
                time: moment(d)
            }
        }).sort((a, b) => a.time.diff(b.time));
    }
    timeFormatEdits(data, key, dateFormat) {
        let format;
        if (key === 'changesets') {
            format = R.keys(data).map((d) => ({
                name: moment(d).format(dateFormat),
                c: data[d].changesets,
                time: moment(d)
            }));
        } else if (key === 'tags') {
            format = R.keys(data).map((d) => ({
                name: moment(d).format(dateFormat),
                c: data[d].tagsCreated,
                m: data[d].tagsModified,
                d: data[d].tagsDeleted,
                time: moment(d)
            }));
        } else {
            format = R.keys(data).map((d) => ({
                name: moment(d).format(dateFormat),
                c: data[d][key].c,
                m: data[d][key].m,
                d: data[d][key].d,
                time: moment(d)
            }));
        }
        return format.sort((a, b) => a.time.diff(b.time));
    
    }

    timeFormatTags(data) {
        return R.keys(data).map((d) => {
            return {
                name: moment(d).format('DD MMM'),
                c: data[d].tagsCreated,
                m: data[d].tagsModified,
                d: data[d].tagsDeleted
            }
        }).sort((a, b) => a.name.localeCompare(b.name));
    }

    userFormatAllObj(data, key) {
        return R.keys(data).map((d) => {
            return {
                name: d,
                c: data[d][key].c,
                m: data[d][key].m,
                d: data[d][key].d
            }
        }).sort((a, b) => a.c + a.m + a.d - b.c - b.m - b.d)
        .filter(a => a.c + a.m + a.d > 3);
    }

    userFormatAllTag(data) {
        return R.keys(data).map((d) => {
            return {
                name: d,
                c: data[d].tagsCreated,
                m: data[d].tagsModified,
                d: data[d].tagsDeleted
            }
        }).sort((a, b) => a.c + a.m + a.d - b.c - b.m - b.d)
            .filter(a => a.c + a.m + a.d > 3);
    }
}

