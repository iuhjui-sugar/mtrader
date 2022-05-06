import { pipe } from "fp-ts/function";
import * as D from "io-ts/Decoder";
import { string2number } from "./transcoder";

export const SpotTickerDecoder = pipe(
    D.struct({
        // 交易对
        currency_pair : D.string,
        // 最新成交价
        last : D.string,
        // 最新卖方最低价
        lowest_ask : D.string,
        // 最新买方最高价
        highest_bid : D.string,
        // 最近24h涨跌百分比，跌用负数标识，如 -7.45
        change_percentage : D.string,
        // 最近24h交易货币成交量
        base_volume : D.string,
        // 最近24h计价货币成交量
        quote_volume : D.string,
        // 24小时最高价
        high_24h : D.string,
        // 24小时最低价
        low_24h : D.string,
    }),
    D.intersect(D.partial({
        // ETF 净值
        etf_net_value : D.string,
        // ETF 前一再平衡点净值
        etf_pre_net_value : D.string,
        // ETF 前一再平衡时间
        etf_pre_timestamp : D.number,
        // ETF 当前杠杆率
        etf_leverage : D.string,
    })),
);

export type SpotTicker = D.TypeOf<typeof SpotTickerDecoder>;
