import { /*getConnectionOptions,*/SelectQueryBuilder, getRepository, BaseEntity, createConnections, createConnection,/* BaseEntity,*/ Connection, QueryRunner, Repository, EntityManager, QueryBuilder, getConnection } from 'typeorm';
import TrWanted from '../app.db.entities/TrWanted';
import uuid from 'node-uuid';

export default class Accessor {

    protected static _GlobalConnection: Connection;

    // queryrunner
    protected _QueryRunner!: QueryRunner;
    public get DbQueryRunner(): QueryRunner { return this._QueryRunner; }

    /** DB接続設定情報を取得。適宜設定のこと！*/
    public GetConfig(schemas?: Array<any>): any {
        // スキーマ未設定の場合は全スキーマを設定しておくことにする。
        const ss = (schemas && schemas.length > 0) ? schemas : [
            TrWanted,
        ];
        return {
            type: "mysql",
            // extra: { socketPath: '/cloudsql/{YOUR_DATABASE_PATH}' },
            host: "{YOUR_DATABASE_IP_ADDRESS}",
            port: {YOUR_DATABASE_PORT},
            username: "{USER_NAME}",
            password: "{PASSWORD}",
            database: "{DATABASE_NAME}",
            entities: ss
        };
    }
    /** コネクション生成 */
    public async CreateConnection(config: any): Promise<any> {

        if(Accessor._GlobalConnection === undefined || 
           Accessor._GlobalConnection === null || 
           Accessor._GlobalConnection.isConnected === false){
            console.log(`accessor connecting`);
            // const conn = await createConnection(config);
            // const conns = await createConnections([config]);
            // this._Connections = conns;
            Accessor._GlobalConnection = await createConnection(config);
            console.log(`accessor connected`);
        }

        BaseEntity.useConnection(Accessor._GlobalConnection);
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
