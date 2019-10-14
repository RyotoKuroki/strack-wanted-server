// import { EntityManager, QueryRunner } from "typeorm";
import Flow from '../app.db.flows/Flow';

export default interface IDomain {
    _Flow: Flow;
    SetFlow(flow: Flow);
}
