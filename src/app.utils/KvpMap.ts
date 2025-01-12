export class KvpMap {
    protected map: { [key: string]:any };
    constructor () {
        this.map = {};
    }
    public Add2Map (key: string, value: any) {
        //const obj: { [key: string]:any } = {};
        this.map[key] = value;
        return this;
    }
    public get Map (): { [key: string]:any } {
        return this.map;
    }
}
