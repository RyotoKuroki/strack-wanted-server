import { /*getConnectionOptions,*/ createConnection, /*BaseEntity,*/ Connection, QueryRunner } from 'typeorm';
// import { TrAffair } from '../entity/TrAffair';
// import { TrAffairTimePlace } from '../entity/TrAffairTimePlace';
import TrWanted from '../app.db.entities/TrWanted';

export default class Accessor {

    // connection
    protected _Connection!: Connection;
    public get DbConnection(): Connection { return this._Connection; }
    
    // queryrunner
    protected _QueryRunner!: QueryRunner;
    public get DbQueryRunner(): QueryRunner { return this._QueryRunner; }

    public GetConfig(schemas?: Array<any>): any {
        // スキーマ未設定の場合は全スキーマを設定しておくことにする。
        const ss = (schemas && schemas.length > 0) ? schemas : [
            TrWanted,
        ];
        return {
            type: "mysql",
            // extra: { socketPath: '/cloudsql/appo-ja:asia-east1:strack-wanted-rdb' },
            host: "35.229.244.159",
            port: 3306,
            username: "strack-wanted-usr-jegphr45er5",
            password: "strack-wanted-pswd-gao5erg51f3sdfa",
            database: "strack_rdb_6grga3waee4",
            entities: ss
        };
    }
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
    public async BeginTransaction(): Promise<any> {
        await this._QueryRunner.startTransaction();
        return true;
    }
    public async Upsert(entity: any): Promise<any> {
        await this._QueryRunner.manager.save(entity);
        return true;
    }
    public async CommitTransaction(): Promise<any> {
        await this._QueryRunner.commitTransaction();
        return true;
    }
    public async RollbackTransaction(): Promise<any> {
        await this._QueryRunner.rollbackTransaction();
        return true;
    }
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