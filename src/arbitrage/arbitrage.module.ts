import { Module } from "@nestjs/common";
import { GATEIO_Module } from "./GATEIO/GATEIO.module";

@Module({
    imports : [
        GATEIO_Module,
    ],
})
export class ArbitrageModule {}

