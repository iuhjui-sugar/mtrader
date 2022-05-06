
export type MakeEntrustOrderParams = {
    // 用户编号
    userid : string,
    // 所属合约
    contract:string;
    // 杠杆倍数
    leverage : number,
    // 仓位大小
    position_size : number,
};