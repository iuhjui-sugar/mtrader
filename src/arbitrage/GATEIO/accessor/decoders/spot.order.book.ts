import * as D from "io-ts/Decoder";
import { string2number } from "./transcoder";

export const SpotOrderBookDecoder = D.struct({
    // 深度更新ID。深度每发生一次变化，ID 就会更新一次。仅在 with_id 设置为 true 该值有效
    // id : D.number,
    // 接口数据返回 ms 时间戳
    current : D.number,
    // 深度变化 ms 时间戳
    update : D.number,
    // 卖方深度列表
    asks : D.array(D.array(string2number)),
    // 买方深度列表
    bids : D.array(D.array(string2number)),
});


export type SpotOrderBook = D.TypeOf<typeof SpotOrderBookDecoder>