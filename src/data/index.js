import R from 'ramda';
import moment from 'moment';

/* Utils */

// mapKeys :: (k -> k) -> Object -> Object
const mapKeys = R.curry((fn, obj) =>
  R.fromPairs(R.map(R.adjust(fn, 0), R.toPairs(obj))));

// mapValues :: (v -> v) -> Object -> Object
const mapValues = R.curry((fn, obj) =>
  R.fromPairs(R.map(R.adjust(fn, 1), R.toPairs(obj))));

// listifyValues :: {k: v} -> {k: [v]}
const listifyValues = mapValues(R.prepend(R.__, []));

// concatValues :: {k: [v]} -> {k: [v]} -> {k: [v]}
const concatValues = R.mergeWith(R.concat);

const transformDate = R.curry((unit, date) => moment(date).startOf(unit).toISOString());

/* Transforms */

// type Data = {time:{user:{edit},...}

// getEdits :: Data -> [{edits}]
const getEdits = R.pipe(R.values, R.map(R.values), R.flatten);

// getEditsByUser :: Data -> {user:[{edits}]}
const getEditsByUser = R.pipe(R.values, R.map(listifyValues), R.reduce(concatValues, {}));

// getEditsByTime :: Data -> {time:[{edits}]}
const getEditsByTime = R.curry((unit) =>
    R.pipe(R.toPairs,
        R.map(([date, edits]) => R.fromPairs([[transformDate(unit)(date), R.values(edits)]])),
        R.reduce(concatValues, {})));

export default class Data {
    constructor(data) {
        this._data = data;

        this._edits  = getEdits(data);
        this._byUser = getEditsByUser(data);
        this._byDay = getEditsByTime('day')(data);
        this._byWeek = getEditsByTime('week')(data);
        this._byMonth = getEditsByTime('month')(data);
        this._byYear = getEditsByTime('year')(data);
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
    getByTime() {
        return null;
    }
}
