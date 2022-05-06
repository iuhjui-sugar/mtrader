import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigureService } from "../configure/configure.service";
import { nanoid } from "nanoid";
import { verify,decode,sign } from "jsonwebtoken";
import { Session } from "./user.values";
import { MainUser } from "./user.entities";
import { LoginUser } from "./user.entities";
import { DuplicateOperationError } from "./user.errors";
import { MainuserNoExistsError } from "./user.errors";
import { BindSizeNoZeroError as BindSizeNoZeroError } from "./user.errors";
import { LinkSizeNoZeroError } from "./user.errors";
import { FreeMainuserError } from "./user.errors";
import { BindExpanduserError } from "./user.errors";
import { UnbindExpanduserError } from "./user.errors";
import { LinkExtrainfoError } from "./user.errors";
import { UnlinkExtrainfoError } from "./user.errors";
import { IssueSessionError } from "./user.errors";
import { LoginuserExistsError } from "./user.errors";
import { MakeLoginuserError } from "./user.errors";
import { LoginuserNoExistsError } from "./user.errors";
import { FreeLoginuserError } from "./user.errors";
import { RegisterError } from "./user.errors";
import { PasswordMismatchError } from "./user.errors";
import { LoginError } from "./user.errors";
import { TokenVerifyFailError } from "./user.errors";
import { LoginByTokenError } from "./user.errors";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(MainUser) 
        private mainuserRepository:Repository<MainUser>,

        @InjectRepository(LoginUser)
        private loginuserRepository:Repository<LoginUser>,

        private configService:ConfigureService,

    ){};

    // 检查主体账户是否存在
    public async hasMainuser(userid:string){
        return 1 === (await this.mainuserRepository.count({where:{userid}}));
    }

    // 创建主体用户
    public async makeMainuser(avatar:string,nickname:string){
        let mainuser = new MainUser();
        mainuser.userid    = nanoid(32);
        mainuser.avatar    = avatar;
        mainuser.nickname  = nickname;
        mainuser.created   = Math.floor(new Date().getTime()/1000);
        await this.mainuserRepository.save(mainuser);
        return mainuser;
    }

    // 释放主体用户
    public async freeMainuser(userid:string){
        // 检测主体用户存在状态
        if ((await this.hasMainuser(userid)) === false){
            throw new FreeMainuserError(new MainuserNoExistsError());    
        }
        // 获取主体用户并删除
        const mainuser = await this.mainuserRepository.findOneOrFail({
            where : {userid},
        });
        // 检测绑定情况
        const bindsize = (<string[]>JSON.parse(mainuser.binds)).length;
        if (bindsize > 0){
            throw new FreeMainuserError(new BindSizeNoZeroError());
        }
        // 检测链接情况
        const linksize = (<string[]>JSON.parse(mainuser.links)).length;
        if (linksize > 0){
            throw new FreeMainuserError(new LinkSizeNoZeroError());
        }
        await this.mainuserRepository.remove(mainuser);
        // 结束流程
        return mainuser;
    }

    // 绑定拓展用户
    public async bindExpanduser(userid:string,bindname:string){
        // 检测主体用户是否存在
        if ((await this.hasMainuser(userid))  === false){
            throw new BindExpanduserError(new MainuserNoExistsError());
        }
        // 更新绑定数据
        let mainuser = await this.mainuserRepository.findOneOrFail({
            where : {userid},
        });
        let binds = (<string[]>JSON.parse(mainuser.binds));
        if (binds.includes(bindname) === true){
            throw new BindExpanduserError(new DuplicateOperationError())    
        }
        binds.push(bindname);
        mainuser.binds = JSON.stringify(binds);
        await this.mainuserRepository.save(mainuser);
        // 结束流程
        return binds;
    }

    // 解绑定拓展用户
    public async unbindExpanduser(userid:string,bindname:string){
        // 检测主体用户是否存在
        if ((await this.hasMainuser(userid))  === false){
            throw new UnbindExpanduserError(new MainuserNoExistsError());    
        }
        // 更新数据
        let mainuser = await this.mainuserRepository.findOneOrFail({
            where : {userid},
        });
        let binds = (<string[]>JSON.parse(mainuser.binds));
        if (binds.includes(bindname) === false){
            throw new UnbindExpanduserError(new DuplicateOperationError());    
        }
        binds = binds.filter((name)=>name !== bindname);
        mainuser.binds = JSON.stringify(binds);
        await this.mainuserRepository.save(mainuser);
        // 结束流程
        return binds;
    }

    // 关联额外信息
    public async linkExtrainfo(userid:string,linkname:string){
        // 检测主体用户是否存在
        if ((await this.hasMainuser(userid))  === false){
            throw new LinkExtrainfoError(new MainuserNoExistsError());    
        }
        // 更新数据
        let mainuser = await this.mainuserRepository.findOneOrFail({
            where : {userid},
        });
        let links = (<string[]>JSON.parse(mainuser.links));
        if (links.includes(linkname) === true){
            throw new LinkExtrainfoError(new DuplicateOperationError());
        }
        links.push(linkname);
        mainuser.links = JSON.stringify(links);
        await this.mainuserRepository.save(mainuser);
        // 结束流程
        return links;
    }

    // 解关联额外信息
    public async unlinkExtrainfo(userid:string,linkname:string){
        // 检测主体用户是否存在
        if ((await this.hasMainuser(userid))  === false){
            throw new UnlinkExtrainfoError(new MainuserNoExistsError());    
        }
        // 更新数据
        let mainuser = await this.mainuserRepository.findOneOrFail({
            where : {userid},
        });
        let links = (<string[]>JSON.parse(mainuser.links));
        if (links.includes(linkname) === false){
            throw new UnlinkExtrainfoError(new DuplicateOperationError());    
        }
        links = links.filter((name)=>name!==linkname);
        mainuser.links = JSON.stringify(links);
        await this.mainuserRepository.save(mainuser);
        // 结束流程
        return links;
    }

    // 授予会话
    public async issueSession(userid:string){ 
        // 获取主体用户信息
        if ((await this.hasMainuser(userid))  === false){
            throw new IssueSessionError(new MainuserNoExistsError());
        }
        const mainuser = await this.mainuserRepository.findOneOrFail({
            where : {userid},
        });
        const binds = (<string[]>JSON.parse(mainuser.binds));
        const links = (<string[]>JSON.parse(mainuser.links))
        // 授予令牌
        const token = sign({userid},this.configService.jwt_secret(),{expiresIn:"7d"});
        // 转换为会话信息
        const nowtime = Math.floor(new Date().getTime()/1000)
        const session = new Session();
        session.token    = token;
        session.userid   = mainuser.userid;
        session.avatar   = mainuser.avatar;
        session.nickname = mainuser.nickname;
        session.binds    = binds;
        session.links    = links;
        session.expired  = nowtime+(60*60*24*7);
        session.created  = nowtime;
        // 结束流程
        return session;
    }

    // 创建登录用户
    public async makeLoginuser(userid:string,username:string,password:string){
        try {
            // 检测用户名是否存在
            const isNewLoginuser = 0 === (await this.loginuserRepository.count({where:{username}}));
            if (isNewLoginuser === false){
                throw new MakeLoginuserError(new LoginuserExistsError());    
            }
            // 检测主体用户是否存在
            if ((await this.hasMainuser(userid))  === false){
                throw new MakeLoginuserError(new MainuserNoExistsError())
            }
            // 保存登录账户
            const loginuser = new LoginUser();
            loginuser.userid   = userid;
            loginuser.username = username;
            loginuser.password = password;
            await this.loginuserRepository.save(loginuser);
            // 绑定到主体用户
            await this.bindExpanduser(userid,"loginuser");
            // 结束流程
            return loginuser;   
        }
        catch (error:unknown) {
            // 错误处理
            if (error instanceof BindExpanduserError){
                throw new MakeLoginuserError(error);
            }
            else{
                throw error;
            }
        }
    }

    // 释放登录用户
    public async freeLoginuser(username:string){
        try {
            // 检测登录用户是否存在
            const isExistsLoginUser = 1 === (await this.loginuserRepository.count({where:{username}}));
            if (isExistsLoginUser === false){
                throw new FreeLoginuserError(new LoginuserNoExistsError());    
            }
            // 执行删除
            const loginuser = await this.loginuserRepository.findOneOrFail({
                where : {username},
            });
            await this.loginuserRepository.remove(loginuser);
            // 与主体账户解绑
            await this.unbindExpanduser(loginuser.userid,"loginuser");
            // 结束流程
            return loginuser;   
        } 
        catch (error:unknown) {
            // 错误处理
            if (error instanceof UnbindExpanduserError){
                throw new FreeLoginuserError(error);
            }
            else{
                throw error;
            }
        }
    }

    // 注册账号
    public async register(username:string,password:string){
        try {
            const mainuser = await this.makeMainuser("",username);
            const loginuser = await this.makeLoginuser(mainuser.userid,username,password);   
            return await this.issueSession(loginuser.userid);
        } 
        catch (error:unknown) {
            if (error instanceof MakeLoginuserError){
                throw new RegisterError(error);
            }
            if (error instanceof IssueSessionError){
                throw new RegisterError(error);
            }
            else {
                throw error;
            }
        }
    }

    // 通过用户名与密码进行登录
    public async login(username:string,password:string){
        try {
            // 检测可登录账户是否存在
            let isExistsLoginUser = 1 === (await this.loginuserRepository.count({where:{username}}));
            if (isExistsLoginUser === false){
                throw new LoginError(new LoginuserNoExistsError());
            }
            let loginuser = await this.loginuserRepository.findOneOrFail({
                where : {username},
            });
            if (loginuser.password !== password){
                throw new LoginError(new PasswordMismatchError());
            }
            // 授予会话
            return await this.issueSession(loginuser.userid);
        }
        catch(error:unknown){
            // 错误处理
            if (error instanceof IssueSessionError){
                throw new LoginError(error);
            }
            else {
                throw error;
            }
        }
    }

    // 通过令牌进行登录
    public async loginByToken(token:string){
        try {
            // 验证令牌
            try {
                verify(token,this.configService.jwt_secret());    
            }
            catch (error:unknown) {
                throw new LoginByTokenError(new TokenVerifyFailError());
            }
            // 取得用户编号
            const bundle = decode(token);
            // 授予会话
            return await this.issueSession((<any>bundle).userid);   
        } 
        catch (error:unknown) {
            // 错误处理
            if (error instanceof IssueSessionError){
                throw new LoginByTokenError(error);
            }
            else{
                throw error;
            }
        }
    }

}