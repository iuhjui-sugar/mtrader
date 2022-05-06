import { Module } from "@nestjs/common";
import { AccessorModule } from "../accessor";
import { EndpointModule } from "../endpoint";
import { AccountService } from "./account.service";

@Module({
    imports : [
        AccessorModule,
        EndpointModule,
    ],
    providers : [
        AccountService
    ],
    exports : [
        AccountService
    ],
})
export class AccountModule {}



