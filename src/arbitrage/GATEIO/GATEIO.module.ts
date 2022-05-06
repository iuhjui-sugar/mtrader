import { Module } from "@nestjs/common";
import { AccessorModule } from "./accessor";
import { EndpointModule } from "./endpoint";
import { TickerModule } from "./ticker";
import { AccountModule } from "./account";
import { PositionModule } from "./position";
import { EntrustModule } from "./entrust";
import { GATEIO_Controller } from "./GATEIO.controller";
import { BullModule } from "@nestjs/bull";
import { GATEIO_Processor } from "./GATEIO.processor";

@Module({
    imports : [
        BullModule.registerQueue({
            name  : "supervisor",
            redis : {
                host : "74.120.173.228",
                port : 5070,
            },
        }),
        AccessorModule,
        EndpointModule,
        TickerModule,
        AccountModule,
        PositionModule,
        EntrustModule,
    ],
    providers : [
        GATEIO_Processor,
    ],
    controllers : [
        GATEIO_Controller,
    ],
})
export class GATEIO_Module {}
