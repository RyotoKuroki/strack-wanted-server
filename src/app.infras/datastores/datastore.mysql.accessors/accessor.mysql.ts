import { createConnection,Connection, QueryRunner } from 'typeorm';
// import Logger from '../app.logger/Logger';

export default class Accessor {

    /** DB接続 */
    protected static _ConnectionPool: Connection;

    /** コネクション生成 */
    public static async CreateConnection(config: any): Promise<any> {

        if(!Accessor._ConnectionPool)
        Accessor._ConnectionPool = await createConnection(config);
        if(!Accessor._ConnectionPool.isConnected)
            await Accessor._ConnectionPool.connect();
        return this;
    }
    public FetchConnection (): Connection {
        return Accessor._ConnectionPool;
    }
}
