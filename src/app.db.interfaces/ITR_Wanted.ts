import ITR_Base from './ITR_Base';

export default interface ITR_Wanted extends ITR_Base {
    name: string;
    prize_money: number;
    image_base64: string;
    warning: string;
    done: string;
}