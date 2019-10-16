// import { EntityManager, QueryRunner } from "typeorm";
import Datastore from '../app.infrastructure.datastore/Infra.Datastore';

export default interface IDomain {
    _Datastore: Datastore;
}
