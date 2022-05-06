import * as D from "io-ts/Decoder";
import { string2number } from "./transcoder";

export const TradeFeeDecoder = D.struct({
    // 用户 ID
    user_id : D.number,
    // taker 费率
    taker_fee : string2number,
    // maker 费率
    maker_fee : string2number,
    // 是否开启 GT 抵扣折扣
    gt_discount :D.boolean,
    // GT 抵扣 taker 费率，未开启 GT 抵扣则为 0
    gt_taker_fee : string2number,
    // GT 抵扣 maker 费率，未开启 GT 抵扣则为 0
    gt_maker_fee : string2number,
    // 杠杆理财的费率
    loan_fee : D.string,
    // 点卡类型，0 - 初版点卡，1 - 202009 启用的新点卡
    point_type : D.string,
    // 合约 taker 费率
    futures_taker_fee :  string2number,
    // 合约 maker 费率
    futures_maker_fee : string2number,
});

export type TradeFee = D.TypeOf<typeof TradeFeeDecoder>;

