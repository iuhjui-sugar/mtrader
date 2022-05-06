import * as D from "io-ts/Decoder";
import { string2number } from "./transcoder";

export enum FuturesContractType {
    Inverse = "inverse",
    Direct  = "direct",
};

export enum FuturesContractMarkType {
    Internal = "internal",
    Index    = "index",
}

export const FuturesContractDecoder = D.struct({
    // [功能描述]合约标识
    name : D.string,
    // [功能描述]合约类型, inverse - 反向合约, direct - 正向合约
    type : D.string,
    // [功能描述]计价货币兑换为结算货币的乘数
    // [真正含义]交易货币的最小买入精度
    quanto_multiplier : string2number,
    // [功能描述] 最小杠杆
    leverage_min : string2number, 
    // [功能描述]最大杠杆
    leverage_max : string2number,
    // [功能描述]维持保证金比例
    maintenance_rate : D.string,
    // [功能描述] 价格标记方式 
    // [枚举说明] internal - 内盘成交价格, index - 外部指数价格
    mark_type : D.string,
    // [功能描述] 当前标记价格
    mark_price : D.string,
    // [功能描述] 当前指数价格
    index_price : D.string,
    // [功能描述]上一次成交价格
    last_price : D.string,
    // [功能描述] 挂单成交的手续费率，负数代表返还后续费
    maker_fee_rate : D.string,
    // [功能描述] 吃单成交的手续费率
    taker_fee_rate : D.string,
    // [功能描述] 委托价格最小单位
    order_price_round : D.string,
    // [功能描述] 标记、强平等价格最小单位
    mark_price_round : D.string,
    // [功能描述] 当前资金费率
    funding_rate : string2number,
    // [功能描述] 资金费率应用间隔，以秒为单位
    funding_interval : D.number,
    // [功能描述] 下次资金费率应用时间
    funding_next_apply : D.number,
    // [功能描述] 基础风险限额
    risk_limit_base : D.string,
    // [功能描述] 风险限额调整步长
    risk_limit_step : D.string,
    // [功能描述] 合约允许的最大风险限额
    risk_limit_max : D.string,
    // [功能描述] 最小下单数量
    order_size_min : D.number,
    // [功能描述] 最大下单数量
    order_size_max : D.number,
    // [功能描述] 下单价与当前标记价格允许的正负偏移量， 即下单价 order_price 需满足如下条件
    // [条件描述] abs(order_price - mark_price) <= mark_price * order_price_deviate
    order_price_deviate : D.string,
    // [功能描述] 被推荐人享受交易费率折扣
    ref_discount_rate : D.string,
    // [功能描述] 推荐人享受交易费率返佣比例
    ref_rebate_rate : D.string,
    // [功能描述] orderbook更新ID
    orderbook_id : D.number,
    // [功能描述] 当前成交ID
    trade_id : D.number,
    // [功能描述] 历史累计成交
    trade_size : D.number,
    // [功能描述] 当前做多用户持有仓位总和
    position_size : D.number,
    // [功能描述] 配置最后更新时间
    config_change_time : D.number,
    // [功能描述] 合约下线中
    in_delisting : D.boolean,
    // [功能描述] 最多挂单数量
    orders_limit : D.number,
});

export type FuturesContract = D.TypeOf<typeof FuturesContractDecoder>;
