import { Injectable } from "@nestjs/common";
import { UsersService } from "../user.service";
import { Repository } from "typeorm";
import { WeixinUser } from "./weixinuser.entities";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizeEvidence } from "../../weixin/common/common.entities";
import { EnterByWeixinDTO } from "./weixinuser.dtos";
import { WeixinService } from "../../weixin/weixin.service";
import { MainuserNoExistsError } from "../user.errors";
import { BindExpanduserError } from "../user.errors";
import { UnbindExpanduserError } from "../user.errors";
import { WeixinuserExistsError } from "./weixinuser.errors";
import { MakeWeixinuserError } from "./weixinuser.errors";
import { WeixinuserNoExistsError } from "./weixinuser.errors";
import { FreeWeixinuserError } from "./weixinuser.errors";

@Injectable()
export class WeixinUserService {
    constructor(
        @InjectRepository(WeixinUser)
        private weixinuserRepository:Repository<WeixinUser>,

        private weixinService:WeixinService,

        private userService:UsersService,
    ){}

    // 创建微信用户
    public async makeWeixinuser(userid:string,evidence:AuthorizeEvidence){
        try {
            // 检测微信占用状态
            let isNewUser = 0 === (await this.weixinuserRepository.count({where:{unionid:evidence.unionid}}))
            if (isNewUser === false){
                throw new MakeWeixinuserError(new WeixinuserExistsError());
            }
            // 检测主体用户是否存在
            if ((await this.userService.hasMainuser(userid))  === false){
                throw new MakeWeixinuserError(new MainuserNoExistsError());    
            }
            // 保存微信用户
            let weixinuser = new WeixinUser();
            weixinuser.unionid   = evidence.unionid;
            weixinuser.userid    = userid;
            weixinuser.mp_openid = evidence.mp_openid;
            weixinuser.avatar    = evidence.avatar;
            weixinuser.nickname  = evidence.nickname;    
            await this.weixinuserRepository.save(weixinuser);
            // 绑定拓展用户
            await this.userService.bindExpanduser(userid,"weixinuser");
            // 结束流程
            return weixinuser;
        }
        catch(error:unknown){
            if (error instanceof BindExpanduserError){
                throw new MakeWeixinuserError(error);
            }
            else{
                throw error;
            }
        }
    }

    // 释放微信用户
    // 错误没有处理
    public async freeWeixinuser(unionid:string){
        try {
            // 检测微信用户是否存在
            let isExistsWeixinUser = 1 === (await this.weixinuserRepository.count({where:{unionid}}));
            if (isExistsWeixinUser === false){
                throw new FreeWeixinuserError(new WeixinuserNoExistsError());    
            }
            // 获取微信用户
            let weixinuser = await this.weixinuserRepository.findOneOrFail({
                where : {unionid},
            });
            // 执行删除
            await this.weixinuserRepository.remove(weixinuser);
            // 解绑定拓展用户
            await this.userService.unbindExpanduser(weixinuser.userid,"weixinuser");
            // 结束流程
            return weixinuser;
        }
        catch(error:unknown){
            if (error instanceof UnbindExpanduserError){
                throw new FreeWeixinuserError(error);
            }
            else{
                throw error;
            }
        }
    }

    // 微信用户入口(登录注册二合一)
    // 错误没有处理
    public async enterByWeixin(options:EnterByWeixinDTO){
        // 获取微信授权凭据
        let evidence = await this.weixinService.resolveEvidence(options.unionid,options.authkey);
        // 判断是否为一个新用户
        let isNewUser = 0 === (await this.weixinuserRepository.count({where:{unionid:evidence.unionid}}));
        if (isNewUser === false){
            // 执行注册流程
            let mainuser   = await this.userService.makeMainuser(evidence.avatar,evidence.nickname);
            let weixinuser = await this.makeWeixinuser(mainuser.userid,evidence);
            return await this.userService.issueSession(weixinuser.userid);
        }
        else{
            // 执行登录流程
            let weixinuser = await this.weixinuserRepository.findOneOrFail({
                where : {unionid:evidence.unionid},
            });
            return await this.userService.issueSession(weixinuser.userid);
        }
    }
    
}