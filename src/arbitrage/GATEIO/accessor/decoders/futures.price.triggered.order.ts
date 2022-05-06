import * as D from "io-ts/Decoder";
import { FuturesInitialOrderDecoder } from "./futures.initial.order";
import { FuturesPriceTriggerDecoder } from "./futures.price.trigger";

export const FuturesPriceTriggeredOrderDecoder = D.struct({
    // 内部订单
    initial : FuturesInitialOrderDecoder,
    // 触发信息
    trigger : FuturesPriceTriggerDecoder,
    // 自动订单 ID
    id : D.number,
    // 用户 ID
    user : D.number,
    // 创建时间
    create_time : D.number,
    // 结束时间
    finish_time : D.number,
    // 触发后委托单ID
    trade_id : D.number,
    // 订单状态 
    // - open - 活跃中；
    // - finished - 已结束
    status : D.string,
    // 结束状态 
    // - cancelled - 被取消；
    // - succeeded - 成功；
    // - failed - 失败；
    // - expired - 过期
    finish_as : D.string,
    // 订单结束的附加描述信息
    reason : D.string,
});

export type FuturesPriceTriggeredOrder = D.TypeOf<typeof FuturesPriceTriggeredOrderDecoder>;

