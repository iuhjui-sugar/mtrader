import { Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";
import { EntityManager } from "typeorm";
import { Position } from "./storage.entities";
import { Entrust } from "./storage.entities";
import { NoExistsPositionError } from "./storeage.errors";
import { FindPositionError } from "./storeage.errors";
import { NoExistsEntrustError } from "./storeage.errors";
import { FindEntrustError } from "./storeage.errors";

@Injectable()
export class StorageService {
    // 更新仓位的大小
    public async updatePositionSize(database:EntityManager,position:Position,size:number){
        position.position_size = size;
        position.modified = Math.floor(new Date().getTime()/1000);
        await database.getRepository(Position).save(position);
        return position;
    }

    // 更新仓位的杠杆值
    public async updatePositionLeverage(database:EntityManager,position:Position,leverage:number){
        position.leverage = leverage;
        position.modified = Math.floor(new Date().getTime()/1000);
        await database.getRepository(Position).save(position);
        return position;
    }
    
    // 更新委托的状态值
    public async updateEntrustStatus(database:EntityManager,entrust:Entrust,status:"ok"|"wait"|"abort"){
        entrust.status = status;
        entrust.modified = Math.floor(new Date().getTime()/1000);
        return await database.getRepository(Entrust).save(entrust);
    }

    // 根据仓位创建一个委托单对象
    public async createEntrust(database:EntityManager,position:Position,size:number,direction:"increase"|"decrease"){
        // 生成当前时间
        const nowtime = Math.floor(new Date().getTime()/1000);
        // 构造一个委托实体
        const entrust = new Entrust();
        entrust.entrustid = nanoid(32);
        entrust.userid = position.userid;
        entrust.contract = position.contract;
        entrust.direction = direction;
        entrust.position_size = size;
        entrust.status = "wait";
        entrust.modified = nowtime;
        entrust.created = nowtime;
        // 保存委托实体对象
        await database.getRepository(Entrust).save(entrust);
        // 结束流程
        return entrust;
    }

    // 派生一个仓位对象
    public async derivePosition(database:EntityManager,userid:string,contract:string){
        // 生成当前时间
        let nowtime = Math.floor(new Date().getTime()/1000);
        // 获取系统系统仓位数据
        let position = await database.getRepository(Position).findOne({where:{
            userid : userid,
            contract : contract,
        }});
        // 如果系统仓位不存在自动构造一个
        if (position ===  undefined){
            position = new Position();
            position.userid = userid;
            position.contract = contract;
            position.position_size = 0;
            position.leverage = 2;
            position.modified = nowtime;
            position.created = nowtime;
        }
        // 保存仓位实体
        await database.getRepository(Position).save(position);
        // 结束流程
        return position;
    }

    // 获取仓位的委托对象列表
    public async findEntrustsByPosition(database:EntityManager,position:Position,status:"ok"|"wait"|"abrot"){
        return await database.getRepository(Entrust).find({where:{
            userid:position.userid,
            contract : position.contract,
            status : status,
        }});
    }

    // 查找单个仓位对象
    // @throw FindPositionError
    public async findPosition(database:EntityManager,userid:string,contract:string){
        // 获取系统仓位信息
        let position = await database.getRepository(Position).findOne({where:{
            userid : userid,
            contract : contract,
        }});
        // 如果仓位不存在抛出错误
        if (position === undefined){
            throw new FindPositionError(new NoExistsPositionError());    
        }
        // 结束流程
        return position;
    }

    // 查找单个委托对象
    // @throw FindEntrustError
    public async findEntrust(database:EntityManager,entrustid:string,status:"wait"|"ok"|"abort"){
        // 获取仓位委托信息
        let entrust = await database.getRepository(Entrust).findOne({where:{
            entrustid : entrustid,
            status : status,
        }});
        // 如果仓位委托不存在抛出错误
        if (entrust === undefined){
            throw new FindEntrustError(new NoExistsEntrustError());    
        }
        // 结束流程
        return entrust;
    }

    // 查找仓位列表
    public async findPositions(database:EntityManager,userid:string){
        return await database.getRepository(Position).find({where:{
            userid : userid,
        }});
    }

    // 查找委托列表
    public async findEntrusts(database:EntityManager,userid:string){
        return await database.getRepository(Entrust).find({where:{
            userid : userid,
            status : "wait",
        }});
    }
}


