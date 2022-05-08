import { Injectable } from "@nestjs/common";
import { Position } from "../storage/storage.entities";
import { CreatePositionDTO  } from "./position.dtos";
import { FindPositionsDTO } from "./position.dtos";
import { UpdatePositionDTO } from "./position.dtos";
import { FindEntrustsDTO } from "./position.dtos";
import { EntityManager } from "typeorm";
import { StorageService } from "../storage/storage.service";
import { DuplicateCreatePositionError } from "./position.errors";
import { CreatePositionError } from "./position.errors";
import { UpdatePositionError } from "./position.errors";
import { FindPositionError } from "../storage/storeage.errors";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { Entrust } from "../storage/storage.entities";
import { ConsumeEntrustError } from "./position.errors";
import { FindEntrustError } from "../storage/storeage.errors";

@Injectable()
export class PositionService {

    constructor(
        @InjectQueue("supervisor")
        private channel:Queue,

        private stroage:StorageService,
    ){}

    // 把仓位委托消费掉
    // @throw ConsumeEntrustError
    public async consumeEntrust(database:EntityManager,entrustid:string){
        try {
            // 获取单个仓位委托数据
            let entrust = await this.stroage.findEntrust(database,entrustid,"wait");
            // 获取单个系统仓位数据
            let position = await this.stroage.findPosition(database,entrust.userid,entrust.contract);
            // 把委托的状态更新为已完成
            entrust = await this.stroage.updateEntrustStatus(database,entrust,"ok");
            // 更新仓位大小(如果是正向委托)
            if (entrust.direction === "increase"){
                position = await this.stroage.updatePositionSize(database,position,entrust.position_size);
            }
            // 结束流程
            return entrust;
        }
        catch(error:unknown){
            if (error instanceof FindEntrustError){
                throw new ConsumeEntrustError(error);
            }
            if (error instanceof FindPositionError){
                throw new ConsumeEntrustError(error);
            }
            else{
                throw error;
            }
        }
    }

    // 监视仓位委托
    public async monitorEntrust(entrust:Entrust){
        this.channel.add("monitorEntrust",entrust,{delay:10*1000});
    }
    
    // 创建一个仓位
    // @throw CreatePositionError
    public async createPosition(database:EntityManager,options:CreatePositionDTO){
        // 派生一个仓位对象
        let position = await this.stroage.derivePosition(database,options.userid,options.contract);
        // 重复建仓拦截(合约张数不为0)
        if (position.position_size > 0){
            throw new CreatePositionError(new DuplicateCreatePositionError());    
        }
        // 重复建仓拦截(仓位存在未完成委托)
        let entrusts = await this.stroage.findEntrustsByPosition(database,position,"wait");
        if (entrusts.length > 0){
            throw new CreatePositionError(new DuplicateCreatePositionError());
        }
        // 更新仓位的杠杆值
        position = await this.stroage.updatePositionLeverage(database,position,options.leverage);
        // 创建加仓委托
        return await this.stroage.createEntrust(database,position,options.position_size,"increase"); 
    }

    // 更新一个仓位
    // @throw UpdatePositionError
    public async updatePosition(database:EntityManager,options:UpdatePositionDTO,direction:"increase"|"decrease"){
        try {
            // 获取仓位对象
            let position = await this.stroage.findPosition(database,options.userid,options.contract);
            // 更新仓位杠杆值
            position = await this.stroage.updatePositionLeverage(database,position,options.leverage);
            // 创建加/减仓委托
            const entrust = await this.stroage.createEntrust(database,position,options.position_size,direction);
            // 更新仓位大小(如果是减仓委托)
            if(entrust.direction === "decrease"){
                await this.stroage.updatePositionSize(database,position,-entrust.position_size);
            }
            // 结束流程
            return entrust;
        }
        catch (error:unknown){    
            if (error instanceof FindPositionError){
                throw new UpdatePositionError(error);
            }
            else{
                throw error;
            }
        }
    }

    // 增加一个仓位
    // @throw UpdatePositionError
    public async increasePosition(database:EntityManager,options:UpdatePositionDTO){
        return await this.updatePosition(database,options,"increase");
    }

    // 减少一个仓位
    // @throw UpdatePositionError
    public async decreasePosition(database:EntityManager,options:UpdatePositionDTO){
        return await this.updatePosition(database,options,"decrease");
    }

    // 获取仓位列表
    public async findPositions(database:EntityManager,options:FindPositionsDTO){
        return await this.stroage.findPositions(database,options.userid);
    }

    // 获取委托列表
    public async findEntrusts(database:EntityManager,options:FindEntrustsDTO){
        return await this.stroage.findEntrusts(database,options.userid);
    }
}