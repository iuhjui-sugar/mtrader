import { Entity } from "typeorm";
import { PrimaryColumn } from "typeorm";
import { Column } from "typeorm";

@Entity({name:"user-module/weixinuser-module/weixinuser"})
export class WeixinUser {
    // 微信唯一编号
    @PrimaryColumn("varchar")
    public unionid = "";
    // 用户编号
    @Column("varchar")
    public userid = "";
    // 小程序开放编号
    @Column("varchar")
    public mp_openid = "";
    // 用户头像
    @Column("text")
    public avatar = "";
    // 用户昵称
    @Column("varchar")
    public nickname="";
}
