import * as D from "io-ts/Decoder";
import { pipe } from "fp-ts/function";

export const FuturesOrderDecoder = pipe(
    D.struct({
        // 合约订单 ID
        id : D.number,
        // 	用户 ID
        user : D.number,
        // 订单创建时间
        create_time : D.number,
        // 订单状态。
        // - open: 等待处理
        // - finished: 已结束的订单
        status : D.string,
        // 合约标识
        contract : D.string,
        // 必选。交易数量，正数为买入，负数为卖出。平仓委托则设置为0。
        size : D.number,
        // 委托价。价格为0并且tif为ioc，代表市价委托。
        price : D.string,
        // 是否为平仓委托。对应请求中的close。
        is_close : D.boolean,
        // 是否为只减仓委托。对应请求中的reduce_only
        is_reduce_only : D.boolean,
        // 是否为强制平仓委托
        is_liq : D.boolean,
        // Time in force 策略，市价单当前只支持 ioc 模式
        // - gtc: GoodTillCancelled
        // - ioc: ImmediateOrCancelled，立即成交或者取消，只吃单不挂单
        // - poc: PendingOrCancelled，被动委托，只挂单不吃单
        tif : D.string,
        // 未成交数量
        left : D.number,
        // 成交价
        fill_price : D.string,
        // 订单自定义信息，用户可以用该字段设置自定义 ID，用户自定义字段必须满足以下条件：
        // 1. 必须以 t- 开头
        // 2. 不计算 t- ，长度不能超过 28 字节
        // 3. 输入内容只能包含数字、字母、下划线(_)、中划线(-) 或者点(.)
        // 除用户自定义信息以外，以下为内部保留字段，标识订单来源:
        // - web: 网页
        // - api: API 调用  
        // - app: 移动端
        // - auto_deleveraging: 自动减仓
        // - liquidation: 强制平仓
        // - insurance: 保险
        text : D.string,
        // 吃单费率
        tkfr : D.string,
        // 做单费率
        mkfr : D.string,
    }),
    D.intersect(D.partial({
        // 订单结束时间，未结束订单无此字段返回
        finishTime : D.number,
        // 结束方式，包括：
        //- filled: 完全成交
        // - cancelled: 用户撤销
        // - liquidated: 强制平仓撤销
        // - ioc: 未立即完全成交，因为tif设置为ioc
        // - auto_deleveraged: 自动减仓撤销
        // - reduce_only: 增持仓位撤销，因为设置reduce_only或平仓
        // - position_closed: 因为仓位平掉了，所以挂单被撤掉
        // - reduce_out: 只减仓被排除的不容易成交的挂单
        finish_as : D.string,
        // 冰山委托显示数量。0为完全不隐藏。注意，隐藏部分成交按照taker收取手续费。
        iceberg : D.number,
        // 推荐人用户 ID
        refu : D.number,
        // 双仓模式下用于设置平仓的方向，close_long 平多头， close_short 平空头，需要同时设置 size 为 0
        auto_size : D.string,
        // 设置为 true 的时候执行平仓操作，并且size应设置为0
        close : D.boolean,
        // 设置为 true 的时候，为只减仓委托
        reduce_only : D.boolean,
    })),
);

export type FuturesOrder = D.TypeOf<typeof FuturesOrderDecoder>;



