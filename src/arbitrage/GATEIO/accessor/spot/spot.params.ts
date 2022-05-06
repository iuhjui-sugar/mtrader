import { GateV4AuthenticationParams } from "../basic/common.params";

export type CancelSpotOrderParams = {
    // 成功创建订单时返回的订单 ID 或者用户创建时指定的自定义 ID（即 text 字段）。
    order_id : string,
    // 交易对
    currency_pair : string,
    // 指定查询账户。不指定默认现货和逐仓杠杆账户。指定 cross_margin 则查询全仓杠杆账户
    account?: string,
};

export type GetSpotOrderParams = {
    // 成功创建订单时返回的订单 ID 或者用户创建时指定的自定义 ID（即 text 字段）。
    order_id : string,
    // 交易对
    currency_pair : string,
    // 指定查询账户。不指定默认现货和逐仓杠杆账户。指定 cross_margin 则查询全仓杠杆账户
    account?: string,
};

export type CreateSpotOrderParams = {
    // 订单自定义信息，用户可以用该字段设置自定义 ID
    text?: string,
    // 交易货币对
    currency_pair : string,
    // 订单类型，limit - 限价单
    type?: "limit",
    // 账户类型，spot - 现货账户，margin - 杠杆账户，cross_margin - 全仓杠杆账户
    account?: "spot" | "margin" | "cross_margin",
    // 买单或者卖单
    side : "buy" | "sell",
    // 交易数量
    amount : string,
    // 交易价格
    price : string,
    // Time in force 策略。
    time_in_force?: "gtc" | "ioc" | "poc" | "fok",
    // 冰山下单显示的数量，不指定或传 0 都默认为普通下单。如果需要全部冰山，设置为 -1
    iceberg?: string,
    // 杠杆(包括逐仓全仓)交易时，如果账户余额不足，是否由系统自动借入不足部分
    auto_borrow?: boolean,
    // 全仓杠杆下单是否开启自动还款，默认关闭
    auto_repay?: boolean,
};

export type ListSpotOrderBookParams = {
    // 交易对
    currency_pair : string,
    // 合并深度指定的价格精度，0 为不合并，不指定则默认为 0
    interval?:string,
    // 深度档位数量
    limit?:number,
    // 返回深度更新 ID
    with_id?:boolean,
};

export type ListSpotAccountsParams = GateV4AuthenticationParams & {
    // 币种名称
    currency ?: string
};

export type ListTickersParams = {
    // 交易对
    currency_pair?: string
};
