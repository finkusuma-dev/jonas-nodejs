"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myLog_1 = require("./myLog");
// interface APIFeaturesType<T> {
//   // model: ModelType<T>;
//   numberProps: Array<string>;
//   queryString: QueryString.ParsedQs;
//   query: QueryType<T>;
//   // fn(): this;
//   sortQuery(): this;
//   selectFieldsQuery(): this;
// }
class APIFeatures {
    // model: ModelType<T>,
    constructor(query, modelProps, modelNumberProps, queryString) {
        // this.model = model;
        this.query = query;
        this.modelProps = modelProps;
        this.modelNumberProps = modelNumberProps;
        this.queryString = queryString;
    }
    filter() {
        // const modelProps = Object.keys(model.schema.obj);
        const queryStr = Object.assign({}, this.queryString);
        /// Remove keys from queryString that are not in modelProps, i.e: sort, fields, page, & limit
        for (const [key] of Object.entries(this.queryString)) {
            // consoleLog(`key: ${key}, value: ${value}`);
            if (!this.modelProps.includes(key)) {
                /// delete prop from object
                delete queryStr[key];
            }
        }
        (0, myLog_1.consoleLog)('searchParams:', queryStr);
        /// Create advance filtering from queryString
        /// i.e:
        /// queryString = duration=gte:5,lte:9&price=lte:1000&difficuly=easy
        ///   becomes:
        ///   Object { duration: { '$gte': 5, '$lte': 9 }, price: { '$lte': 1000 }, 'difficult': 'easy' }
        ///
        let advFilters = {}; /// type of Object with key:string & value:any
        for (const [key, value] of Object.entries(queryStr)) {
            if (
            /// key is one of the modelNumberProps, i.e: ['duration','price']
            this.modelNumberProps.includes(key) &&
                /// and value has ":", i.e: gte:5
                String(value).indexOf(':') > -1) {
                /// Advance filtering for number,
                /// i.e: duration=gte:5,lte:9
                /// becomes Object { duration : { $gte: 5, $lte: 9 } }
                ///
                let numberFilters = {}; /// type of Object with key:strinng & value:number
                String(value)
                    .split(',')
                    .forEach((filterItem) => {
                    let filterKey = filterItem.split(':')[0]; /// i.e: 'gte'
                    const filterValue = filterItem.split(':')[1]; /// i.e: 5
                    /// convert i.e: 'gte' => '$gte'
                    filterKey = filterKey.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`);
                    /// insert filter key & value, i.e: Object { $gte: 5, $lte: 9 }
                    numberFilters[filterKey] = Number(filterValue);
                });
                /// insert key and numberFilters to advFilters
                /// i.e: Object { duration : { '$gte': 5, '$lte': 9 }, price : { '$lte': 1000 } }
                ///
                advFilters[key] = numberFilters;
                (0, myLog_1.consoleLog)('filtersMap.set (number):', key);
            }
            else if (typeof value === 'string' && value !== '') {
                /// normal filtering, i.e: difficult= easy
                ///   i.e: Object { difficult : easy }
                ///
                advFilters[key] = value;
                (0, myLog_1.consoleLog)('filtersMap.set (normal):', key, value);
            }
        }
        /// advFilters = Object { duration: { '$gte': 5, '$lte': 9 }, price: { '$lte': 1000 }, 'difficult': 'easy' }
        (0, myLog_1.consoleLog)('advFilters', advFilters);
        /// create query and set filters
        this.query = this.query.find(advFilters);
        return this;
    }
    // fn(): this {
    //   return this;
    // }
    /// apply sorting
    /// i.e: sort=-price,difficulty => price desc, difficulty asc
    ///
    sort() {
        if (this.queryString.sort) {
            const sortBy = String(this.queryString.sort).split(',').join(' ');
            // const sort = String(req.query.sort).replace(/,/g, ' ');
            (0, myLog_1.consoleLog)('sort: ', sortBy);
            ///sort=name,duration
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt name');
        }
        return this;
    }
    /// select fields
    /// i.e:
    ///   fields: name, duration -> select only name and duration fields.
    ///   fields: -summary,-description -> select all but exclude summary and description fields.
    ///
    selectFields() {
        if (this.queryString.fields) {
            let fields = String(this.queryString.fields).split(',').join(' ');
            // const fields = String(this.queryString.fields).replace(/,/g, ' ');
            /// exclude __v field if any of the fields has - (exclude)
            if (String(this.queryString.fields)
                .split(',')
                .some((el) => el[0] === '-')) {
                fields = fields + ' -__v';
            }
            (0, myLog_1.consoleLog)('fields:', fields);
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate() {
        const page = Number(this.queryString.page || 1);
        const limit = Number(this.queryString.limit) || 5;
        const skipBy = (page - 1) * limit;
        this.query = this.query.limit(limit).skip(skipBy);
        (0, myLog_1.consoleLog)(`limit: ${limit}, skip: ${skipBy}`);
        // if (queryStr.page) {
        //   const documentCount = await Tour.countDocuments();
        //   if (skipBy >= documentCount) throw new Error('Page is not found');
        // }
        return this;
    }
}
exports.default = APIFeatures;
