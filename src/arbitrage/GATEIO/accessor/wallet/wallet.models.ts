import * as D from "io-ts/Decoder";

export const AccountBalance =  D.struct({
    // [功能描述] 账户总余额
    amount   : D.string,
    // [功能描述] 币种信息
    currency : D.string,
});

export const TotalBalanceDetail = D.partial({
    cross_margin : AccountBalance,
    delivery : AccountBalance,
    finance : AccountBalance,
    futures : AccountBalance,
    margin : AccountBalance,
    quant : AccountBalance,
    spot : AccountBalance,
    cbbc : AccountBalance,
})

export const TotalBalance = D.struct({
    // 总余额
    total : AccountBalance,
    // 细分账户明细
    details : TotalBalanceDetail,
});

