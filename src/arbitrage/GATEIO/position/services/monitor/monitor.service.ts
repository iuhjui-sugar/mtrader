import { Processor } from "@nestjs/bull";
import { InjectQueue } from "@nestjs/bull";
import { Process } from "@nestjs/bull";
import { Queue } from "bull";
import { Job } from "bull";
import { Connection } from "typeorm";
import { Entrust } from "../storage/storage.entities";
import { PositionService } from "../position/position.service";

@Processor("supervisor")
export class MonitorService {
    constructor(
        @InjectQueue("supervisor")
        private channel:Queue,

        private connection:Connection,

        private positionService:PositionService,
    ){}

    // 监视仓位委托单
    @Process("monitorEntrust")
    public async monitorEntrust(job:Job<Entrust>){
        await this.connection.transaction("SERIALIZABLE",async (database)=>{
            return await this.positionService.consumeEntrust(database,job.data.entrustid);
        });
    }
}