import "reflect-metadata";
import { DataSource } from "typeorm";
export declare const AppDataSource: DataSource;
export declare const getConnection: () => Promise<DataSource>;
