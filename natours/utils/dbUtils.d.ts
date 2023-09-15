import mongoose from 'mongoose';
export declare function connectDb(isTest?: boolean): Promise<typeof mongoose>;
export declare function importData(data: Object | Array<Object>): Promise<void>;
export declare function importFile(jsonFilepath: string): Promise<any>;
export declare function clearData(): Promise<void>;
