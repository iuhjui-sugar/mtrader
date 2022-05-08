import { Module } from "@nestjs/common";
import { AccessorModule } from "./accessor";
import { EndpointModule } from "./endpoint";
import { TickerModule } from "./ticker";
import { AccountModule } from "./account";
import { PositionModule } from "./position";
import { EntrustModule } from "./entrust";
import { GATEIO_Controller } from "./GATEIO.controller";

@Module({
    imports : [
        AccessorModule,
        EndpointModule,
        TickerModule,
        AccountModule,
        PositionModule,
        EntrustModule,
    ],
    providers : [],
    controllers : [
        GATEIO_Controller,
    ],
})
export class GATEIO_Module {}
