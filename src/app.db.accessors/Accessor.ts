import { /*getConnectionOptions,*/ createConnection, /*BaseEntity,*/ Connection, QueryRunner } from 'typeorm';
import TrWanted from '../app.db.entities/TrWanted';

export default class Accessor {

    // connection
    protected _Connection!: Connection;
    public get DbConnection(): Connection { return this._Connection; }
    
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

        console.log(`accessor connecting`);
        const conn = await createConnection(config);
        this._Connection = conn;

        console.log(`accessor connected`);
        const queryRunner = conn.createQueryRunner();
        await queryRunner.connect();
        this._QueryRunner = queryRunner;

        console.log(`accessor run`);
        return this;
    }
    /** トランザクションスタート */
    public async BeginTransaction(): Promise<any> {
        await this._QueryRunner.startTransaction();
        return true;
    }
    /** 更新 */
    public async Upsert(entity: any): Promise<any> {
        await this._QueryRunner.manager.save(entity);
        return true;
    }
    /** コミット */
    public async CommitTransaction(): Promise<any> {
        await this._QueryRunner.commitTransaction();
        return true;
    }
    /** ロールバック */
    public async RollbackTransaction(): Promise<any> {
        await this._QueryRunner.rollbackTransaction();
        return true;
    }
    /** 開放 */
    public async Release(): Promise<any> {
        if (this._QueryRunner.isTransactionActive)
            await this._QueryRunner.rollbackTransaction();
        if (this._QueryRunner)
            await this._QueryRunner.release();
        if (this._Connection)
            await this._Connection.close();
        return true;
    }
}
