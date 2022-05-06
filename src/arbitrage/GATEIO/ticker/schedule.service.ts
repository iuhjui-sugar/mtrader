import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Logger } from "@nestjs/common";
import { FuturesService } from "../accessor";
import { SpotService } from "../accessor";
import { TickerService } from "./ticker.service";
import { Ticker } from "./ticker.values";
import { writeFileSync } from "fs";

@Injectable()
export class ScheduleService {
    private logger = new Logger("TickerScheduleService");

    constructor(
        private spotService:SpotService,

        private futuresService:FuturesService,

        private tickerService:TickerService,
    ){};
    /*
    @Cron("0/10 * * * * *")
    public async pullingTickers(){
        try {
            this.logger.debug("ticker data auto update started!");
            const contracts = await this.futuresService.listFuturesContracts({settle:"usdt"});
            const spotTickers = await this.spotService.listTickers({});

            writeFileSync("./futures-tickers.json",JSON.stringify(contracts,null,4));
            const tickers = Ticker.fusionSpotTickers(Ticker.fromContracts(contracts),spotTickers) ;
            this.tickerService.refreshTickers(tickers);
            this.logger.debug("ticker data auto update complated!");
        }
        catch(error:unknown){
            console.log("错误详情:",error);
        }
    }
    */
}

