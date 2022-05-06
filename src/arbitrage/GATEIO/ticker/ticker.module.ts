import { Module } from "@nestjs/common";
import { AccessorModule } from "../accessor";
import { TickerService } from "./ticker.service";
import { ScheduleService } from "./schedule.service";

@Module({
    imports : [
        AccessorModule,
    ],
    providers : [
        TickerService,
        ScheduleService,
    ],
    exports : [
        TickerService,
    ],
})
export class TickerModule {}