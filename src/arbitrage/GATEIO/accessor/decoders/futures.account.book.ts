import * as D from "io-ts/Decoder";

export enum FuturesAccountBookType {
    // 转入转出
   Dnw = "dnw",
   // 减仓盈亏
   Pnl = "pnl",
   // 交易手续费
   Fee = "fee",
   // 推荐人返佣
   Refr = "refr",
   // 资金费用
   Fund = "fund",
   // 点卡转入转出
   PointDnw = "point_dnw",
   // 点卡交易手续费
   PointFee = "point_fee",
   // 点卡推荐人返佣
   PointRefr = "point_refr",
}

export const FuturesAccountBookDecoder = D.struct({
    // [功能描述] 变更时间
    time : D.number,
    // [功能描述] 变更金额
    change : D.string,
    // [功能描述] 变更后账户余额
    balance : D.string,
    // [功能描述] 变更类型
    type : D.string,
    // [功能描述] 注释
    text : D.string,
});

export type FuturesAccountBook = D.TypeOf<typeof FuturesAccountBookDecoder>;

