import { createConnection, BaseEntity } from 'typeorm';
import { TrWanted } from './app.entities/tr.wanted';
import AccessorConfig from './app.infras/datastores/datastore.mysql.accessors/accessor.mysql.config';
import { DoneStates } from 'strack-wanted-meta/dist/consts/states/states.done';

const config = AccessorConfig.GetConfig([TrWanted]);

// ORM - TEST
createConnection(config).then(async (conn: any) => {
    BaseEntity.useConnection(conn);

    const uuid = Date.now()+'';

    // save-test
    const hoge = new TrWanted();
    hoge.uuid = uuid;
    hoge.whois = 'ORM - TEST';
    hoge.name = hoge.uuid;
    hoge.prize_money = 1;
    hoge.image_base64 = '';
    hoge.warning = 'wa----n!';
    hoge.revision = 0;
    await hoge.save();

    // find-test
    const hoges = await TrWanted.find({
        where: { uuid: uuid }
    });
    console.log(JSON.stringify(hoges));

}).catch((error: any) => {
    console.log(`error in connect : ${error}`);
});
