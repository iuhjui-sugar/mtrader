import * as D from "io-ts/Decoder";

export const FuturesPositionCloseOrderDecoder = D.struct({
    // 委托ID
    id : D.number,
    // 委托价格
    price : D.string,
    // 是否为强制平仓
    is_liq : D.boolean,
});

export type FuturesPositionCloseOrder = D.TypeOf<typeof FuturesPositionCloseOrderDecoder>;
