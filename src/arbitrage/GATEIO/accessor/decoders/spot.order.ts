import * as D from "io-ts/Decoder";
import { pipe } from "fp-ts/function";

export const SpotOrderDecoder = pipe(
    D.struct({
        // 订单 ID
        id : D.string,
        // 订单自定义信息，用户可以用该字段设置自定义 ID，用户自定义字段必须满足以下条件：
        // 1. 必须以 t- 开头
        // 2. 不计算 t- ，长度不能超过 28 字节
        // 3. 输入内容只能包含数字、字母、下划线(_)、中划线(-) 或者点(.)
        text : D.string,
        // 订单创建时间
        create_time : D.string,
        // 订单最新修改时间
        update_time : D.string,
        // 订单创建时间，毫秒精度
        create_time_ms : D.number,
        // 订单最近修改时间，毫秒精度
        update_time_ms : D.number,
        // 订单状态。
        //- open: 等待处理
        // - closed: 全部成交
        // - cancelled: 订单撤销
        status : D.string,
        // 交易货币对
        currency_pair : D.string,
        // 订单类型，limit - 限价单
        type : D.string,
        // 账户类型，spot - 现货账户，margin - 杠杆账户，cross_margin - 全仓杠杆账户
        account : D.string,
        // 买单或者卖单
        side : D.string,
        // 交易数量
        amount : D.string,
        // 交易价格
        price : D.string,
        // Time in force 策略。
        // - gtc: GoodTillCancelled
        // - ioc: ImmediateOrCancelled，立即成交或者取消，只吃单不挂单
        // - poc: PendingOrCancelled，被动委托，只挂单不吃单
        // - fok: FillOrKill，全部成交或者全部取消
        time_in_force : D.string,
        // 冰山下单显示的数量，不指定或传 0 都默认为普通下单。如果需要全部冰山，设置为 -1
        iceberg : D.string,
        // 交易货币未成交数量
        left : D.string,
        // 已成交的计价币种总额，该字段废弃，建议使用相同意义的 filled_total
        fill_price : D.string,
        // 已成交总金额
        filled_total : D.string,
        // 成交扣除的手续费
        fee : D.string,
        // 手续费计价单位
        fee_currency : D.string,
        // 手续费抵扣使用的点卡数量
        point_fee : D.string,
        // 手续费抵扣使用的 GT 数量
        gt_fee : D.string,
        // 是否开启GT抵扣
        gt_discount : D.boolean,
        // 返还的手续费
        rebated_fee : D.string,
        // 返还手续费计价单位
        rebated_fee_currency : D.string,
    }),
    D.intersect(D.partial({
        // 杠杆(包括逐仓全仓)交易时，如果账户余额不足，是否由系统自动借入不足部分
        auto_borrow : D.boolean,
        // 全仓杠杆下单是否开启自动还款，默认关闭。需要注意的是:
        // 1. 此字段仅针对全仓杠杆有效。逐仓杠杆不支持订单级别的自动还款设置，只能通过 POST /margin/auto_repay 修改用户级别的设置
        // 2. auto_borrow 与 auto_repay 不支持同时开启
        auto_repay : D.boolean,
    })),
);

export type SpotOrder = D.TypeOf<typeof SpotOrderDecoder>;
