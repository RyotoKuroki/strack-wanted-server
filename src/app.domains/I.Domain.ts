// import { EntityManager, QueryRunner } from "typeorm";
import Datastore from '../app.infras/infra.datastores/Infra.Datastore';

export default interface IDomain {
    _Datastore: Datastore;
}
