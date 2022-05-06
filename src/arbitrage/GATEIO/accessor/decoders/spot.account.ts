import * as D from "io-ts/Decoder";

export const SpotAccountDecoder = D.struct({
    // 币种信息
    currency : D.string,
    // 可用金额
    available : D.string,
    // 冻结金额
    locked : D.string,
});

export type SpotAccount = D.TypeOf<typeof SpotAccountDecoder>;