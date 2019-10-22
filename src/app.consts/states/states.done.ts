import IStates_Done from 'strack-wanted-meta/src/consts/states/I.states.done';

// TODO: Strack-wanted-meta でインターフェイスでなく、クラスを実装する。
export class DoneStates implements IStates_Done {
    public YET: string = 'YET';
    public DONE: string = 'DONE';
}

// TODO: Metaにクラス実装した後、以下の実装は無くす
export const DoneStatesConsts = () => {
    return new DoneStates();
};