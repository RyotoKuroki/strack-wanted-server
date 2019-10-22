import { createConnection, BaseEntity } from 'typeorm';
import { TrWanted } from './app.entities/TrWanted';

// ORM - TEST
createConnection({
    name: 'hogehoge',
    type: "mysql",
    /* extra: { socketPath: '/cloudsql/appo-ja:asia-east1:strack-wanted-rdb' }, */
    host: {YOUR_DATABASE_HOST_IP},
    port: {PORT},
    username: {USER_NAME},
    password: {PASSWORD},
    database: {DATABASE_NAME},
    entities:[TrWanted]
}).then(async (conn: any) => {
    BaseEntity.useConnection(conn);
    // save-test
    const hoge = new TrWanted();
    hoge.uuid = Date.now()+'';
    hoge.whois = 'ORM - TEST';
    hoge.name = hoge.uuid;
    hoge.prize_money = 1;
    hoge.image_base64 = '';
    hoge.warning = 'wa----n!';
    hoge.revision = 0;
    await hoge.save();
    // find-test
    const hoges = await TrWanted.find();
    console.log(JSON.stringify(hoges));
}).catch((error: any) => {
    console.log(`error in connect : ${error}`);
});
