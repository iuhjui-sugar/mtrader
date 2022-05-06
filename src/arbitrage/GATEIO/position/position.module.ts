import { Module } from "@nestjs/common";
import { PositionService } from "./position.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Position } from "./position.entities";
import { EntrustOrder } from "./position.entities";
import { Transaction } from "./position.entities";

@Module({
    imports : [
        TypeOrmModule.forFeature([
            Position,
            EntrustOrder,
            Transaction,
        ]),
    ],
    providers : [
        PositionService,
    ],
    exports : [
        PositionService,
    ],
})
export class PositionModule {}
