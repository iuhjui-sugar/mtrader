import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { AuthorizeEvidence } from "./common/common.entities";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class WeixinService {
    constructor(
        @InjectRepository(AuthorizeEvidence)
        private evidenceRepository:Repository<AuthorizeEvidence>,
    ){}
    
    // 查找授权证据
    // 对象不存在错误没有处理
    public async resolveEvidence(unionid:string,authkey:string){
        const isExists = 1 === (await this.evidenceRepository.count({where:{unionid,authkey}}));
        if (isExists === false){
            throw new BadRequestException("微信授权凭证不存在");
        }
        const nowtime  = Math.floor(new Date().getTime()/1000);
        const evidence = await this.evidenceRepository.findOneOrFail({
            where : {
                unionid : unionid,
                authkey : authkey,
            },
        });
        if (nowtime > evidence.expired) {
            throw new Error("微信授权凭证已超时失效");
        }
        return evidence;
    }
}