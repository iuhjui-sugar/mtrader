import * as D from "io-ts/Decoder";

export const FuturesPriceTriggerDecoder = D.struct({
    // 触发策略
    // - 0: 价格触发，即当价格满足条件时触发
    // - 1: 价差触发，即指定 price_type 的最近一次价格减去倒数第二个价格的差值
    // 目前暂时只支持0价格触发
    strategy_type : D.number,
    // 参考价格类型。 
    // - 0 - 最新成交价，
    // - 1 - 标记价格，
    // - 2 - 指数价格
    price_type : D.number,
    // 价格触发时为价格，价差触发时为价差
    price : D.string,
    // 价格条件类型
    // - 1: 表示根据 strategy_type 和 price_type 算出的价格大于等于 price
    // - 2: 表示根据 strategy_type 和 price_type 算出的价格小于等于 price
    rule : D.number,
    // 最长等待触发时间，超时则取消该订单，单位是秒 s
    expiration : D.number,
});

export type FuturesPriceTrigger = D.TypeOf<typeof FuturesPriceTriggerDecoder>;

