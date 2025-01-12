export default class AccessorConfig {
    /** DB接続設定情報を取得。適宜設定のこと！*/
    public static GetConfig(schemas?: Array<any>): any {
        return {
            type: "mysql",
            // extra: { socketPath: '/cloudsql/{YOUR_DATABASE_PATH}' },
            host: "XXX.XXX.XXX.XXX",
            port: 1234,
            username: "AAAAAAAAAAAAAAAAAAAAAA",
            password: "BBBBBBBBBBBBBBBBBBBBBB",
            database: "CCCCCCCCCCCCCCCCCCCCCC",
            entities: schemas
        };
    }
}
