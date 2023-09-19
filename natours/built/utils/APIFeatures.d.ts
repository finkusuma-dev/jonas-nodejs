import QueryString from 'qs';
import { QueryType } from '../types/mongooseTypes';
export default class APIFeatures<T> {
    query: QueryType<T>;
    modelProps: Array<string>;
    modelNumberProps: Array<string>;
    queryString: QueryString.ParsedQs;
    constructor(query: QueryType<T>, modelProps: Array<string>, modelNumberProps: Array<string>, queryString: QueryString.ParsedQs);
    filter(): this;
    sort(): this;
    selectFields(): this;
    paginate(): this;
}
