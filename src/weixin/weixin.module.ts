import { Module } from "@nestjs/common";
import { MiniAppService } from "./miniapp/miniapp.service";
import { ConfigureModule } from "../configure/configure.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthorizeEvidence } from "./common/common.entities";
import { MiniAppController } from "./miniapp/miniapp.controller";
import { WeixinService } from "./weixin.service";

@Module({
    imports : [
        ConfigureModule,
        TypeOrmModule.forFeature([
            AuthorizeEvidence,
        ]),
    ],
    providers : [
        MiniAppService,
        WeixinService,
    ],
    exports : [
        MiniAppService,
        WeixinService,
    ],
    controllers : [
        MiniAppController,
    ],
})
export class WeixinModule {}