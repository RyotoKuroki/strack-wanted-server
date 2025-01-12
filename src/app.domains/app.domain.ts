import {
    DataSource,
    EntityManager,
} from 'typeorm';

export default class AppDomain {

    public async RunWithTran (
        config: any,
        delegate: (entityManager: EntityManager) => Promise<any>
    ): Promise<any>
    {
        const dataSource = await new DataSource(config).initialize();
        return await dataSource.transaction(async (em): Promise<any> => {
            return await delegate(em);
        });
    }

    public async Run2 (
        config: any,
        delegate: (entityManager: EntityManager) => Promise<any>
    ) {
        const dataSource = await new DataSource(config).initialize();
        const em = dataSource.createEntityManager();
        try {
            return await delegate(em);
        } finally {
            em.connection.destroy();
        }
    }

}