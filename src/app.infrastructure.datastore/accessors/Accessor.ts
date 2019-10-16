import { createConnection,Connection, QueryRunner } from 'typeorm';
// import Logger from '../app.logger/Logger';

export default class Accessor {

    /**
     * connection
     * DB接続。
     * Typeorm は、BaseEntity に Static なコネクションを持って、プールするのがデフォルト想定のよう。
     * 複数接続は、createConnections で可能なようだが・・、いずれそっちも見てみる（予定）！
     */
    protected static _ConnectionPool: Connection;

    /**
     * queryrunner
     * トランザクション管理なんかには必要なオブジェクト。
     */
    protected _QueryRunner!: QueryRunner;
    public get QueryRunner(): QueryRunner { return this._QueryRunner; }

    /** コネクション生成 */
    public async CreateConnection(config: any): Promise<any> {

        // create connection
        if(!Accessor._ConnectionPool)
            Accessor._ConnectionPool = await createConnection(config);
        
        // connect
        if(!Accessor._ConnectionPool.isConnected)
            await Accessor._ConnectionPool.connect();
        
        // queryrunner
        const runner = Accessor._ConnectionPool.createQueryRunner();
        this._QueryRunner = runner;

        return this;
    }
}
