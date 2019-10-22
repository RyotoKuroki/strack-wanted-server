import IStates_EntityEnabled from 'strack-wanted-meta/src/consts/states/I.states.entity.enabled';

// TODO: Strack-wanted-meta でインターフェイスでなく、クラスを実装する。
export class EntityEnabledStates implements IStates_EntityEnabled {
    public ENABLED: string = 'ENABLED';
    public DISABLED: string = 'DISABLED';
}

// TODO: Metaにクラス実装した後、以下の実装は無くす
export const EntityEnabledStatesConsts = () => {
    return new EntityEnabledStates();
};