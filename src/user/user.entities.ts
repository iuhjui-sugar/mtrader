import { Entity } from "typeorm";
import { PrimaryColumn } from "typeorm";
import { Column } from "typeorm";

@Entity({name:"user-module/mainuser"})
export class MainUser {
    // 用户编号
    @PrimaryColumn("varchar")
    public userid:string = "";
    // 用户头像
    @Column("text")
    public avatar:string ="";
    // 用户昵称
    @Column("varchar")
    public nickname:string ="";
    // 绑定数据
    @Column("text")
    public binds:string="[]";
    // 链接数据
    @Column("text")
    public links:string="[]";
    // 创建时间
    @Column("integer")
    public created:number = 0;
}

@Entity({name:"user-module/loginuser"})
export class LoginUser {
    // 用户编号
    @PrimaryColumn("varchar")
    public userid:string = "";
    // 用户名称
    @Column("varchar")
    public username:string = "";
    // 用户密码
    @Column("varchar")
    public password:string = "";
    // 更新时间
    @Column("integer")
    public modified:number = 0;
    // 创建时间
    @Column("integer")
    public created:number = 0;
}


