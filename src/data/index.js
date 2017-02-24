import R from 'ramda';
import moment from 'moment';
import dataTeam from 'mapbox-data-team';

var usernames = dataTeam.getUsernames();
/* Utils */
// mapValues :: (v -> v) -> Object -> Object
const mapValues = R.curry((fn, obj) =>
    R.fromPairs(R.map(R.adjust(fn, 1), R.toPairs(obj))));

// {k: [v]} -> {k: [v]} -> {k: [v]}
const concatValues = R.mergeWith(R.concat);

const transformDate = R.curry((unit, date) => moment(date).startOf(unit).utc().format());

// data -> [names]
const getAllUserNames = R.compose(R.uniq, R.flatten, R.map(R.keys), R.values);

// name -> data -> [{edits}]
const getEditsByName = (name) => R.compose(sumEditObjs, R.filter(R.identity), R.pluck(name), R.values);

/* Transforms */

// type Data = {time:{user:{edit},...}
// getEdits :: Data -> [{edits}]
const getEdits = R.pipe(R.values, R.map(R.values), R.flatten);

// getEditsByUser :: Data -> {user:[{edits}]}
const getEditsByUser = (data) => R.zipObj(
        usernames, 
        R.juxt(usernames.map(getEditsByName))(data)
    );

// getEditsByTime :: Data -> {time:[{edits}]}
const getEditsByTime = (unit) =>
    R.pipe(R.toPairs,
        R.map(([date, edits]) => R.fromPairs([[transformDate(unit)(date), R.values(edits)]])),
        R.reduce(concatValues, {}),
        mapValues(sumEditObjs));

// [{edit}] -> {editSummed}
function sumEditObjs(editArray) {
    var infoKeys = ['nodes', 'ways', 'relations', 'tags_created', 'tags_modified', 'tags_deleted', 'changesets'];
    const pluck = R.map(R.pluck, infoKeys);
    // adds an array of similar object [{obj}] -> {obj}
    const addSameObjs = R.reduce(R.mergeWith(R.add), {});
 
    
    let zip = R.zipObj(infoKeys, R.juxt(pluck)(editArray))
    // zip = nodes: {c,m,d}, ways: {c,m,d}, rel: {c,m,d}
    const nodes = addSameObjs(zip.nodes);
    const ways = addSameObjs(zip.ways);
    const relations = addSameObjs(zip.relations);
    const objects = addSameObjs([nodes, ways, relations]);


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
    return {
        nodes,
        ways,
        relations,
        objects,
        changesets: R.flatten(zip.changesets).length,
        tagsModified: getTags(zip.tags_modified),
        tagsChanged: getTags(zip.tags_created),
        tagsDeleted: getTags(zip.tags_deleted)
    };
}

export default class Data {
    constructor(data) {
        this._data = data;
        this._edits  = getEdits(data);
        this._byUser = getEditsByUser(data);
        this._byTime = {
            day: getEditsByTime('day')(data),
            week: getEditsByTime('week')(data),
            month: getEditsByTime('month')(data),
        }
        window.data = this;
    }
    getAllUsers() {
        return this._byUser;
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
    // graph specific getters
    objectType(key, data) {
        
    }

    timeFormatCMD(data, key) {
        return R.keys(data).map((d) => {
            return {
                name: moment(d).format('DD MMM'),
                c: data[d][key].c,
                m: data[d][key].m,
                d: data[d][key].d
            }
        }).sort((a, b) => a.name.localeCompare(b.name));
    
    }

    timeFormatTags(data) {
        return R.keys(data).map((d) => {
            return {
                name: moment(d).format('DD MMM'),
                c: data[d].tagsChanged,
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
                c: data[d].tagsChanged,
                m: data[d].tagsModified,
                d: data[d].tagsDeleted
            }
        }).sort((a, b) => a.c + a.m + a.d - b.c - b.m - b.d)
            .filter(a => a.c + a.m + a.d > 3);
    }
}

