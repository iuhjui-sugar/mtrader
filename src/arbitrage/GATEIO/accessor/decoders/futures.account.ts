import * as D from "io-ts/Decoder";

export const FuturesAccountDecoder = D.struct({
    // 账户总资产, total = position_margin + order_margin + available
    total : D.string,
    // 未实现盈亏
    unrealised_pnl : D.string,
    // 头寸保证金
    position_margin : D.string,
    // 未完成订单的保证金
    order_margin : D.string,
    // 可用的转出或交易的额度
    available : D.string,
    // 点卡数额
    point : D.string,
    // 结算币种
    currency : D.string,
    // 是否为双向持仓模式
    in_dual_mode : D.boolean,
});

export type FuturesAccount = D.TypeOf<typeof FuturesAccountDecoder>;
