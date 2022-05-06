import { Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Process } from "@nestjs/bull";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";

@Processor("supervisor")
export class GATEIO_Processor {

    constructor(
        @InjectQueue("supervisor")
        private queue:Queue,
    ){}

    @Process()
    public async autoreport(job:Job<unknown>){
        console.log("当前的数据",job.data);
        await this.queue.add({
            iterate : 0,
            nowtime : Math.floor(new Date().getTime()/1000),
        },{delay:3000});
    }

}