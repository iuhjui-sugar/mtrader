import { Injectable } from "@nestjs/common";
import { UsersService } from "../../../user/user.service";
import { GateIOEndpoint } from "./endpoint.entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { WalletService } from "../accessor";
import { MainuserNoExistsError } from "../../../user";
import { LinkExtrainfoError } from "../../../user";
import { UnlinkExtrainfoError } from "../../../user";
import { RemoteResponseError } from "../accessor";
import { DuplicateOperationError } from "./endpoint.errors";
import { LinkEndpointError } from "./endpoint.errors";
import { UnlinkEndpointError } from "./endpoint.errors";
import { EndpointNoExistsError } from "./endpoint.errors";
import { ResolveEndpointError } from "./endpoint.errors";

@Injectable()
export class EndpointService {

    constructor(
        @InjectRepository(GateIOEndpoint)
        private endpointRepository:Repository<GateIOEndpoint>,

        private userService:UsersService,

        private walletService:WalletService,
    ){}

    // 获取IO访问端点
    // @throw ResolveEndpointError
    public async resolveEndpoint(userid:string){
        const isExists = 1 === (await this.endpointRepository.count({where:{userid}}));
        if (isExists === false){
            throw new ResolveEndpointError(new EndpointNoExistsError());
        }
        return await this.endpointRepository.findOneOrFail({where:{userid}});
    }

    // 创建GATEIO访问端点
    public async linkIoEndpoint(userid:string,apikey:string,apisecret:string){
        try {
            // 拦截重复操作
            const isNewLink = 0 === (await this.endpointRepository.count({where:{userid}}));
            if (isNewLink === false){
                throw new LinkEndpointError(new DuplicateOperationError());
            }
            // 检测主体用户是否存在
            if ((await this.userService.hasMainuser(userid))  === false){
                throw new LinkEndpointError(new MainuserNoExistsError());
            }
            // 获取账户余额(验证访问端点的有效性)
            const totalBalance = await this.walletService.getTotalBalance({
                apikey : apikey,
                apisecret : apisecret,
                currency : "USD",
            });
            // 保存数据
            const endpoint = new GateIOEndpoint();
            endpoint.userid    = userid;
            endpoint.apikey    = apikey;
            endpoint.apisecret = apisecret;
            endpoint.linktime  = Math.floor(new Date().getTime()/1000);
            await this.endpointRepository.save(endpoint);
            // 关联额外信息
            await this.userService.linkExtrainfo(userid,"GATEIO.endpoint");
            // 结束流程
            return endpoint;
        }
        catch(error:unknown){
            // 错误处理
            if (error instanceof RemoteResponseError){
                throw new LinkEndpointError(error);
            }
            if (error instanceof LinkExtrainfoError){
                throw new LinkEndpointError(error);
            }
            else{
                throw error;
            }
        }
        
        


    }

    // 释放GATEIO访问端点
    public async unlinkIoEndpoint(userid:string){
        try {
            // 拦截重复操作
            let isExistsEndpoint = 1 === (await this.endpointRepository.count({where:{userid}}));
            if (isExistsEndpoint === false){
                throw new UnlinkEndpointError(new DuplicateOperationError());
            }
            // 获取访问端点
            let endpoint = await this.endpointRepository.findOneOrFail({where:{userid}})
            // 执行删除
            await this.endpointRepository.remove(endpoint);
            // 解关联额外信息
            await this.userService.unlinkExtrainfo(userid,"GATEIO.endpoint");
            // 结束流程
            return endpoint;
        }
        catch(error:unknown){
            if (error instanceof UnlinkExtrainfoError){
                return new UnlinkEndpointError(error);
            }
            else{
                throw error;
            }
        }
    }

}

