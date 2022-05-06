import * as D from "io-ts/Decoder";

export const FuturesInitialOrderDecoder = D.struct({
    // 合约标识
    contract : D.string,
    // 交易数量，正数为买入，负数为卖出，平仓操作必须为0
    size : D.number,
    // 交易价，当价格为 0 时，表示通过市价方式来下单
    price : D.string,
    // 设置为 true 的时候执行平仓操作
    close : D.boolean,
    // Time in force 策略，市价单当前只支持 ioc 模式
    // - gtc: GoodTillCancelled
    // - ioc: ImmediateOrCancelled
    tif : D.string,
    // 订单的来源，包括：
    // - web: 网页
    // - api: API 调用
    // - app: 移动端
    text : D.string,
    // 设置为 true 的时候执行自动减仓操作
    reduce_only : D.boolean,
    // 是否为只减仓委托。对应请求中的reduce_only。
    is_reduce_only : D.boolean,
    // 是否为平仓委托。对应请求中的close。
    is_close : D.boolean,
});

export type FuturesInitialOrder = D.TypeOf<typeof FuturesInitialOrderDecoder>;
