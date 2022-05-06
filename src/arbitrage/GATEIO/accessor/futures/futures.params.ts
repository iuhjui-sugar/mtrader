import { GateV4AuthenticationParams } from "../basic/common.params";

export type GetFuturesOrderParams = {
    // 结算货币
    settle : "btc" | "usdt" | "usd",
    // 成功创建订单时返回的订单 ID 或者用户创建时指定的自定义 ID（即 text 字段）。
    order_id : string,
}

export type GetPriceTriggeredOrderParams = {
    // 结算货币
    settle : "btc" | "usdt" | "usd",
    // 成功创建订单时返回的 ID
    order_id : string,
};

export type UpdatePositionLeverageParams = {
    // 结算货币
    settle   : "btc" | "usdt" | "usd",
    // 合约标识
    contract : string,
    // 新的杠杆倍数
    leverage : number,
    // 全仓模式下的杠杆倍数 
    cross_leverage_limit?: number,
};

export type CreateFuturesOrderParams = {
    // 	合约标识
    contract : string,
    // 必选。交易数量，正数为买入，负数为卖出。平仓委托则设置为0。
    size : number,
    // 冰山委托显示数量。0为完全不隐藏。注意，隐藏部分成交按照taker收取手续费。
    iceberg?: number,
    // 委托价。价格为0并且tif为ioc，代表市价委托。
    price?:string,
    // 设置为 true 的时候执行平仓操作，并且size应设置为0
    close?:boolean,
    // 设置为 true 的时候，为只减仓委托
    reduce_only?:boolean,
    // Time in force 策略，市价单当前只支持 ioc 模式
    tif?: "gtc" | "ioc" | "poc",
    // 订单自定义信息，用户可以用该字段设置自定义 ID
    text?:string,
    // 双仓模式下用于设置平仓的方向，close_long 平多头， close_short 平空头，需要同时设置 size 为 0
    auto_size?:"close_long" | "close_short",
};

export type ListFuturesOrderBookParams = {
    // 结算货币
    settle :"btc" | "usdt" | "usd",    
    // 合约标识
    contract : string,
    // 合并深度指定的价格精度，0 为不合并，不指定则默认为 0
    interval?: "0" | "0.1" | "0.01",
    // 	深度档位数量
    limit?: number, 
    // 是否返回深度更新 ID。深度每发生一次变化，该 ID 自增 1
    withId?: boolean,
};

export type ListFuturesContractsParmas = {
    settle :"btc" | "usdt",
};

export type ListFuturesAccountBookParams = GateV4AuthenticationParams & {
    settle : "usdt",
};


export type ListFuturesAccountsParams = GateV4AuthenticationParams & {
    settle :"btc" | "usdt" | "usd",
    
}