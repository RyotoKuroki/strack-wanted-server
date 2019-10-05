import { createConnection, BaseEntity } from 'typeorm';
import TrWanted from './app.db.entities/TrWanted';

// ORM - TEST
createConnection({
    type: "mysql",
 /* extra: { socketPath: '/cloudsql/appo-ja:asia-east1:strack-wanted-rdb' }, */
    host: "35.229.244.159",
    port: 3306,
    username: "strack-wanted-usr-jegphr45er5",
    password: "strack-wanted-pswd-gao5erg51f3sdfa",
    database: "strack_rdb_6grga3waee4",
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
