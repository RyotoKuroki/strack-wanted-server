import { createConnection,Connection, QueryRunner } from 'typeorm';
// import Logger from '../app.logger/Logger';

export default class Accessor {

    /** DB接続 */
    protected static _ConnectionPool: Connection;

    /** トランザクション管理なんかには必要なオブジェクト */
    protected _QueryRunner!: QueryRunner;
    public get QueryRunner(): QueryRunner { return this._QueryRunner; }

    /** コネクション生成 */
    public async CreateConnection(config: any): Promise<any> {

        if(!Accessor._ConnectionPool)
        Accessor._ConnectionPool = await createConnection(config);
        if(!Accessor._ConnectionPool.isConnected)
            await Accessor._ConnectionPool.connect();
        const runner = Accessor._ConnectionPool.createQueryRunner();
        this._QueryRunner = runner;
        return this;
    }
}
