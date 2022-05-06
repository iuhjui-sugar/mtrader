import { Module } from "@nestjs/common";
import { EntrustService } from "./entrust.service";
import { TickerModule } from "../ticker";
import { AccessorModule } from "../accessor";
import { EndpointModule } from "../endpoint";
import { AccountModule } from "../account";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports : [
        AccountModule,
        EndpointModule,
        AccessorModule,
        TickerModule,
    ],
    providers : [
        EntrustService,
    ],
    exports : [
        EntrustService,
    ],
})
export class EntrustModule {}



