import { createConnection,Connection, QueryRunner } from 'typeorm';
// import Logger from '../app.logger/Logger';

export default class Accessor {

    /** DB接続 */
    protected _ConnectionPool!: Connection;
    public get ConnectionPool(): Connection { return this._ConnectionPool; }

    /** トランザクション管理なんかには必要なオブジェクト */
    protected _QueryRunner!: QueryRunner;
    public get QueryRunner(): QueryRunner { return this._QueryRunner; }

    /** コネクション生成 */
    public async CreateConnection(config: any): Promise<any> {

        if(!this._ConnectionPool)
        this._ConnectionPool = await createConnection(config);
        if(!this._ConnectionPool.isConnected)
            await this._ConnectionPool.connect();
        const runner = this._ConnectionPool.createQueryRunner();
        this._QueryRunner = runner;
        return this;
    }
}
