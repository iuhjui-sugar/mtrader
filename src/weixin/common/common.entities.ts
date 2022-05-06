import { Entity } from "typeorm";
import { PrimaryColumn } from "typeorm";
import { Column } from "typeorm";

@Entity({name:"weixin-module/authorize-evidence"})
export class AuthorizeEvidence {
    // 微信唯一编号
    @PrimaryColumn("varchar")
    public unionid : string = "";
    // 小程序开放编号
    @Column("varchar")
    public mp_openid: string = "";
    // 微信用户头像
    @Column("text")
    public avatar : string = "";
    // 微信用户昵称
    @Column("varchar")
    public nickname : string = "";
    // 认证令牌
    @Column("varchar")
    public authkey:string = "";
    // 失效时间
    @Column("integer")
    public expired:number=0;
}
