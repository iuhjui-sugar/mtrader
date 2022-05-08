import { Module } from "@nestjs/common";
import { PositionService } from "./services/position/position.service";
import { StorageService } from "./services/storage/storage.service";
import { BullModule } from "@nestjs/bull";
import { MonitorService } from "./services/monitor/monitor.service";

@Module({
    imports : [
        BullModule.registerQueue({
            name  : "supervisor",
            redis : {
                host : "74.120.173.228",
                port : 5070,
            },
        }),
    ],
    providers : [
        StorageService,
        PositionService,
        MonitorService,
    ],
    exports : [
        PositionService,
    ],
})
export class PositionModule {}
