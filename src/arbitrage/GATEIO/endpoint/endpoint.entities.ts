import { Entity } from "typeorm";
import { PrimaryColumn } from "typeorm";
import { Column } from "typeorm";


@Entity({name:"arbitrage-module/GATEIO-module/endpoint"})
export class GateIOEndpoint {
    // 用户编号
    @PrimaryColumn("varchar")
    public userid:string = "";
    // API KEY
    @Column("text")
    public apikey:string = "";
    // API SECRET
    @Column("text")
    public apisecret:string = "";
    // 关联时间
    @Column("integer")
    public linktime:number = 0;
}