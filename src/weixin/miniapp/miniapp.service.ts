import axios from "axios";
import { nanoid } from "nanoid";
import { stringify } from "qs";
import { createDecipheriv } from "crypto";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizeDTO } from "./miniapp.dtos";
import { MiniAppSession } from "./miniapp.values";
import { MiniAppOpenData } from "./miniapp.values";
import { WeixinUserInfo } from "../common/common.values";
import { AuthorizeEvidence } from "../common/common.entities";
import { ConfigureService } from "../../configure/configure.service";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class MiniAppService {

    constructor(
        @InjectRepository(AuthorizeEvidence)
        private evidenceRepository:Repository<AuthorizeEvidence>,

        private configureService:ConfigureService,
    ){}

    // 开放数据解密
    public decrypt(session_key: string, iv: string,alldata:string):MiniAppOpenData{
        let decoded = "";
        // 解密
        let decipher = createDecipheriv("aes-128-cbc", Buffer.from(session_key,"base64"), Buffer.from(iv,"base64"));
        // 设置自动 padding 为 true，删除填充补位
        decipher.setAutoPadding(true);
        decoded = decipher.update(alldata,"base64","utf-8");
        decoded = decoded+decipher.final("utf8");
        // 解析明文
        return JSON.parse(decoded);
    }

    // 根据 jsCode 获取用户 session 信息
    // @param code 小程序端通过 wx.login 获取
    public async session(code:string): Promise<MiniAppSession>{
        // 请求数据
        const apiurl   = "https://api.weixin.qq.com/sns/jscode2session";
        const response = await axios.get(apiurl+"?"+stringify({
            appid  : this.configureService.weixin().miniapp.app_id,
            secret : this.configureService.weixin().miniapp.secret,
            js_code : code,
            grant_type : "authorization_code",
        }));
        const alldata  = (response.data) as any ;
        if (!!alldata.errcode===true){
            throw new BadRequestException(`[微信错误]${alldata.errcode}=>${alldata.errmsg}`);
        }
        return alldata as MiniAppSession;
    }

    // 小程序授权
    public async authorize(options:AuthorizeDTO){
        // 获取认证会话
        const session = await this.session(options.code);
        // 解密开放数据
        const opendata = this.decrypt(session.session_key,options.iv,options.secret);
        // 组装数据
        const userinfo = new WeixinUserInfo();
        userinfo.unionid = opendata.unionId;
        userinfo.mp_openid = session.openid;
        userinfo.avatar = opendata.avatarUrl;
        userinfo.nickname = opendata.nickName;
        // 保存授权证据
        const evidence = new AuthorizeEvidence();
        evidence.unionid = userinfo.unionid;
        evidence.mp_openid = userinfo.mp_openid;
        evidence.avatar = userinfo.avatar;
        evidence.nickname = userinfo.nickname;
        evidence.authkey = nanoid();
        evidence.expired = Math.floor(new Date().getTime()/1000);
        evidence.expired = evidence.expired+(60*60*24*7); 
        await this.evidenceRepository.save(evidence);
        // 结束流程
        return evidence;
    }

}