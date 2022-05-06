import * as D from "io-ts/Decoder";
import { pipe } from "fp-ts/function";
import { FuturesPositionCloseOrderDecoder } from "./futures.position.close.order";

export const FuturesPositionDecoder = pipe(
    D.struct({
        // 用户ID
        user : D.number,
        //合约标识
        contract : D.string,
        // 头寸大小
        size : D.number,
        // 杠杆倍数，0代表全仓，正数代表逐仓
        leverage : D.string,
        // 风险限额
        risk_limit : D.string,
        // 当前风险限额下，允许的最大杠杆倍数
        leverage_max : D.string,
        // 当前风险限额下，维持保证金比例
        maintenance_rate : D.string,
        // 按结算币种标记价格计算的合约价值
        value : D.string,
        // 保证金
        margin : D.string,
        // 开仓价格
        entry_price : D.string,
        // 爆仓价格
        liq_price : D.string,
        // 合约当前标记价格
        mark_price : D.string,
        // 未实现盈亏
        unrealised_pnl : D.string,
        // 已实现盈亏
        realised_pnl : D.string,
        // 已平仓的仓位总盈亏
        history_pnl : D.string,
        // 最近一次平仓的盈亏
        last_close_pnl : D.string,
        // 点卡已实现盈亏
        realised_point : D.string,
        // 已平仓的点卡总盈亏
        history_point : D.string,
        // 自动减仓排名，共1-5个等级
        adl_ranking : D.number,
        // 当前未完成委托数量
        pending_orders : D.number,
        // 持仓模式。包括：
        //- single: 单向持仓模式
        // - dual_long: 双向持仓模式下的做多仓位
        // - dual_short: 双向持仓模式下的做空仓位
        mode : D.string,
        // 全仓模式下的杠杆倍数（即 leverage 为 0 时）
        cross_leverage_limit : D.string,
    }),
    D.intersect(D.partial({
        close_order : D.nullable(FuturesPositionCloseOrderDecoder),    
    })),
);

export type FuturesPosition = D.TypeOf<typeof FuturesPositionDecoder>;
