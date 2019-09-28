import { Connection, QueryRunner } from 'typeorm';
export default class Accessor {
    protected _Connection: Connection;
    readonly DbConnection: Connection;
    protected _QueryRunner: QueryRunner;
    readonly DbQueryRunner: QueryRunner;
    GetConfig(schemas?: Array<any>): any;
    CreateConnection(config: any): Promise<any>;
    BeginTransaction(): Promise<any>;
    Upsert(entity: any): Promise<any>;
    CommitTransaction(): Promise<any>;
    RollbackTransaction(): Promise<any>;
    Release(): Promise<any>;
}
