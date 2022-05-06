import * as D from "io-ts/Decoder";
import { string2number } from "./transcoder";

export const FuturesOrderBookItemDecoder = D.struct({
    // 价格
    p : string2number,
    // 数量
    s : D.number,
});

export type FuturesOrderBookItem = D.TypeOf<typeof FuturesOrderBookItemDecoder>;


export const FuturesOrderBookDecoder = D.struct({
    // 深度更新 ID，深度每发生一次变化，该 ID 加 1，只有设置 with_id=true 时才返回
    //id : D.number,
    // 接口数据返回时间戳
    current : D.number,
    // 深度变化时间戳
    update : D.number,
    // 卖方深度列表
    asks : D.array(FuturesOrderBookItemDecoder),
    // 买方深度列表
    bids : D.array(FuturesOrderBookItemDecoder),
});


export type FuturesOrderBook = D.TypeOf<typeof FuturesOrderBookDecoder>;
