import { GateV4AuthenticationParams } from "../basic/common.params";

export type GetTradeFeeParams = {
    // 指定交易对获取更准确的费率设置
    currency_pair?:string,
};

export type TransferParams = {
    // 转账货币名称。关联合约账户时，currency 可以设置的值为POINT(即点卡) 和支持的结算货币(如 BTC, USDT)
    currency : string,
    // 转出账户
    from : "spot" | "margin" | "futures" | "delivery" | "cross_margin" | "options",
    // 转入账户
    to : "spot" | "margin" | "futures" | "delivery" | "cross_margin" | "options",
    // 转账额度
    amount : string,
    // 杠杆交易对。转入或转出杠杆账户时必填
    currency_pair?:string,
    // 合约结算币种。 转入转出合约账户时必填
    settle?:string,
};

export type GetTotalBalanceParams = GateV4AuthenticationParams & {
    currency : "BTC" | "CNY" | "USD" | "USDT";
};