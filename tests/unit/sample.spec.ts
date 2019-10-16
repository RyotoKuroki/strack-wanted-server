import Datastore from '../../src/app.infrastructure.datastore/Infra.Datastore';
import WantedDomain from '../../src/app.domains/WantedDomain';
import TrWanted from '../../src/app.db.entities/TrWanted';
import { EntityManager } from 'typeorm';
// import { shallowMount } from '@vue/test-utils';
// import HelloWorld from '@/components/HelloWorld.vue';
/*
describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
*/
describe('WantedDomain', (): void => {

    /**
     * データ取得できないことのテスト
     */
    /*
    test('should undefined.', (): void => {
        // test内容
        const testFunction = async (_uuid: string, _revision: number, _enabled: string) => {
            console.log(`beginnn`);
            const datastore = new Datastore();
            const result = await datastore.Run([TrWanted])
            .then(async (result) => {
                console.log(`run-then`);
                // tran使ってみる
                const wanted = datastore.Transaction(async (manager: EntityManager) => {
                    const uuid: string = _uuid;
                    const revision: number = _revision;
                    const enabled: string = _enabled;
                    const wantedDomain = new WantedDomain(manager);
                    const wanted = await wantedDomain.FindOne(uuid, revision, enabled);
                    return wanted;
                })
                .then((result: any) => {})
                .catch((error: any) => {});
                result.wanted = wanted;
                return result;
            })
            .catch(async (error) => {
                // console.log(`error @db-connection`);
                return null;
            });
            // console.log(`wanted: ${JSON.stringify(result.wanted)}`);
            expect(result.wanted).toBeUndefined();
        };
        // test実施
        testFunction('not existed uuid', -1, '');
    });
    */
    /**
     * データ取得できることのテスト
     */
    /*
    test('should exist wanted.', (): void => {
        // test内容
        const testFunction = async (_uuid: string, _revision: number, _enabled: string) => {
            const datastore = new Datastore();
            const result = await datastore.Run([TrWanted])
            .then(async (result) => {
                const wanted = datastore.BeginTransaction(async (manager: EntityManager) => {
                    const uuid: string = _uuid;
                    const revision: number = _revision;
                    const enabled: string = _enabled;
                    const wantedDomain = new WantedDomain();
                    const wanted = await wantedDomain.FindOne(uuid, revision, enabled);
                    return wanted;
                })
                .then((result: any) => {})
                .catch((error: any) => {});
                result.wanted = wanted;
                return result;
            })
            .catch(async (error) => {
                console.log(`error @db-connection`);
                return null;
            });
            console.log(`wanted: ${JSON.stringify(result.wanted)}`);
            expect(result.wanted).toBeUndefined();
        };
        // test実施
        testFunction('065f760e-4cbf-4ccc-8180-8d649fedfef9-1570349887260', 8, 'disable');
    });
    */
});
