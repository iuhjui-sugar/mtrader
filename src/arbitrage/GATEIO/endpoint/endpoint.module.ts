import { Module } from "@nestjs/common";
import { UserModule } from "../../../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GateIOEndpoint } from "./endpoint.entities";
import { EndpointService } from "./endpoint.service";
import { AccessorModule } from "../accessor";

@Module({
    imports : [
        UserModule,
        AccessorModule,
        TypeOrmModule.forFeature([
            GateIOEndpoint,
        ]),
    ],
    providers : [
        EndpointService,
    ],
    exports : [
        EndpointService,
    ],
})
export class EndpointModule {}