import mongoose from 'mongoose';
export declare function connectDb(isTest?: boolean): Promise<typeof mongoose>;
export declare function importData(jsonFilepath: string): Promise<any>;
export declare function clearData(): Promise<void>;
