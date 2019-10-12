import { /*getConnectionOptions,*/ SelectQueryBuilder, getRepository, BaseEntity, createConnections, createConnection,/* BaseEntity,*/ Connection, QueryRunner, Repository, EntityManager, QueryBuilder, getConnection } from 'typeorm';
import TrWanted from '../app.db.entities/TrWanted';
import uuid from 'node-uuid';
// import Logger from '../app.logger/Logger';

export default class Accessor {

    protected static _ConnectionPool: Connection;

    // queryrunner
    protected _QueryRunner!: QueryRunner;
    public get DbQueryRunner(): QueryRunner { return this._QueryRunner; }

    /** コネクション生成 */
    public async CreateConnection(config: any): Promise<any> {

        if(Accessor._ConnectionPool === undefined || 
           Accessor._ConnectionPool === null){
            Accessor._ConnectionPool = await createConnection(config);
        } else if(Accessor._ConnectionPool.isConnected === false){
            await Accessor._ConnectionPool.close();
            Accessor._ConnectionPool = await Accessor._ConnectionPool.connect();
        }
        BaseEntity.useConnection(Accessor._ConnectionPool);
        return this;
    }
    // 暫定コメントアウト！
    /*
    /** トランザクションスタート * /
    public async BeginTransaction(): Promise<any> {
        await this._QueryRunner.startTransaction();
        return true;
    }
    /** 更新 * /
    public async Upsert(entity: any): Promise<any> {
        await this._QueryRunner.manager.save(entity);
        return true;
    }
    /** コミット * /
    public async CommitTransaction(): Promise<any> {
        await this._QueryRunner.commitTransaction();
        return true;
    }
    /** ロールバック * /
    public async RollbackTransaction(): Promise<any> {
        await this._QueryRunner.rollbackTransaction();
        return true;
    }
    /** 開放 * /
    public async Release(): Promise<any> {
        if (this._QueryRunner.isTransactionActive)
            await this._QueryRunner.rollbackTransaction();
        if (this._QueryRunner)
            await this._QueryRunner.release();
        if (this.DbConnection)
            await this.DbConnection.close();
        return true;
    }
    */
}
