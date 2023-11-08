import mongoose from 'mongoose';
export declare function connectDb(): Promise<typeof mongoose>;
export declare function importTourData(data: Object | Array<Object>): Promise<void>;
export declare function importTourFile(jsonFilepath: string): Promise<any>;
export declare function clearTourData(): Promise<void>;
