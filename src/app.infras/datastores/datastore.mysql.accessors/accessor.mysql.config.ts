export default class AccessorConfig {
    /** DB接続設定情報を取得。適宜設定のこと！*/
    public static GetConfig(schemas?: Array<any>): any {
        return {
            type: "mysql",
            // extra: { socketPath: '/cloudsql/{YOUR_DATABASE_PATH}' },
            host: {YOUR_DATABASE_HOST_IP},
            port: {PORT},
            username: {USER_NAME},
            password: {PASSWORD},
            database: {DATABASE_NAME},
            entities: schemas
        };
    }
}
