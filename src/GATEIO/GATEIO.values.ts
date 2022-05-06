export enum ErrorCode {
    UNKNOWN, // 未知错误
    FATAL_SCENE, // 致命的场景,请联系开发者
    UNSUPPORTED_CONTRACT,// 不支持的合约
}

export type ErrorValue = [ErrorCode,string];

export type Contract = {
    // 结算货币
    settle   : string, 
    // 交易货币
    currency : string,
    // 结算货币精度
    settlePrecision : number,
    // 交易货币精度
    currencyPrecsion : number,
    // 现货市场名称
    spotMarket: string,
    // 期货市场名称
    futuresMarket : string,
}
