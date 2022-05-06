import { Injectable } from "@nestjs/common";
import { Position } from "./position.entities";
import { CreatePositionDTO  } from "./position.dtos";
import { ResolvePositionsDTO } from "./position.dtos";
import { EntrustOrder } from "./position.entities";
import { Transaction } from "./position.entities";
import { nanoid } from "nanoid";
import { UpdatePositionDTO } from "./position.dtos";
import { ResolveEntrustsDTO } from "./position.dtos";
import { QueryRunner } from "typeorm";

@Injectable()
export class PositionService {

    constructor(){}

    // 创建一个交易
    public async createTransaction(runner:QueryRunner,entrust:EntrustOrder,txtype:"spot"|"futures"){
        // 生成当前时间
        let nowtime = Math.floor(new Date().getTime()/1000);
        // 构造一个交易实体
        let tx = new Transaction();
        tx.tradeid = nanoid(32);
        tx.entrustid = entrust.entrustid;
        tx.orderid = "";
        tx.txtype = txtype;
        tx.price  = 0;
        tx.size = 0;
        tx.iterate = 0;
        tx.txstatus = "wait";
        tx.modified = nowtime;
        tx.created = nowtime;
        // 保存交易实体
        await runner.manager.getRepository(Transaction).save(tx);
        // 结束流程
        return tx;
    }

    // 创建一个委托
    public async createEntrust(runner:QueryRunner,posotion:Position,direction:"increase"|"decrease",position_size:number){
        // 生成当前时间
        let nowtime = Math.floor(new Date().getTime()/1000);
        // 构造一个委托实体
        let entrust = new EntrustOrder();
        entrust.entrustid = nanoid(32);
        entrust.userid = posotion.userid;
        entrust.contract = posotion.contract;
        entrust.direction = direction;
        entrust.position_size = position_size;
        entrust.status = "wait";
        entrust.modified = nowtime;
        entrust.created = nowtime;
        // 保存委托实体对象
        await runner.manager.getRepository(EntrustOrder).save(entrust);
        // 创建现货交易
        await this.createTransaction(runner,entrust,"spot");
        // 创建合约交易
        await this.createTransaction(runner,entrust,"futures");
        // 结束流程
        return entrust;
    }

    // 创建一个仓位
    public async createPosition(runner:QueryRunner,options:CreatePositionDTO){
        // 生成当前时间
        let nowtime = Math.floor(new Date().getTime()/1000);
        // 获取系统仓位信息
        let position = await runner.manager.getRepository(Position).findOne({where:{
            userid:options.userid,
            contract : options.contract,
        }});
        // 如果系统仓位不存在自动构造一个
        if (position ===  undefined){
            position = new Position();
            position.userid = options.userid;
            position.contract = options.contract;
            position.position_size = 0;
            position.leverage = options.leverage;
            position.modified = nowtime;
            position.created = nowtime;
        }
        // 重复建仓拦截(合约张数不为0)
        if (position.position_size > 0){
            throw new Error("禁止重复建仓,合约张数不为0!");
        }
        // 重复建仓拦截(仓位存在未完成委托)
        let is_exisis_wait_entrust =  await runner.manager.getRepository(EntrustOrder).count({where:{
            userid:position.userid,
            contract : position.contract,
            status : "wait",
        }});
        if (is_exisis_wait_entrust > 0){
            throw new Error("禁止重复建仓,仓位存在未完成委托!");
        }
        // 更新仓位杠杆与时间
        position.leverage = options.leverage;
        position.modified = nowtime;
        position.created = nowtime;
        // 保存仓位实体
        await runner.manager.getRepository(Position).save(position);
        // 创建加仓委托
        await this.createEntrust(runner,position,"increase",options.position_size);
        // 结束流程
        return position;
    }

    // 更新一个仓位
    public async updatePosition(runner:QueryRunner,options:UpdatePositionDTO,direction:"increase"|"decrease"){
        // 生成当前时间
        let nowtime = Math.floor(new Date().getTime()/1000);
        // 获取系统仓位信息
        let position = await runner.manager.getRepository(Position).findOne({where:{
            userid : options.userid,
            contract : options.contract,
        }});
        // 如果仓位不存在抛出错误
        if (position === undefined){
            throw new Error("不存在的仓位!");
        }
        // 更新仓位杠杆与时间
        position.leverage = options.leverage;
        position.modified = nowtime;
        // 保存仓位实体
        await runner.manager.getRepository(Position).save(position);
        // 创建加仓委托
        await this.createEntrust(runner,position,direction,options.position_size);
        // 结束流程
        return position;
    }

    // 增加一个仓位
    public async increasePosition(runner:QueryRunner,options:UpdatePositionDTO){
        return await this.updatePosition(runner,options,"increase");
    }

    // 减少一个仓位
    public async decreasePosition(runner:QueryRunner,options:UpdatePositionDTO){
        return await this.updatePosition(runner,options,"decrease");
    }

    // 获取仓位列表
    public async resolvePositions(runner:QueryRunner,options:ResolvePositionsDTO){
        return await runner.manager.getRepository(Position).find({where:{
            userid : options.userid,
        }});
    }

    // 获取委托列表
    public async resolveEntrusts(runner:QueryRunner,options:ResolveEntrustsDTO){
        return await runner.manager.getRepository(EntrustOrder).find({where:{
            userid : options.userid,
            status : "wait",
        }});
    }
}