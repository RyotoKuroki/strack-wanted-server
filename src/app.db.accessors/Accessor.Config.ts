import { /*getConnectionOptions,*/ SelectQueryBuilder, getRepository, BaseEntity, createConnections, createConnection,/* BaseEntity,*/ Connection, QueryRunner, Repository, EntityManager, QueryBuilder, getConnection } from 'typeorm';
import TrWanted from '../app.db.entities/TrWanted';
import uuid from 'node-uuid';
// import Logger from '../app.logger/Logger';

export default class AccessorConfig {
    /** DB接続設定情報を取得。適宜設定のこと！*/
    public static GetConfig(schemas?: Array<any>): any {
        // スキーマ未設定の場合は全スキーマを設定しておくことにする。
        const ss = (schemas && schemas.length > 0) ? schemas : [
            TrWanted,
        ];
        return {
            type: "mysql",
            // extra: { socketPath: '/cloudsql/{YOUR_DATABASE_PATH}' },
            host: "35.229.244.159",
            port: 3306,
            username: "strack-wanted-usr-jegphr45er5",
            password: "strack-wanted-pswd-gao5erg51f3sdfa",
            database: "strack_rdb_6grga3waee4",
            entities: ss
        };
    }
}
