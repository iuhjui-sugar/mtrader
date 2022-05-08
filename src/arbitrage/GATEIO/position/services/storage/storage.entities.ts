import { Entity } from "typeorm";
import { PrimaryColumn } from "typeorm";
import { Column } from "typeorm";

// 套利仓位
@Entity({name:"arbitrage-module/GATEIO-module/position"})
export class Position {
    // 用户编号
    @PrimaryColumn({name:"userid"})
    public userid:string = "";
    // 合约标识
    @PrimaryColumn({name:"contract"})
    public contract:string = "";
    // 每张合约对应的币数
    @Column("double")
    public quanto_multiplier:number=0;
    // 合约张数
    @Column("int")
    public position_size:number = 0;
    // 杠杆倍数
    @Column("int")
    public leverage:number = 0;
    // 仓位更新时间
    @Column("int")
    public modified:number = 0; 
    // 仓位创建时间
    @Column("int")
    public created:number=0;
}

@Entity({name:"arbitrage-module/GATEIO-module/entrust-order"})
export class Entrust {
    // 委托单号
    @PrimaryColumn("varchar")
    public entrustid:string = "";
    // 用户编号
    @Column("varchar")
    public userid:string = "";
    // 合约标识
    @Column("varchar")
    public contract:string = "";
    // 委托方向
    @Column("varchar")
    public direction:"increase"|"decrease" = "increase";
    // 合约张数
    @Column("int")
    public position_size:number = 0;
    // 委托订单状态
    @Column("varchar")
    public status:"ok"|"wait"|"abort" = "wait";
    // 更新时间
    @Column("int")
    public modified:number = 0;
    // 委托创建时间
    @Column("int")
    public created:number = 0;
}

@Entity({name:"arbitrage-module/GATEIO-module/transaction"})
export class Transaction {
    // 交易编号
    @PrimaryColumn("varchar")
    public tradeid:string = "";
    // 委托单号
    @Column("varchar")
    public entrustid:string = "";
    // 交易订单编号
    @Column("varchar")
    public orderid:string = "";
    // 交易类型
    @Column("varchar")
    public txtype:"spot"|"futures" = "spot";
    // 交易订单价格(USDT)
    @Column("double")
    public price:number = 0;
    // 交易订单数量
    @Column("double")
    public size:number = 0; 
    // 迭代次数
    @Column("int")
    public iterate:number = 0;
    // 交易订单状态
    @Column("varchar")
    public txstatus:"wait"|"ok"|"abrot" = "wait";
    // 更新时间
    @Column("int")
    public modified:number = 0;
    // 创建时间
    @Column("int")
    public created:number = 0;
}
