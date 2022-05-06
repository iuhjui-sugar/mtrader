/*

import { Entity } from "typeorm";
import { PrimaryColumn } from "typeorm";
import { Column } from "typeorm";

@Entity("module/GATEIO/ticket")
export class Ticket {
    // 
    @PrimaryColumn("varchar")
    public id:string = "";

    // 股份数量
    @Column("double")
    public share_size:number = 0;

    // 股份价值
    @Column("double")
    public share_value:number = 0;

    // 股份精度
    @Column("int")
    public share_precision:number = 2;

    // 入场买入现货订单编号
    @Column("varchar")
    public make_spot_oid:string = "";

    // 入场做空期货订单编号
    @Column("varchar")
    public make_futures_oid:string = "";

    // 入场时现货买入价
    @Column("int")
    public make_spot_price:number = 0;

    // 入场时期货做空价
    @Column("int")
    public make_futures_price:number = 0;

    // 离场卖出现货的订单编号
    @Column("varchar")
    public exit_spot_oid:string = "";

    // 离场做多期货的订单编号
    @Column("varchar")
    public exit_futures_oid:string = "";

    // 离场时现货卖出价
    @Column("int")
    public exit_spot_price:number = 0;

    // 离场时期货做多价
    @Column("int")
    public exit_futures_price:number = 0;

    // 票状态
    @Column("int")
    public status:Ticket.TicketStatus = Ticket.TicketStatus.IDLE;

    // 创建时间
    @Column("int")
    public created:number = 0;

}

export namespace Ticket {
    export enum TicketStatus {
        IDLE = 0, // 闲置的票据
        MAKEING = 1, // 构建中的票据
        COMPLATE = 2, // 构建完成的票据
        EXITING = 3, // 离场中的票据
    };
}

export const GATEIO_Entities = [
    Ticket,
];



export type Contract = {
    // 结算货币
    settle   : string, 
    // 交易货币
    currency : string,
    // 结算货币精度
    settlePrecision : number,
    // 交易货币精度
    currencyPrecsion : number,
    // 现货市场名称
    spotMarket: string,
    // 期货市场名称
    futuresMarket : string,
}

*/